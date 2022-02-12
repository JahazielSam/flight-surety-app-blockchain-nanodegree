
var Test = require('../config/testConfig.js');
// var BigNumber = require('bignumber.js');
var Web3 = require('web3');
// const web3 = new Web3(ganache.provider());

contract('Flight Surety Tests', async (accounts) => {

  const TEST_ORACLES_COUNT = 20;
  const STATUS_CODE_LATE_AIRLINE = 20;
  var config;
  var flightTimestamp;

  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address, { from: accounts[0] });
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`App contract is authorized by Data contract`, async function () {

    // Get operating status
    let opStatus = await config.flightSuretyData.isAuthorized.call(config.flightSuretyApp.address);
    assert.equal(opStatus, true, "App contract should be an authorized one.");

  });

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let opStatus = await config.flightSuretyData.isOperational.call();
    assert.equal(opStatus, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let denyAccessFlag = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
        denyAccessFlag = true;
      }
      assert.equal(denyAccessFlag, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let denyAccessFlag = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
        denyAccessFlag = true;
      }
      assert.equal(denyAccessFlag, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let revertFlag = false;
      try 
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
        revertFlag = true;
      }
      assert.equal(revertFlag, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });

  it('Contract owner is registered as an airline initially when the contract is first deployed', async () => {
    let airlinesCount = await config.flightSuretyData.airlinesCount.call(); 
    let isAirline = await config.flightSuretyData.isAirline.call(accounts[0]); 
    assert.equal(isAirline, true, "First airline should be registired at contract deploy.");
    assert.equal(airlinesCount, 1, "Airlines count should be one after contract deploy.");
  });

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {
    
    let newAirline = accounts[2];

    try {
        await config.flightSuretyData.registerAirline(newAirline, {from: config.firstAirline});
    }
    catch(e) {

    }
    let result = await config.flightSuretyData.isAirline.call(newAirline); 

    assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");
  });

  it('(airline) can register an Airline using registerAirline() directly without need of a consensus', async () => {
    
    let recievedFunds = await config.flightSuretyData.MINIMUM_FUNDS.call();

    try {
        await config.flightSuretyData.fund({from: accounts[0], value: recievedFunds});
        await config.flightSuretyApp.registerAirline(config.firstAirline, "sample airline 2 name", {from: accounts[0]});
    }
    catch(e) {
      console.log(e);
    }
    let airlinesCount = await config.flightSuretyData.airlinesCount.call(); 
    let result = await config.flightSuretyData.isAirline.call(config.firstAirline); 

    assert.equal(result, true, "Airline should be able to register another airline directly if there are less than 4 registered");
    assert.equal(airlinesCount, 2, "Airlines count should be one after contract deploy.");
  });

  it("An airline needs 50% (of existing airline count) votes to register an Airline using registerAirline() once there are 4 or more airlines registered", async () => {

    try {
        await config.flightSuretyApp.registerAirline(accounts[2], "dummy airline 3 name", {from: accounts[0]});
        await config.flightSuretyApp.registerAirline(accounts[3], "dummy airline 4 name", {from: accounts[0]});
        await config.flightSuretyApp.registerAirline(accounts[4], "dummy airline 5 name", {from: accounts[0]});
    }
    catch(e) {
      console.log(e);
    }
    let result = await config.flightSuretyData.isAirline.call(accounts[4]);
    let airlinesCount = await config.flightSuretyData.airlinesCount.call(); 

    assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");
    assert.equal(airlinesCount, 4, "Airlines count should be one after contract deploy.");
  });

  it('(airline) can register a flight using registerFlight()', async () => {
   
    flightTimestamp = Math.floor(Date.now() / 1000); //convert timestamp from miliseconds (javascript) to seconds (solidity)

    
    try {
        await config.flightSuretyApp.registerFlight("AB27", "CBE", flightTimestamp, {from: config.firstAirline});
    }
    catch(e) {
      console.log(e);
    }
  });

  it("(passenger) may pay up to 1 ether for purchasing flight insurance.", async () => {
    
    let passengerPrice = await config.flightSuretyData.INSURANCE_PRICE_LIMIT.call();

    try {
        await config.flightSuretyData.buy("AB27", {from: config.firstPassenger, value: passengerPrice});
    }
    catch(e) {
      console.log(e);
    }

    let registeredPassenger = await config.flightSuretyData.passengerAddresses.call(0); 
    assert.equal(registeredPassenger, config.firstPassenger, "Passenger should be added to list of people who bought a ticket.");
  });
  

});
