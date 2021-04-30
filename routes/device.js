//---IMPORT/REQUIRE NECESSARY MODULES HERE---//
// require axios for promise based architecture 
const axios = require('axios');

// import sweepAuth module Sweep API Authentication from env variables + sets api base url
const sweepAPI = require('./sweepapiAuth');

const Stream = require('../models/stream.js');

//--IMPORT SUPPORTED PROTOCOLS--
//const modbusSerial = require('../models/protocols/modbusSerial');
var ModbusRTU = require("modbus-serial");
require('../models/protocols/modbusTCP');

//--SUPPORTED PROTOCOLS--//
// Key is protocol name, value is path to connection html
var protocols = {
    "Please Select A Protocol": '',
    "Modbus TCP/IP": '../views/forms/connectModbusTCP.ejs',

};

//---ROUTES TO EXPORT---//
module.exports = function(app){

    // Direct user to addDevice page
    app.get("/addDevice", function(req,res){
        res.render('addDevice',{
            protocols: protocols
        });
    });
    
    // post device to stream
    app.post("/addDevice", function(req,res){
        var data = req.body;
        console.log(data);

        var server = new ModbusRTU()
        server.connectTCP(data.host_ip, {port: data.port})
            .then(function(){
                server.setID(parseInt(data.device_id,10));
                server.setTimeout(1000);
            }).then(function(){
                //report sucess
                console.log(`Connected device ${data.device_name} to stream ${data.stream_id} on ${data.host_ip}:${data.port}`)
                server.readHoldingRegisters(parseInt(data.register), 2, function(error, data){
                    //console.log(error);
                    console.log(data.buffer.readFloatBE());
                });
            }).catch(function(e) {
                //print error if errors out
                console.log(e.message); 
            });
        //TODO:
        //Json object with timestap + sample
        /*
        var x = {
            timestamp: '',
            sample: data.buffer.readFloatBE().toString
        }; ^ we can turn data.buffer.... to a var

        JSON.stringify(x);

        */
        //Call api post 
        

        /*
        //Add Device to MongoDB
        Stream.create({
            var_name: data.var_name,ß
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
        */
    });

};

