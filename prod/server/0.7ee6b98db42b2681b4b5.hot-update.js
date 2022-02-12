exports.id=0,exports.modules={"./src/server/server.js":function(e,t,n){"use strict";n.r(t);var o=n("./build/contracts/FlightSuretyApp.json"),s=n("./build/contracts/FlightSuretyData.json"),c=n("./src/server/config.json"),a=n("web3"),r=n.n(a),l=n("express"),i=n.n(l),u=(n("cors"),c.localhost),d=new r.a(new r.a.providers.WebsocketProvider(u.url.replace("http","ws")));d.eth.defaultAccount=d.eth.accounts[0];var f=new d.eth.Contract(o.abi,u.appAddress),h=new d.eth.Contract(s.abi,u.dataAddress),g=[],A=[],p=10,m=i()();m.use((function(e,t,n){t.header("Access-Control-Allow-Origin","*"),t.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept"),n()})),m.listen(80,(function(){console.log("CORS-enabled web server listening on port 80")})),m.all("/*",(function(e,t,n){t.header("Access-Control-Allow-Origin","http://localhost:8080"),t.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE"),t.header("Access-Control-Allow-Headers","X-Requested-With,     Content-Type"),n()})),m.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),m.get("/api/status/:status",(function(e,t){var n=e.params.status;alert("status-"+n+"-status");var o="Status changed to: ";switch(n){case"10":p=10,o=o.concat("ON TIME");break;case 20:case"20":p=20,o=o.concat("LATE AIRLINE");break;case"30":p=30,o=o.concat("LATE WEATHER");break;case"40":p=40,o=o.concat("LATE TECHNICAL");break;case"50":p=50,o=o.concat("LATE OTHER");break;default:p=0,o=o.concat("UNKNOWN")}t.send({message:o})})),f.events.OracleRequest({fromBlock:"latest"},(function(e,t){e&&console.log(e),console.log(t);var n=t.returnValues.index;console.log("Triggered index: ".concat(n));var o=0;A.forEach((function(e){var s=g[o];e[0]!=n&&e[1]!=n&&e[2]!=n||(console.log("Oracle: ".concat(s," triggered. Indexes: ").concat(e,".")),function(e,t,n,o,s){var c={index:t,airline:n,flight:o,timestamp:s,statusCode:p};f.methods.submitOracleResponse(t,n,o,s,p).send({from:e,gas:5e5,gasPrice:2e7},(function(e,t){e&&console.log(e,c)})),20==p&&h.methods.creditInsurees(o).call({from:e},(function(e,t){e?console.log(e,c):console.log("Credit set for insurees")}))}(s,n,t.returnValues.airline,t.returnValues.flight,t.returnValues.timestamp)),o++}))})),h.events.allEvents({fromBlock:"latest"},(function(e,t){e?(console.log("error"),console.log(e)):(console.log("event:"),console.log(t))})),new Promise((function(e,t){d.eth.getAccounts().then((function(e){g=e.slice(20,45)})).catch((function(e){t(e)})).then((function(){e(g)}))})).then((function(e){(function(e){return new Promise((function(t,n){f.methods.REGISTRATION_FEE().call().then((function(o){for(var s=function(t){f.methods.registerOracle().send({from:e[t],value:o,gas:5e6,gasPrice:2e7}).then((function(){f.methods.getMyIndexes().call({from:e[t]}).then((function(n){console.log("Oracle ".concat(t," Registered at ").concat(e[t]," with [").concat(n,"] indexes.")),A.push(n)})).catch((function(e){n(e)}))})).catch((function(e){n(e)}))},c=0;c<25;c++)s(c);t(A)})).catch((function(e){n(e)}))}))})(e).catch((function(e){console.log(e.message)}))})),t.default=m}};