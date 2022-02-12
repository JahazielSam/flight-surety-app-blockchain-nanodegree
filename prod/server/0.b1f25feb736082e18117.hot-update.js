exports.id=0,exports.modules={"./src/server/server.js":function(e,t,o){"use strict";o.r(t);var n=o("./build/contracts/FlightSuretyApp.json"),s=o("./build/contracts/FlightSuretyData.json"),c=o("./src/server/config.json"),r=o("web3"),a=o.n(r),l=o("express"),i=o.n(l),u=(o("cors"),c.localhost),d=new a.a(new a.a.providers.WebsocketProvider(u.url.replace("http","ws")));d.eth.defaultAccount=d.eth.accounts[0];var f=new d.eth.Contract(n.abi,u.appAddress),g=new d.eth.Contract(s.abi,u.dataAddress),h=[],A=[],m=10,p=i()();p.use((function(e,t,o){t.setHeader("Access-Control-Allow-Origin","http://localhost:8888"),t.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS, PUT, PATCH, DELETE"),t.setHeader("Access-Control-Allow-Headers","X-Requested-With,content-type"),t.setHeader("Access-Control-Allow-Credentials",!0),o()})),p.listen(80,(function(){console.log("CORS-enabled web server listening on port 80")})),p.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),p.get("/api/status/:status",(function(e,t){var o="Status changed to: ";switch(e.params.status){case"10":m=10,o=o.concat("ON TIME");break;case"20":m=20,o=o.concat("LATE AIRLINE");break;case"30":m=30,o=o.concat("LATE WEATHER");break;case"40":m=40,o=o.concat("LATE TECHNICAL");break;case"50":m=50,o=o.concat("LATE OTHER");break;default:m=0,o=o.concat("UNKNOWN")}t.send({message:o})})),f.events.OracleRequest({fromBlock:"latest"},(function(e,t){e&&console.log(e),console.log(t);var o=t.returnValues.index;console.log("Triggered index: ".concat(o));var n=0;A.forEach((function(e){var s=h[n];e[0]!=o&&e[1]!=o&&e[2]!=o||(console.log("Oracle: ".concat(s," triggered. Indexes: ").concat(e,".")),function(e,t,o,n,s){var c={index:t,airline:o,flight:n,timestamp:s,statusCode:m};f.methods.submitOracleResponse(t,o,n,s,m).send({from:e,gas:5e5,gasPrice:2e7},(function(e,t){e&&console.log(e,c)})),20==m&&g.methods.creditInsurees(n).call({from:e},(function(e,t){e?console.log(e,c):console.log("Credit set for insurees")}))}(s,o,t.returnValues.airline,t.returnValues.flight,t.returnValues.timestamp)),n++}))})),g.events.allEvents({fromBlock:"latest"},(function(e,t){e?(console.log("error"),console.log(e)):(console.log("event:"),console.log(t))})),new Promise((function(e,t){d.eth.getAccounts().then((function(e){h=e.slice(20,45)})).catch((function(e){t(e)})).then((function(){e(h)}))})).then((function(e){(function(e){return new Promise((function(t,o){f.methods.REGISTRATION_FEE().call().then((function(n){for(var s=function(t){f.methods.registerOracle().send({from:e[t],value:n,gas:5e6,gasPrice:2e7}).then((function(){f.methods.getMyIndexes().call({from:e[t]}).then((function(o){console.log("Oracle ".concat(t," Registered at ").concat(e[t]," with [").concat(o,"] indexes.")),A.push(o)})).catch((function(e){o(e)}))})).catch((function(e){o(e)}))},c=0;c<25;c++)s(c);t(A)})).catch((function(e){o(e)}))}))})(e).catch((function(e){console.log(e.message)}))})),t.default=p},cors:function(e,t){e.exports=require("cors")}};