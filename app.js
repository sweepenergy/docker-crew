require('dotenv').config()
const express = require("express");
const app = express();
const axios = require('axios')
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const Directory = require('./models/directory.js');
const Stream = require('./models/stream.js');
const { render } = require('ejs');


const obj = require('./Streams.json');
const fs = require('fs');

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

const config = {
    headers: {
        'Content-Type': 'application/json',
        'data-raw': ''
    },
                
    auth:{
        username: process.env.AUTH_KEY,
        password: process.env.AUTH_TOKEN
    }
}


var baseURL = "https://api.sweepapi.com/";


//looking for static files inside public
app.use(express.static(__dirname + "/public"));

//middle ware 
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


app.get("/", function(req,res){

    axios.get(baseURL + "directory/home", config).then(function(response){
        res.render("homepage", {
            homeDirectory : response.data
        });


    }).catch(function(error){
        console.log("This is the error" + error);
    });
    // res.render("homepage.ejs");
})

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

app.get('/dbStream', function(req,res){
    res.render ('dbStream.ejs');
    })

app.post('/dbStream', function(req,res){

    const stream = new Stream(req.body);
    console.log(stream);
    
    stream.save()
        .then((result) => {
            res.redirect('/dbHome');
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get('/add-Streams', function(req,res){
    res.render ('add-Streams.ejs');
    })

app.post('/add-Streams', function(req,res){
    
    const stream = new Stream(req.body);
    console.log(stream);
    
    stream.save()
        .then((result) => {
            res.redirect('/dbHome');
        })
        .catch((err) => {
            console.log(err);
        })
})



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

app.get('/newAccount', function(req, res, next) { 


    axios.get(baseURL + "account/verify_auth", config).then(function(response){
        res.render("directories", {
            homeDirectory: response.data
        });


    }).catch(function(error){
        console.log("This is the error" + error);
    });

    res.render('newAccount.ejs');
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


    // res.render('list.ejs',{
    //     currentList : list
    // });

});

app.get("/search", function(req,res){
    res.render("search.ejs");
});

app.get("/deleteParameter", function(req,res){
    res.render("deleteParameter.ejs");
});

app.get("/deleteParameter/:id", async function(req,res){
    const TempId = req.params.id;
    console.log(TempId);

    // username: process.env.AUTH_KEY,
    // password: process.env.AUTH_TOKEN
    var username1 = process.env.AUTH_KEY
    var password1 = process.env.AUTH_TOKEN
    


    const token = Buffer.from(`${username1}:${password1}`, 'utf8').toString('base64')
    
    try{
        const resp = await axios.delete(baseURL + "directory/" + TempId,{
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Basic ${token}`
            }
        })
        
        console.log(resp.data)
        res.redirect("/");
        

    }catch(e){
        console.log(e);
    }
        


});



app.get('/apis', function(req,res){

    axios.get(baseURL + "account/auth/api_key/", config).then(function(response){
        res.render("apis", {
            ActiveAPIs: response.data
        });
        

    }).catch(function(error){
        console.log("This is the error" + error);
    });

    // res.render("apis.ejs");
});



app.get('/directories', function(req,res){

    axios.get(baseURL + "directory/home", config).then(function(response){
        console.log(response.data);
        res.render("directories", {
            homeDirectory: response.data
        });


    }).catch(function(error){
        console.log("This is the error" + error);
    });


});

// const currentStreamID = "015e4205-1977-417c-9dc3-b3425feebea6";

// app.get('/streams', function(req,res){

//     axios.get(baseURL+"stream/"+currentStreamID, config).then(function(response){
//         console.log(response.data);
//         // res.render("streams",{
//         //     streamIDs: response.data
//         // });
//     }).catch(function(error){
//         console.log("This is the error" + error);
//     });
    
//     res.render("streams.ejs");
// });



app.get('/directoryData/:id', function(req,res){
    const id = req.params.id;
    console.log(id);
    

    axios.get(baseURL+"directory/" + id, config).then(function(response){
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

    axios.get(baseURL+"stream/"+id, config)
            .then(function(response){
                console.log(response.data);
                res.render("streamData",{
                    streamData:response.data
                })
            })
            .catch( function(error){
                console.log(error);
            })
})


app.get("/addDirectory", function(req,res){
    res.render("addDirectory.ejs");
})

app.post("/addDirectory", async function(req,res){
    var dirData = req.body;
    console.log(dirData);


    axios.post("https://api.sweepapi.com/directory",dirData, config)
        .then(function(response){
            console.log(response);
            

        }).catch(function(error){
            console.log(error);
        })

res.redirect("/addDirectory");

});


app.get('/', (req,res) =>{
    
})

// for sending JSON (use sendFile so we can make updates to JSON)
app.get('/streamSearch', (req, res) => {
    res.header("Content-Type",'application/json');
    res.sendFile(path.join(__dirname, 'Streams.json'));
})

//for looking up certain devices
app.post('/', function (req, res) {
    var obj;
    fs.readFile('./object.json', 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        console.log(obj["placeholder"]);
        console.log(obj["placeholder"]);
        console.log(obj["placeholder"]);
        console.log(obj["placeholder"]);
        console.log(obj["placeholder"]);
    });
    res.render(
        'disp.ejs',
        { 
            var_name: obj["placeholder"],
            display_name: obj["placeholder"],
            description: obj["placeholder"],
            units: obj["placeholder"],
            type: obj["placeholder"]

        });
});

app.get("/addStream", function(req,res){

    axios.get(baseURL + "directory/home", config).then(function(response){
        res.render("addStream", {
            homeDirectory : response.data
        });


    }).catch(function(error){
        console.log("This is the error" + error);
    });


    // res.render("addStream.ejs");
})

app.post("/addStream", function(req,res){

    var streamData = req.body;
    console.log(streamData);

    axios.post(baseURL+ "stream", streamData,config)
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


// app.post("/addDevice", function(req,res){
//     var data = req.body;
//     console.log(data);

//     //gets added to MongoDB
//     Stream.create({
//         var_name: data.var_name,
//         display_name: data.display_name,
//         description: data.description,
//         units: data.units,
//         type: data.type
//     }, function(error,data){
//         if(error){
//             console.log("There was a problem adding this device data");
//         }else{
//             console.log("added successfully");
//             console.log(data);
//         }
//     })
//     res.redirect("/list");
// });



app.get('/test', function(req,res){

    var searchTerm = req.query.searchterm;
    // var searchTerm = "ad9fe988-484d-43b4-83ce-4c7a8b10b6e8";
    console.log(searchTerm);

    axios.get(baseURL + "account/auth/api_key/" + searchTerm, {
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
        console.log("This is the error" + error);
    });

});


app.get("*", function(req,res){
    res.send("Error! route does not exist!");
})


app.listen(3000, function(req,res){
    console.log("Online!");
});