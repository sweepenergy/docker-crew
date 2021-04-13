// require axios for promise based architecture 
//const axios = require('axios');

// require express for post request req.body's
const express = require("express");

// set sweepapi base url
const sweepAPI = require('./sweepapi_auth');

module.exports = function(app, axios){
    // parse incoming Request Objects as a JSON Object
    app.use(express.urlencoded({extended: true}))

    // Display UI page for adding directory
    app.get("/addDirectory", function(req,res){
        res.render("addDirectory");
    });

    // Post request to api when submit pressed
    app.post("/addDirectory", function(req, res){

        var dirData = req.body;
        //console.log(dirData);

        
        axios.post(sweepAPI.url + "directory", dirData, sweepAPI.config)
            .then(function(response){
                console.log(response);
    
            }).catch(function(error){
                console.log(error);
            })
    
        // return user to homepage
        res.redirect("/");
        
    });

    app.get("/deleteDirectory", function(req, res){
        var dirData = req.body;
        console.log(dirData);

        /*
        axios.post(sweepAPI.url + "directory/" + dirData, sweepAPI.config)
            .then(function(response){
                console.log(response);
                console.log (dirData);
                
    
            }).catch(function(error){
                console.log(error);
            })
    
        // return user to homepage
        res.redirect("/");
        */
    });
}