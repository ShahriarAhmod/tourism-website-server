const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ln4ff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tour');
        const serviceCollection = database.collection('services');
        const bookingCollection = database.collection('booking');


        // add destination

        app.post("/addDestination", async (req, res) => {
            const result = await serviceCollection.insertOne(req.body);
            res.send(result);
        });


        // get all service
        app.get("/services", async (req, res) => {
            const result = await serviceCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });


        // confirm order
        app.post("/confirmOrder", async (req, res) => {
            const result = await bookingCollection.insertOne(req.body);
            res.send(result);
        });

        // my confirmOrder

        app.get("/myBookings/:email", async (req, res) => {
            const result = await bookingCollection
                .find({ email: req.params.email })
                .toArray();
            res.send(result);
        });

        /// delete order

        app.delete("/deleteBookings/:id", async (req, res) => {
            const result = await bookingCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });



        // all orders
        app.get("/allOrders", async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);
        });

        // update statuses

        app.put("/updateStatus/:id", (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body.status;
            const filter = { _id: ObjectId(id) };
            console.log(updatedStatus);
            bookingCollection
                .updateOne(filter, {
                    $set: { status: updatedStatus },
                })
                .then((result) => {
                    res.send(result);
                });
        });


}
    finally {
    // await client.close();
}
}

run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('running my one');
});

app.listen(port, () => {
    console.log('runnning server on port', port);
});