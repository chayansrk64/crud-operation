const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hkduy2w.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
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
    await client.connect();
    // create a collection to the Database (step-1)
    const chocolateCollection = client.db("chocolateDB").collection("chocolate")
    
    // get data from the database (step-3) (read = get method)
    app.get('/chocolate', async(req, res)=> {
        const cursor = chocolateCollection.find()
        const result = await cursor.toArray();
        res.send(result);
    })

    // update data from the database (update)
    app.get('/chocolate/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await chocolateCollection.findOne(query);
        res.send(result);
    })

    // send data to server (step-2) (create = post method)
    app.post('/chocolate', async(req, res)=> {
        const newChocolate = req.body;
        console.log(newChocolate);
        const result = await chocolateCollection.insertOne(newChocolate)
        res.send(result);
    })

    // update a data (put method)
    app.put('/chocolate/:id', async(req, res)=> {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true };
        const updateChocolate = req.body;
        const chocolate = {
           $set: {
              name: updateChocolate.name,
              country: updateChocolate.country,
              category: updateChocolate.category
           }
        }

        const result = await chocolateCollection.updateOne(filter, chocolate, options)
        res.send(result);
    })

    // delete a data (delete method) 
    app.delete('/chocolate/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await chocolateCollection.deleteOne(query)
        res.send(result);
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




app.get('/', (req, res)=> {
    res.send("SERVER IS RUNNING ON...")
})

app.listen(port, ()=> {
    console.log(`Server running on port: ${port}`);
})