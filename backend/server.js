const express = require('express');
const bodyParser = require('body-parser')
// const MongoClient = require('mongodb').MongoClient
const { MongoClient } = require('mongodb');
const app = express();

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ##################### DB CONNECT #############################
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


// ##################### ALL YOUR HANDLERS HERE #############################
// INSERT QUOTES API 
app.post('/insertQuotes', (req, res, next) => {
  const dbConnect = db;
  const matchDocument = {
    quotesText: req.body.quotesText
  };

  dbConnect
    .collection("quotesList")
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting matches!");
        
      } else {
        let body = {
          message: `quotes inserted! ${result.insertedId}`, type: "success"
        }

        res.json(body);
        res.end();
        
        next();
        
      }
    });
  // res.end()
})

// INSERT QUOTES API 
app.get('/quotes', async (req, res, next) => {
  const dbConnect = db;

  dbConnect
    .collection("quotesList")
    .find().toArray()
    .then((quotes) => {
      res.json(quotes);
      res.end()
      next()
    })
    .catch((err) => {
      console.log(err);
      //  res.send(err)
    })

})

// DELETE QUOTES API 
app.delete('/quotes', async (req, res, next) => {
  const dbConnect = db;
  console.log(req)
  dbConnect
    .collection("quotesList")
    .deleteOne({
      quotesText:req.body.quotesText
    })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.json('No quote to delete')
      }
      res.json('Deleted Darth Vadar\'s quote')
      // res.json({message:'deleted!', type:'Success'});
      // res.end()
      // next()
    })
    .catch((err) => {
      console.log(err);
      //  res.send(err)
    })

})

// UPDATE
app.put('/quotes', (req, res, next) => {
  const dbConnect = db;
  console.log(req.query.quotesText)
  dbConnect.collection("quotesList")
  .findOneAndUpdate(
    { quotesText: req.query.quotesText},
    {
      $set: {
        quotesText: req.body.quotesText
      }
    },
    {
      upsert: true
    }
  )
    .then(result => res.json('Success'))
    .catch(error => console.error(error))
})

// ##################### APP LISTEN PORT #############################
app.listen(3000, function () {
  console.log('listening on 3000')
})
