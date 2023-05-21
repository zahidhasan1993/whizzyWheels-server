const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;




//middleware
app.use(cors());
app.use(express.json());

//mongoDb connections


const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.d09ztu7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const database = client.db("whizzywheels");
    const toyCollections = database.collection('all-toys');

    //server db routes
    // get db
    app.get('/alltoys',async (req,res) => {
      
      const cursor = toyCollections.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    //sort db
    app.get('/sort',async (req,res) => {
      
      const cursor = toyCollections.find();
      const result = await cursor.sort({price : 1}).toArray();
      res.send(result)
    })
    //get by id
    app.get('/alltoys/:id', async (req,res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await toyCollections.findOne(query);

      res.send(result)
    })
    //insert to db
    app.post('/addtoy', async (req,res) => {
        const newToy = req.body;
        const result = await toyCollections.insertOne(newToy);
        res.send(result)
        // console.log(newToy);
    })
    //update db
    app.patch('/updatetoy/:id', async (req,res) => {
      const id = req.params.id;
      const toy = req.body
      const filter = { _id : new ObjectId(id)};
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          price : toy.price,
          available_quantity : toy.available_quantity,
          details : toy.details

        }
      }
      const result = await toyCollections.updateOne(filter,updateDoc,options);

      res.send(result)
    })
    //delete document
    app.delete('/delete/:id', async (req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await toyCollections.deleteOne(query);

      res.send(result)
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




//server routes connection

app.get('/', (req,res) => {
    res.send('Welcome to WhizzyWheels Server')
})


app.listen(port, () => {
    console.log('app running on port',port);
})
