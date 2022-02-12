exports.id=0,exports.modules={"./src/server/server.js":function(e,t,n){"use strict";n.r(t);var o=n("./build/contracts/FlightSuretyApp.json"),c=n("./build/contracts/FlightSuretyData.json"),s=n("./src/server/config.json"),a=n("web3"),r=n.n(a),l=n("express"),i=n.n(l),u=n("cors"),f=n.n(u),g=s.localhost,d=new r.a(new r.a.providers.WebsocketProvider(g.url.replace("http","ws")));d.eth.defaultAccount=d.eth.accounts[0];var h=new d.eth.Contract(o.abi,g.appAddress),m=new d.eth.Contract(c.abi,g.dataAddress),v=[],p=[],E=10,b=i()();b.use(f()({origin:"http://localhost:8000"})),b.listen(80,(function(){console.log("CORS-enabled web server listening on port 80")})),b.get("/api/status/:status",(function(e,t){var n="Status changed to: ";switch(e.params.status){case"10":E=10,n=n.concat("ON TIME");break;case"20":E=20,n=n.concat("LATE AIRLINE");break;case"30":E=30,n=n.concat("LATE WEATHER");break;case"40":E=40,n=n.concat("LATE TECHNICAL");break;case"50":E=50,n=n.concat("LATE OTHER");break;default:E=0,n=n.concat("UNKNOWN")}t.send({message:n})})),h.events.OracleRequest({fromBlock:"latest"},(function(e,t){e&&console.log(e),console.log(t);var n=t.returnValues.index;console.log("Triggered index: ".concat(n));var o=0;p.forEach((function(e){var c=v[o];e[0]!=n&&e[1]!=n&&e[2]!=n||(console.log("Oracle: ".concat(c," triggered. Indexes: ").concat(e,".")),function(e,t,n,o,c){var s={index:t,airline:n,flight:o,timestamp:c,statusCode:E};h.methods.submitOracleResponse(t,n,o,c,E).send({from:e,gas:5e5,gasPrice:2e7},(function(e,t){e&&console.log(e,s)})),20==E&&m.methods.creditInsurees(o).call({from:e},(function(e,t){e?console.log(e,s):console.log("Credit set for insurees")}))}(c,n,t.returnValues.airline,t.returnValues.flight,t.returnValues.timestamp)),o++}))})),m.events.allEvents({fromBlock:"latest"},(function(e,t){e?(console.log("error"),console.log(e)):(console.log("event:"),console.log(t))})),new Promise((function(e,t){d.eth.getAccounts().then((function(e){v=e.slice(20,45)})).catch((function(e){t(e)})).then((function(){e(v)}))})).then((function(e){(function(e){return new Promise((function(t,n){h.methods.REGISTRATION_FEE().call().then((function(o){for(var c=function(t){h.methods.registerOracle().send({from:e[t],value:o,gas:5e6,gasPrice:2e7}).then((function(){h.methods.getMyIndexes().call({from:e[t]}).then((function(n){console.log("Oracle ".concat(t," Registered at ").concat(e[t]," with [").concat(n,"] indexes.")),p.push(n)})).catch((function(e){n(e)}))})).catch((function(e){n(e)}))},s=0;s<25;s++)c(s);t(p)})).catch((function(e){n(e)}))}))})(e).catch((function(e){console.log(e.message)}))})),t.default=b}};