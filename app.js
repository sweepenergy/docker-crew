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
require('./routes/sweepapi_directories')(app, axios); // import /addDirectory endpoints

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

/*

// Return error if user attempts to access endpoint that isnt defined
app.get("*", function(request, response){
    response.send(`Error! route does not exist! Please return home to http://${HOST}:${PORT}`);
});
*/

//  Bind application to port
var server = app.listen(PORT, HOST, () => {
    // Print address server is binding to
    console.log(`Example app listening at http://${HOST}:${PORT}`);
});


const mongoose = require("mongoose");

const Directory = require('./models/directory.js');
const Stream = require('./models/stream.js');


mongoose.connect(process.env.URI,{
   useNewUrlParser: true,
   useUnifiedTopology: true
}, function(error){
    if(error){
        console.log(error);
    }else{
        console.log("connected to the database");
    }
});


const headers = {
    'Content-Type': 'application/json',
    'data-raw': ''
}


//looking for static files inside public
app.use(express.static(__dirname +"/public"));


app.get('/dbHome', function(req,res){
    Directory.find()
    .then((result) =>{
        res.render("dbHome", {
            directories: result
        })
    })
    .catch((err) => {
        console.log(err);
    })

});

app.post('/dbHome', function(req,res){
    const directory = new Directory(req.body);

    directory.save()
        .then((result) => {
            res.redirect('/dbHome');
        })
        .catch((err) => {
            console.log(err);
        })

});

app.get("/dbAddDirectory", function(req,res){
    res.render("dbAddDirectory.ejs");
})

app.get("/dbHome/:id", function(req,res){
    const id = req.params.id;
    
    Directory.findById(id, function(err, docs){
        if(err){
            console.log(err);
        }
        // else if(id != "style.css"){
        else{
            console.log("result: ", docs);
            res.render('directoryDetails', {
                    directory: docs 
                })
        }
    });

    // Directory.findById(id)
    //     .then(result=>{
            
    //         console.log("rendering data...");

    //         res.render('directoryDetails', {
    //             directory: result  
    //         })
    //     })
    //     .catch((err) =>{
    //         console.log(err);
    //     })
        
    console.log("Selected id: " + id);
});

//AJAX REQUEST
app.delete('/dbHome/:id', function(req,res){
    const id = req.params.if;

    Directory.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/dbHome'})
        })
        .catch(err => console.log(err));
})

app.get('/login', function(req, res, next) { 


    axios.get(baseURL + "account/verify_auth", config).then(function(response){
        res.render("directories", {
            homeDirectory: response.data
        });


    }).catch(function(error){
        console.log("This is the error" + error);
    });

    res.render('login.ejs');
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

    axios.get(sweepAPI + "account/auth/api_key/", config).then(function(response){
        res.render("apis", {
            ActiveAPIs: response.data
        });
        

    }).catch(function(error){
        console.log("This is the error" + error);
    });

    // res.render("apis.ejs");
});

app.get('/directories', function(req,res){

    axios.get(sweepAPI + "directory/home", config).then(function(response){
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
    

    axios.get(sweepAPI +"directory/" + id, config).then(function(response){
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

    axios.get(sweepAPI +"stream/"+id, config)
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

    axios.post(sweepAPI+ "stream", streamData,config)
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

    axios.get(sweepAPI + "account/auth/api_key/" + searchTerm, {
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