const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors())









const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9qpxu0o.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();




        const database = client.db("BrainboxKiddo");
        const toys = database.collection("catToys");
        const toys2 = database.collection("toys2");




        // app.get('/toys/:category', async (req, res) => {




        //     const result = await toys2.find({ category: req.params.category }).toArray();
        //     res.send(result);
        // })

        app.get('/toysbycategory', async (req, res) => {

            const result = await toys.find().toArray();

            res.send(result);





        })



        const allToys = database.collection('AllToys');



        app.post('/allToys', async (req, res) => {



            const body = req.body;

            const query = {


                name: body.name,
                photo: body.photo,
                Sellername: body.Sellername,
                selleremail: body.selleremail,
                price: body.price,
                rating: body.rating,
                quantity: body.quantity,
                description: body.description,
                selectedSubCategory: body.selectedSubCategory,


            }

            const result = await allToys.insertOne(query)

            res.send(result)



        })

        app.get('/allToys', async (req, res) => {



            const result = await allToys.find().limit(20).toArray()

            res.send(result)
        })


        app.get('/allToys/:email', async (req, res) => {


            const email = req.params.email

            const result = await allToys.find({

                selleremail: email,


            }).toArray();

            res.send(result)
        })

        app.get ('/lowest/:email', async (req, res) => { 


            
            const email = req.params.email

            const result = await allToys.find(
                
               
                
                
                {

                selleremail: email,
                


            },

            {
                sort: { price: 1 },

            }
            
            
            
            ).toArray();
           

            res.send(result)





      

        })


        app.get ('/highest/:email', async (req, res) => { 


            
            const email = req.params.email

            const result = await allToys.find(
                
               
                
                
                {

                selleremail: email,
                


            },

            {
                sort: { price: -1 },

            }
            
            
            
            ).toArray();

          
            res.send(result)





      

        })

        

        app.get('/search/:name', async (req, res) => {

            const name = req.params.name
            const result = await allToys.find({

                $or: [
                    { name: { $regex: name, $options: "i" } },
                ]
            }).toArray();

            res.send(result)



        })


        app.get('/getone/:id', async (req, res) => {


            const id = req.params.id;

            const query = {

                _id: new ObjectId(id)
            }

            const result = await allToys.findOne(query)

            res.send(result)



        })

        app.patch ('/getone/:id', async (req, res) => {


            const id = req.params.id

            const body = req.body

            const filter = { _id : new ObjectId (id)}

            const options = { upsert: true };

            const updateDoc = {

                $set : {


                    price: body.price,
                                    quantity: body.quantity,
                                    description: body.description,
                }



            }


            const result = await allToys.updateOne (filter, updateDoc, options)
            res.send (result)
        })

        app.get('/toys/:category', async (req, res) => {




            const result = await allToys.find({ selectedSubCategory: req.params.category }).toArray();
            res.send(result);
        })

        app.delete ('/deleteToy/:id', async (req, res) => {



            const id = req.params.id;
            const query =  { _id : new ObjectId (id) };


            const result = await allToys.deleteOne(query)

            res.send (result);
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



app.get('/', (req, res) => {


    res.send("Toys is here!");
})

app.listen(port, (req, res) => {

    console.log("listening on port " + port);
})