const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require('path');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
const tf = require('@tensorflow/tfjs');
const mlmodel = require('./tf/model.json');
const User = require('./models/User');
const Data = require('./models/Data');
const auth = require('./middleware/auth');
const csv = require('csvtojson');
const axios = require('axios');
const FormData = require('form-data');
const request = require('request');


require('dotenv').config();

//conncet database 
connectDB();

//init middleware
app.use(express.json({extended: false}));
app.use(express.static(path.resolve('./public')));


//Upload Functions
const s3 = new aws.S3({ apiVersion: '2006-03-01',accessKeyId: process.env.ACCKEY,
secretAccessKey: process.env.SECRETKEY, });
// Needs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'myawsbuck123',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
        }
    })
});

//Upload API
app.post('/upload', [auth ,upload.array('avatar')], async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if(req.body.name){
        const newLink = {
            text: req.files[0].location,
            name: req.body.name
        }
        user.link.unshift(newLink);
    } else {
        const newLink = {
            text: req.files[0].location,
        }
        user.link.unshift(newLink);
    }
    
    await user.save();
    return res.json({ status: 'OK', uploaded: req.files.length, Loc: req.files[0].location });
});

//define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/post', require('./routes/api/post'));
const {PredictionServiceClient} = require('@google-cloud/automl').v1;
const client = new PredictionServiceClient();

app.use(express.static('public'))

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
});

