exports.id=0,exports.modules={"./src/server/server.js":function(e,t,n){"use strict";n.r(t);var o=n("./build/contracts/FlightSuretyApp.json"),c=n("./build/contracts/FlightSuretyData.json"),s=n("./src/server/config.json"),a=n("web3"),r=n.n(a),l=n("express"),i=n.n(l),u=(n("cors"),s.localhost),f=new r.a(new r.a.providers.WebsocketProvider(u.url.replace("http","ws")));f.eth.defaultAccount=f.eth.accounts[0];var d=new f.eth.Contract(o.abi,u.appAddress),g=new f.eth.Contract(c.abi,u.dataAddress),h=[],m=[],v=10,p=i()();p.listen(80,(function(){console.log("CORS-enabled web server listening on port 80")})),p.get("/api/status/:status",(function(e,t){var n="Status changed to: ";switch(e.params.status){case"10":v=10,n=n.concat("ON TIME");break;case"20":v=20,n=n.concat("LATE AIRLINE");break;case"30":v=30,n=n.concat("LATE WEATHER");break;case"40":v=40,n=n.concat("LATE TECHNICAL");break;case"50":v=50,n=n.concat("LATE OTHER");break;default:v=0,n=n.concat("UNKNOWN")}t.send({message:n})})),d.events.OracleRequest({fromBlock:"latest"},(function(e,t){e&&console.log(e),console.log(t);var n=t.returnValues.index;console.log("Triggered index: ".concat(n));var o=0;m.forEach((function(e){var c=h[o];e[0]!=n&&e[1]!=n&&e[2]!=n||(console.log("Oracle: ".concat(c," triggered. Indexes: ").concat(e,".")),function(e,t,n,o,c){var s={index:t,airline:n,flight:o,timestamp:c,statusCode:v};d.methods.submitOracleResponse(t,n,o,c,v).send({from:e,gas:5e5,gasPrice:2e7},(function(e,t){e&&console.log(e,s)})),20==v&&g.methods.creditInsurees(o).call({from:e},(function(e,t){e?console.log(e,s):console.log("Credit set for insurees")}))}(c,n,t.returnValues.airline,t.returnValues.flight,t.returnValues.timestamp)),o++}))})),g.events.allEvents({fromBlock:"latest"},(function(e,t){e?(console.log("error"),console.log(e)):(console.log("event:"),console.log(t))})),new Promise((function(e,t){f.eth.getAccounts().then((function(e){h=e.slice(20,45)})).catch((function(e){t(e)})).then((function(){e(h)}))})).then((function(e){(function(e){return new Promise((function(t,n){d.methods.REGISTRATION_FEE().call().then((function(o){for(var c=function(t){d.methods.registerOracle().send({from:e[t],value:o,gas:5e6,gasPrice:2e7}).then((function(){d.methods.getMyIndexes().call({from:e[t]}).then((function(n){console.log("Oracle ".concat(t," Registered at ").concat(e[t]," with [").concat(n,"] indexes.")),m.push(n)})).catch((function(e){n(e)}))})).catch((function(e){n(e)}))},s=0;s<25;s++)c(s);t(m)})).catch((function(e){n(e)}))}))})(e).catch((function(e){console.log(e.message)}))})),t.default=p}};