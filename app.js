// check if in development or production mode
if (process.env.NODE_ENV !== 'production') {
    // require dotenv module to read environmental variables from .env file
    require('dotenv').config();
}

// read port and host addresses from .env file or cloud host's default
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

// require expressjs module
const express = require("express");
const app = express();

// parse incoming Request Objects as a JSON Object for post requests
app.use(express.urlencoded({extended: true}))

// set EJS as templating engine
app.set('view engine', 'ejs');
// set public as location of css files
app.use(express.static(__dirname + '/public'));

// require axios for promise based architecture 
const axios = require('axios');

// import sweepAuth module Sweep API Authentication from env variables + sets api base url
const sweepAPI = require('./routes/sweepapiAuth');

// import other endpoints/route files
require('./routes/sweepapiSetup')(app); // import /setup endpoint
require('./routes/sweepapiStream')(app);
require('./routes/sweepapiDirectory')(app); // import /addDirectory endpoints
require('./routes/device')(app); 

// db things 
require('./routes/mongoose')(app); 

// homepage endpoint (site root directory)
app.get("/", function(req, res){

    // Redirect user to setup page if sweep api authentication undefined
    if(!(sweepAPI.getKey() || sweepAPI.getToken())){
        res.redirect('/setup');
    }

    // STREATCH GOAL: Check app user login (non Sweep API)

    // Display Homepage 
  axios.get(sweepAPI.url + "directory/home", sweepAPI.config).then(function(response){
        //console.log(response.data);
        res.render("homepage", {
            homeDirectory : response.data
        });

    }).catch(function(error){
        console.log("Error: " + error);
    });
});


app.get('/list', function(req,res){
    
    Stream.find({}, function(error,streams){
        if(error){
            console.log("There was a problem finding stream in database")
            console.log(error);
        }else{
            res.render('list.ejs',{
                currentList : streams
            });
        }
    });

});

app.get("/search", function(req,res){
    res.render("search.ejs");
});


app.get('/test', function(req,res){

    var searchTerm = req.query.searchterm;
    // var searchTerm = "ad9fe988-484d-43b4-83ce-4c7a8b10b6e8";
    console.log(searchTerm);

    axios.get(sweepAPI.url + "account/auth/api_key/" + searchTerm, {
        headers: {
            'Content-Type': 'application/json',
            'data-raw': ''
        },
                    
        auth:{
            username: process.env.AUTH_KEY,
            password: process.env.AUTH_TOKEN
        }
    }).then(function(response){
        res.render("test", {
            ActiveAPIs: response.data
        });

    }).catch(function(error){
        console.log("Error: " + error);
    });

});


// Return error if user attempts to access endpoint that isnt defined
app.get("*", function(request, response){
    response.send(`Error! route to "${request.originalUrl}" does not exist! Please return home to http://${HOST}:${PORT}`);
});


//  Bind application to port
var server = app.listen(PORT, HOST, () => {
    // Print address server is binding to
    console.log(`Example app listening at http://${HOST}:${PORT}`);
});