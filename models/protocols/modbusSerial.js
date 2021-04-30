//--IMPORT REQUIRED MODULES--//
var ModbusRTU = require("modbus-serial");

// Accessing v8 module for reading doubles (see: https://www.geeksforgeeks.org/node-js-v8-deserializer-readdouble-method/)
const v8 = require('v8');
const serializer = new v8.Serializer();


//--EXPORT CLASS METHODS--//
module.export = {
    
    new: () => {
        return new ModbusRTU();
    },

    //Connect to device function
    connect: (address, port, id) => {
        server = new ModbusRTU();
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
        var buffer = null;
        if(true){ //check if register is a holding register
            // check if register is float/double or int
            if (format.includes(float) || format.includes(double)){
                //read as float
                server.readHoldingRegisters(register, 2, function(error, data){
                    buffer = data.buffer;
                });
            }else{
                server.readHoldingRegisters(register, 1, function(error, data){
                    buffer = data.buffer;
                });
            }
            
            return buffer;

            //TODO: check if format is int/float/double and LE/BE

        }

        
    }



}