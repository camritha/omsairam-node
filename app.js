//create variable for everything
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//setting default engine to ejs(embedded java script)
app.set('view engine', 'ejs');
//initially when server is called send the addcar.html file
app.get('/', function (req, res) {
  res.sendfile('addcar.html');
});
//if deletecar is called using get method then send the deletecar.html file
app.get('/deletecar', function (req, res) {
  res.sendfile('deletecar.html');
});
//if viewcar is called using get method then send the viewcar.html file
app.get('/viewcar', function (req, res) {
  res.sendfile('viewcar.html');
});

//post method save is used to add car details to mongodb 

app.post('/save', function (req, res) {
  console.log("Inside Save" + req.body.id);
//establish a mongoclient connection
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("omsai");
    var myobj = { carid: req.body.id, vehicle_no: req.body.vn , model: req.body.name , seating: req.body.seat, rpd: req.body.rpd };
    dbo.collection("cars").insertOne(myobj, function(err, res) {
      if (err) throw err;
	  //add the document to collection
      console.log("1 document inserted");
      db.close();
    });
  });
  
  res.sendfile('addcar.html');
});
//delete is used to delete car if booking is not present
app.post('/delete', function (req, res) {
  console.log("Inside delete" + req.body.id);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("omsai");
    dbo.collection("booking").findOne({carid: req.body.id}, function(err, result) {
      if (err) throw err;
      console.log(result);
      if(result==null)
      {
        var myquery = { carid:  req.body.id};
  dbo.collection("cars").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    db.close();
  });
        res.sendfile('deletecar2.html');
      }
      else
      {
        res.sendfile('deletecar1.html');
      }
      db.close();
    });
  });
});

//view car is used to view car details based on model entered
app.post('/viewcar', function (req, res) {
  console.log("Inside viewcar" + req.body.model);

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("omsai");
    dbo.collection("cars").find({model: req.body.model}, function(err, result) {
      if (err) throw err;
      console.log(result);
      res.render('viewcar1', { Model : req.body.model, data: result});
      db.close();
    });
  });
  
});

app.listen(3000);