var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = "deer argue receive pond yellow chief rabbit cinnamon obey proud axis design";

module.exports = {
  networks: {
    development: {
      // provider: function() {
      //   return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      // },
      host: "127.0.0.1",
      port: 8545,
      network_id: '*',
      gas: 9999999
    }
  },
  compilers: {
    solc: {
      version: "^0.5.16"
    }
  }
};