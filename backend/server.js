const express = require('express');
const bodyParser= require('body-parser')
// const MongoClient = require('mongodb').MongoClient
const { MongoClient } = require('mongodb');
const app = express();

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoClient.connect('mongodb-connection-string', (err, client) => {
//   // ... do something here
// })


// db connect
let db;
const uri = "mongodb+srv://crude-app:prashen123$@cluster0.njy2u.mongodb.net/crude-app-db?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  db = client.db("crude-app-db");
  console.log(1, err);
  // console.log(db)
  // perform actions on the collection object
  // client.close();
});


// All your handlers here...
app.post('/insertQuotes', (req, res) => {
  // console.log(req.body);
  const dbConnect = db;
  const matchDocument = {
    quotesText: req.body.quotesText
  };

  dbConnect
    .collection("quotesList")
    .insertOne(matchDocument, function (err, result) {
      console.log('quotes err', err);
      if (err) {
        res.status(400).send("Error inserting matches!");
      } else {
        // console.log(`Added a new match with id ${result.insertedId}`);
        res.status(200).send();
      }
    });
  res.end()
})

// create server on 3000 port
app.listen(3000, function(){
  console.log('listening on 3000')
})
