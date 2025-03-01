const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eahhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("coffeeDB");
    const coffeeCollection = database.collection("coffee");

    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();
      const coffee = await cursor.toArray();
      res.send(coffee);
    });

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const coffee = await coffeeCollection.findOne(query);
      res.send(coffee);
    });
    app.post("/coffee", async(req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.updateOne(query, {$set: updatedCoffee});
      res.send(result);
    });
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
   
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee store server is running.");
});

app.listen(port, (err, res) => {
  if (err) console.error(err);
  console.log(`Server is running on port ${port}`);
});
