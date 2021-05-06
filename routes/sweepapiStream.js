// require axios for promise based architecture 
const axios = require('axios');

// set sweepapi base url
const sweepAPI = require('./sweepapiAuth');

//---ROUTES TO EXPORT---//
module.exports = function(app) {

    app.get("/addStream", function(req,res){
        axios.get(sweepAPI.url + "directory/home", sweepAPI.config()).then(function(response){
            res.render("addStream", {
                
                homeDirectory : response.data
            });
    
    
        }).catch(function(error){
            console.log("This is the error" + error);
        });
    });
    
    app.post("/addStream", function(req,res){
    
        var streamData = req.body;
        // console.log(streamData);
    
        axios.post(sweepAPI.url + "stream", streamData, sweepAPI.config())
        .then(function(response){
            console.log(response);
            res.redirect('/')
    
        }).catch(function(error){
            console.log(error);
        })
    
        //return user home after adding stream
        // res.redirect('/')
    });

    app.get("/streamData/:id", function(req,res){
        const id = req.params.id;
        console.log(id);
    
        axios.get(sweepAPI.url + "stream/" + id, sweepAPI.config())
            .then(function(response){
                // console.log(response.data);
                res.render("streamData",{
                    streamData:response.data
                })
            })
            .catch( function(error){
                console.log(error);
            });
            
    });

    app.get("/streamDataSet/:id/ts/:var_name/dataset",function(req,res){
        const id = req.params.id;
        const var_name = req.params.var_name;

        console.log("ID in /streamdataset " + id);
        console.log("Varname in /streamdataset " + var_name);

        // stream/5b6efd8a-cd1d-4bc2-82b7-d410579b1787/ts/current_b/dataset
        //currently on listing data as span = 1 hour, time scale = 1 month
        axios.get(sweepAPI.url + "stream/" + id + "/ts/" + var_name + "/dataset?span=1h&time_scale=1m&range_start=2018-01-01T08:00:00.000Z&range_end=2021-04-24T05:14:57.027Z&limit=&ts_type=avg", sweepAPI.config())
            .then(function(response){
                // console.log(response.data);
                res.render("streamDataSet", {
                    DataSet: response.data
                });
            })
            .catch(function(error){
                console.log(error);
            })
    });

    app.get("/createStream/:id", function(req,res){
        const id = req.params.id;

        res.render("createStream", {
            StreamID: id
        });

    });

    app.post("/createStream/:id", function(req,res){
        const id = req.params.id;

        // console.log(req.body);
        var tempData = req.body;

        axios.post(sweepAPI.url+"stream/"+id+"/ts", tempData, sweepAPI.config())
        .then(function(response){
            console.log(response);

        }).catch(function(error){
            console.log(error);
        })

        


    });
    
    app.get("/deleteStream", function(req,res){
        res.render("deleteStream");

    });


    app.get("/deleteStream/:id", function(req,res){
        const streamID = req.params.id;

        axios.delete(sweepAPI.url + "stream/" + streamID, sweepAPI.config())
        .then(function(response){
            res.redirect("/")
            console.log(response);

        }).catch(function(error){
            console.log(error);
        })

    });

};