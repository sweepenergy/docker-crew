// require axios for promise based architecture 
const axios = require('axios');

// require express for post request req.body's
const express = require("express");

// set sweepapi base url
const sweepAPI = require('./sweepapi_auth');

// Routes for Sweep api calls
module.exports = function(app){

    // parse incoming Request Objects as a JSON Object
    app.use(express.urlencoded({extended: true}))

    // User can input or request sweep api authentication
    app.get('/setup', function(req, res){

        // render html from ./views/sweep_api_auth.ejs
        res.render('sweepAuth', {
            url: process.env.URL ,
            sweep_api:[process.env.AUTH_KEY, process.env.AUTH_TOKEN]
        });
    });

    app.get('/login', function(req,res){
        res.render("login");
    });

    app.post('/login', function(req, res) { 

        var dirData = req.body;
        console.log(dirData);

        axios.get(sweepAPI.url + "account/auth", sweepAPI.config)
            .then(function(response){
                console.log(response);
        
        
            }).catch(function(error){
                console.log("Error:" + error);
            });

        //return home if success
        res.render('/');
    }); 
};


