//---IMPORT/REQUIRE NECESSARY MODULES HERE---//
// require axios for promise based architecture 
const axios = require('axios');

//file writing
const fs = require('fs');
// require('dotenv').config();
const {
    parse,
    stringify
} = require('envfile');

const envPath = '.env'

// console.log(parse(envPath))
// let parsedFile = parse(envPath);
// parsedFile.NEW_VAR = 'newVariableValue'
// fs.appendFileSync(envPath, stringify(parsedFile)) 
// console.log(stringify(parsedFile))

// import sweepAuth module Sweep API Authentication from env variables + sets api base url
const sweepAPI = require('./sweepapiAuth');

//TODO: add check for if auth_key and auth_token are valid before redirecting home

//---ROUTES TO EXPORT---//
module.exports = function(app){

    // User can input or request sweep api authentication
    app.get('/setup', function(req, res){

        //TODO: 
        // Get auth key and token using email + password for Sweep API
        res.redirect('/login');
        // Write auth key and token to .env file

        // STREATCH GOALS: 
        // - save auth key and token to local database
        // - create account endpoint

        // render html from ./views/sweep_api_auth.ejs
        res.render('sweepAuth', {
            url: process.env.URL ,
            sweep_api:[process.env.AUTH_KEY, process.env.AUTH_TOKEN]
        });
    });

    // Display UI for SweepAPI login
    app.get('/login', function(req,res){

        res.render("login");
    });

    //Get api token and key from existing Sweep API account
    app.get('/login', function(req, res, next) { 

        axios.get(sweepAPI.url + "account/verify_auth", sweepAPI.config).then(function(response){
            res.render("directories", {
                homeDirectory: response.data
            });
    
    
        }).catch(function(error){
            console.log("Error:" + error);
        });
        
        //return user to homepage
        res.render('/');
    }); 

    //used this post request to make valid verification check, one above wasn't nice

    app.post('/verification_Check', function(req, res) { 

        var accountData = req.body;

        // TODO: Fix async function to write auth key and token
        /* async function f() {
            axios.post(sweepAPI.url + "account/auth", accountData, sweepAPI.config)
            .then(function(response){
                // console.log(response.data);
                if(response.data.status === "error_not_valid_auth" ){
                    
                    res.redirect('/login');
                }
                else{
                    let parsedFile = parse(envPath);

                    console.log(response.data.session_id)
                    console.log(response.data.session_token)
                    parsedFile.AUTH_KEY = response.data.session_id
                    parsedFile.AUTH_TOKEN = response.data.session_token
                    parsedFile.fingerprint = response.data.session_id
                    parsedFile.token = response.data.session_token
                    
                    fs.appendFileSync(envPath, stringify(parsedFile)) 

                    fs.appendFile('SessionData.txt', "\n"+response.data.session_id +":"+ response.data.session_token, function(err){
                        if(err){
                            return console.log(err);
                        }
                        console.log("written successfully");
                    })

                    res.redirect('/');
                    
                    // res.render("directories", {
                    //     homeDirectory: response.data
        
                        
                    // });
                    // res.redirect('/');
                }


            })
            .catch(function(error){
                console.log(error);
            });
        } */


        // NOTE: The following chunck gets auth key and token from sweep api and writes it to .env
        axios.post(sweepAPI.url + "account/auth", accountData, sweepAPI.config)
        .then(function(response){
            // console.log(response.data);
            if(response.data.status === "error_not_valid_auth" ){
                
                res.redirect('/login');
            }
            else{
                let parsedFile = parse(envPath);

                console.log(response.data.session_id)
                console.log(response.data.session_token)
                parsedFile.AUTH_KEY = response.data.session_id
                parsedFile.AUTH_TOKEN = response.data.session_token
                parsedFile.fingerprint = response.data.session_id
                parsedFile.token = response.data.session_token
                
                fs.appendFileSync(envPath, stringify(parsedFile)) 

                fs.appendFile('SessionData.txt', "\n"+response.data.session_id +":"+ response.data.session_token, function(err){
                    if(err){
                        return console.log(err);
                    }
                    console.log("written successfully");
                })

                res.redirect('/');
                
            }

        })
        .catch(function(error){
            console.log(error);
        });

    });

    //--STREATCH GOAL--/
    app.get('/createAccount', function(req, res){
        res.render('newAccount');
    });

    app.post('/createAccount', function(req, res){

        console.log(req.body);

        axios.post(sweepAPI.url + "account/auth/api_key", req.body, sweepAPI.config)
            .then(function(response){
                console.log(response);
    
            }).catch(function(error){
                console.log(error);
            })
    
        // return user to homepage
        res.redirect("/");
    });

    app.get('/apis', function(req,res){

        axios.get(sweepAPI.url + "account/auth/api_key/", sweepAPI.config).then(function(response){
            res.render("apis", {
                ActiveAPIs: response.data
            });
            
    
        }).catch(function(error){
            console.log("This is the error" + error);
        });
    
        // res.render("apis.ejs");
    });


};


