
 const express = require("express");
 const morgan = require("morgan");
 const bodyParser = require("body-parser");

 import app from './server'
 
 class ApplicationServer {
 
     constructor() {
         //Express application object
         this.app = app
         this.initExpress();
         //Method that initialized middleware modules
         this.initExpressMiddleWare();
         //Method that initialized the controllers where you defined the endpoints
         this.initControllers();
         //Method that run the express application.
         this.start();
     }
 
     initExpress() {
         this.app.set("port", 3000);
     }
 
     initExpressMiddleWare() {
         this.app.use(morgan("dev"));
         this.app.use(bodyParser.urlencoded({extended:true}));
         this.app.use(bodyParser.json());
     }
 
     initControllers() {
        //  require("./BlockchainController.js")(this.app, this.blockchain);
     }
 
     start() {
         let self = this;
         this.app.listen(this.app.get("port"), () => {
             console.log(`Server Listening for port: ${self.app.get("port")}`);
         });
     }
 
 }
 
 new ApplicationServer();