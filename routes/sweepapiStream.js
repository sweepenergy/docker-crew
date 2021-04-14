// require axios for promise based architecture 
const axios = require('axios');

// set sweepapi base url
const sweepAPI = require('./sweepapiAuth');

//---ROUTES TO EXPORT---//
module.exports = function(app) {

    app.get("/addStream", function(req,res){
        res.render('addStream');
    });
    
    app.post("/addStream", function(req,res){
    
        var streamData = req.body;
        console.log(streamData);
    
        axios.post(sweepAPI.url + "stream", streamData, sweepAPI.config)
        .then(function(response){
            console.log(response);
            
    
        }).catch(function(error){
            console.log(error);
        })
    
        //return user home after adding stream
        res.redirect('/')
    });

    app.get("/streamData/:id", function(req,res){
        const id = req.params.id;
        console.log(id);
    
        axios.get(sweepAPI.url + "stream/" + id, sweepAPI.config)
            .then(function(response){
                console.log(response.data);
                res.render("streamData",{
                    streamData:response.data
                })
            })
            .catch( function(error){
                console.log(error);
            });
            
    });
};