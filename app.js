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

// set EJS as templating engine
app.set('view engine', 'ejs');

// require axios for promise based architecture 
const axios = require('axios');

// set sweepapi base url
const sweepAPI = require('./routes/sweepapi_auth');

// import other endpoints/route files
require('./routes/sweepapi_setup')(app); // import /setup endpoint
require('./routes/sweepapi_streams')(app);
require('./routes/sweepapi_directories')(app); // import /addDirectory endpoints


// db things 
const Directory = require('./models/directory.js');
const Stream = require('./models/stream.js');
require('./routes/mongoose')(app, Directory, Stream); 

// homepage endpoint (site root directory)
app.get("/", function(req, res){

    // Redirect user to setup page if .env doesnt contain sweep api authentication
    if(!(sweepAPI.getKey() || sweepAPI.getToken())){
        res.redirect('/setup');
    }

    // Display Homepage 
    axios.get(sweepAPI.url + "directory/home", sweepAPI.config).then(function(response){
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

app.get('/directories', function(req,res){

    axios.get(sweepAPI.url + "directory/home", sweepAPI.config).then(function(response){
        console.log(response.data);
        res.render("directories", {
            homeDirectory: response.data
        });


    }).catch(function(error){
        console.log("This is the error" + error);
    });


});





app.get('/directoryData/:id', function(req,res){
    const id = req.params.id;
    console.log(id);
    

    axios.get(sweepAPI.url +"directory/" + id, sweepAPI.config).then(function(response){
        console.log(response.data);
        res.render("directoryData", {
            dirData: response.data
        })
    }).catch( function(error){
        console.log(error);
    })
    

    // res.render("streamData.ejs", {SD:localStreams});
})

// axios.get(baseURL+"stream/"+currentStreamID, config).then(function(response){
    //     console.log(response.data);
    //     // res.render("streams",{
    //     //     streamIDs: response.data
    //     // });
    // }).catch(function(error){
    //     console.log("This is the error" + error);
    // });

app.get("/streamData/:id", function(req,res){
    const id = req.params.id;
    console.log(id);

    axios.get(sweepAPI.url +"stream/"+id, sweepAPI.config)
            .then(function(response){
                console.log(response.data);
                res.render("streamData",{
                    streamData:response.data
                })
            })
            .catch( function(error){
                console.log(error);
            })
});


app.get("/addStream", function(req,res){
    res.render("addStream.ejs");
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

    res.redirect("/addStream")
});



app.get("/addDevice", function(req,res){
    res.render("addDevice.ejs");
});


app.post("/addDevice", function(req,res){
    var data = req.body;
    console.log(data);

    //gets added to MongoDB
    Stream.create({
        var_name: data.var_name,
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
    response.send(`Error! route does not exist! Please return home to http://${HOST}:${PORT}`);
});


//  Bind application to port
var server = app.listen(PORT, HOST, () => {
    // Print address server is binding to
    console.log(`Example app listening at http://${HOST}:${PORT}`);
});