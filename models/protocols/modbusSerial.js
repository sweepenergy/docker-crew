//--IMPORT REQUIRED MODULES--//
var ModbusRTU = require("modbus-serial");

// Accessing v8 module for reading doubles (see: https://www.geeksforgeeks.org/node-js-v8-deserializer-readdouble-method/)
const v8 = require('v8');
const serializer = new v8.Serializer();


//--EXPORT CLASS METHODS--//
modules.export = {
    new: () => {
        server = new ModbusRTU();
    },

    //Connect to device function
    connect: (address, port, id) => {
        server.connectTCP(address, {port: port})
            .then(function(){
                server.setID(id);
                server.setTimeout(1000);
            }).then(function(){
                //report sucess
                console.log(`Connected to device ${id} on ${address}:${port}`)
            }).catch(function(e) {
                //print error if errors out
                console.log(e.message); 
            });

    },

    readRegister: async (register, format) => {
        //check if register is holding register (btween 40001 and 49999)
        if(true){
            // check if register is float/double or int
            if (float){
                //read as float
                server.readHoldingRegisters(register, 2, function(error, data){
                    console.log(data.buffer.readFloatBE());
                });
            }else if (double){
                server.readHoldingRegisters(register, 1, function(error, data){
                    //read as double
                    console.log(data.data);
                });
            }else if (int){
                server.readHoldingRegisters(register, 1, function(error, data){
                    //read as int
                    console.log(data.data);
                });
            }
           

        }

        
    }



}