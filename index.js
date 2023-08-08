const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { ObjectId } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER}:${process.env.USER_PASS}@cluster0.wbjfc7m.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Async function to set up and run the server
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();

    const ovigoTravellingCollection = client.db("ovigo-travelling").collection("data");
    const UserOvigoTravellingCollection = client.db("ovigo-travelling").collection("user");

    // Data Collections

    // Get all data
    app.get("/data", async (req, res) => {
      const result = await ovigoTravellingCollection.find().toArray();
      res.send(result);
    });

    // Add new data
    app.post('/data', async (req, res) => {
        const newItem = req.body;
        const result = await ovigoTravellingCollection.insertOne(newItem);
        res.send(result);
    });

    // Get data by ID
    app.get('/data/:id', async (req, res) => {
        const id = req.params.id;
        const query = {
            _id: new ObjectId(id)
        };
        const user = await ovigoTravellingCollection.findOne(query);
        res.send(user);
    });

    // Update data by ID
    app.put('/data/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            };
            const updateMix = {
                $set: {
                    // Update fields here
                }
            };

            const result = await ovigoTravellingCollection.updateOne(filter, updateMix);
            res.json({
                success: true,
                message: "Mix item updated successfully"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Failed to update mix item"
            });
        }
    });

    // User Collections

    // Add new user
    app.post("/user", async (req, res) => {
        const newItem = req.body;
        const result = await UserOvigoTravellingCollection.insertOne(newItem);
        res.send(result);
      });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

// Run the server
run().catch(console.dir);

// Default route
app.get("/", (req, res) => {
  res.send("Server running");
});

// Start the server
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
