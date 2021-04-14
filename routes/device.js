//---IMPORT/REQUIRE NECESSARY MODULES HERE---//
// require axios for promise based architecture 
const axios = require('axios');

// import sweepAuth module Sweep API Authentication from env variables + sets api base url
const sweepAPI = require('./sweepapiAuth');

const Stream = require('../models/stream.js');

//--IMPORT SUPPORTED PROTOCOLS--
require('../models/protocols/modbusSerial');
require('../models/protocols/modbusTCP');


//---ROUTES TO EXPORT---//
module.exports = function(app){

    // Direct user to addDevice page
    app.get("/addDevice", function(req,res){
        res.render('addDevice');
    });
    
    // post device to stream
    app.post("/addDevice", function(req,res){
        var data = req.body;
        console.log(data);

    
        //Add Device to MongoDB
        Stream.create({
            var_name: data.var_name,
            display_name: data.display_name,
            description: data.description,
            units: data.units,
            type: data.type
        }, function(error,data){
            if(error){
                console.log("There was a problem adding this device data");
            }else{
                console.log("added successfully");
                console.log(data);
            }
        })
        res.redirect("/list");
    });

};

