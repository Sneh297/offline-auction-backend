const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const License = require('./models/License');

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // your frontend origin
  credentials: true                 // allow cookies to be sent
}));

app.get("/generate-license", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});


app.get("/generate",async (req,res)=>{
    const license = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await License.create({uuid:license})
    res.json({license})
})


app.post("/validate",async (req,res)=>{
    const {license} = req.body;
    try{
        const foundLicense = await License.findOne({uuid:license})
        if(foundLicense){
            res.cookie("license", license, { maxAge: 60*1000});
             res.json({ message: "License valid" });
        }else{
            res.json({valid:false})
        }
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Internal Server Error"})
    }
})




app.get('/keep-alive', async (req, res) => {
    res.json('alive');
});
cron.schedule('*/10 * * * *', async () => {
  try {
    await axios.get(`${process.env.SELF}/keep-alive`);
  } catch (err) {
    console.error('Ping failed:', err.message);
  }
});




mongoose.connect(process.env.MONGO_URI, {
    dbName: 'offline-auction',
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000');
});