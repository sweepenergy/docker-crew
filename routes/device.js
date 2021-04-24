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


//---ROUTES TO EXPORT---//
module.exports = function(app){

    // Direct user to addDevice page
    app.get("/addDevice", function(req,res){
        res.render('addDevice');
    });
    
    // const data = [];

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

                    DatatoString = data.buffer.readFloatBE().toString();
                    // return DatatoString;

                    console.log(DatatoString);
                    
                    // var data = [];
                    var temp = { 
                        "timestamp" : "",
                        "sample": DatatoString
                    };

                    // data.push(temp);


                    console.log(data);
                    

                    axios.post(sweepAPI.url + "stream/5b6efd8a-cd1d-4bc2-82b7-d410579b1787/ts/current_b/dataset", temp, sweepAPI.config)
                    .then(function(response){
                        console.log(response.data);
                        
                    })
                    .catch( function(error){
                        console.log("THERE WAS AN ERROR");
                        // console.log(error);
                    });

                    // .then(function(){
                    //     fs.readFile('dataset.json', function (err,data){
                    //         var json = JSON.parse(data);
                    //         json.push('sample: ' + temp);
        
                    //         fs.writeFile("dataset.json", JSON.stringify(json))
                    //     });
                    // })

                });
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

