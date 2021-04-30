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

//file write
var fs = require('fs');

//--SUPPORTED PROTOCOLS--//
// Key is protocol name, value is path to connection html
var protocols = {
    "Modbus TCP/IP": '../views/forms/connectModbusTCP',

};

//---ROUTES TO EXPORT---//
module.exports = function(app){

    // Direct user to addDevice page
    //jakob: needed to add this in order to display available streams for selected directory
    app.get("/addDevice/:id/:var_name", function(req,res){

        console.log("HERE");
        const streamID = req.params.id;
        console.log(streamID);

        axios.get(sweepAPI.url+"stream/"+streamID, sweepAPI.config)
            .then(function(response){
                // console.log(response.data);
                res.render("addDevice",{
                    streamData : response.data,
                    protocols: protocols
                })
            })
            .catch( function(error){
                console.log(error);
            })
    });
    
   

    // post device to stream
    app.post("/addDevice/:id/:var_name", function(req,res){
        
        const streamID = req.params.id;
        const variableName = req.params.var_name;
        console.log("IN HERE: " + variableName)
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

                    DatatoString = data.buffer.readFloatBE().toString();
                    // return DatatoString;

                    console.log(DatatoString);
                    
                    
                    var temp = { 
                        "timestamp" : "",
                        "sample": DatatoString
                    };

                    
                    console.log(temp);

                    //currently updating data on hour by the week
                    axios.post(sweepAPI.url + "stream/"+streamID+"/ts/"+variableName+"/dataset?span=raw&time_scale=custom&range_start=2021-04-29T01:04:26.549Z&range_end=2021-04-29T02:04:26.549Z&limit=100&ts_type=undefined", temp, sweepAPI.config)
                    .then(function(response){
                        console.log(response.data);
                        
                    })
                    .catch( function(error){
                        console.log("THERE WAS AN ERROR");
                        // console.log(error);
                    });

                   

                });
            })
            .then(function(){
                res.redirect("/")
            })
            // .then(function(){
            //     console.log("data in next .then " + data.sample);

            //     axios.post(sweepAPI.url + "stream//ts/Voltage b//dataset", data, sweepAPI.config)
            //     .then(function(response){
            //         console.log(response.data);
                    
            //     })
            //     .catch( function(error){
            //         console.log("THERE WAS AN ERROR");
            //         // console.log(error);
            //     });
            // })
            .catch(function(e) {
                //print error if errors out
                console.log("this is where error is")
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

