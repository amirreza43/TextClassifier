const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Data = require('../../models/Data');
const gibPredict = require('./Model');
const botPredict = require('./Model-Bot-Detection');
const axios = require('axios');
const csv = require('csvtojson');
const request = require('request');
const {parse} = require('json2csv');
const fs = require('fs')
const uuid = require('uuid').v4;
const path = require('path');
const UniversalData = require('../../models/UniversalData');


router.post('/model', async (req,res)=>{
    var result =await gibPredict(`${req.body.text}`);
    if(result == 'NotGibberish'){

        result = await botPredict(`${req.body.text}`);

    }
    res.json(result) 
});


//  @route  GET api/post/allData
//  @desc   GET all the saved data
//  @access private.
router.get('/allData', auth, async (req,res)=>{

    try {
        const user = await User.findById(req.user.id).select('-password');
        const alldata = await UniversalData.find()
        .populate('gibberish[text]', 'real', 'bot');   
        const length = Object.keys(alldata).length
        var ll = null;

        var allgib = [];
        var allreal = [];
        var allbot = [];
        var alldat = [];

        for(i=0; i < length; i++){
            ll = Object.keys(alldata[i].gibberish).length;
            for(j=0; j < ll; j++){
                
                alldat.push({
                    text: alldata[i].gibberish[j].text,
                    prediction: alldata[i].gibberish[j].prediction,
                })

            }
            ll = Object.keys(alldata[i].real).length;
            for(j=0; j < ll; j++){
                
                alldat.push({
                    text: alldata[i].real[j].text,
                    prediction: alldata[i].real[j].prediction,
                })

            }
            ll = Object.keys(alldata[i].bot).length;
            for(j=0; j < ll; j++){
                
                alldat.push({
                    text: alldata[i].bot[j].text,
                    prediction: alldata[i].bot[j].prediction,
                })

            }

        }
        console.log(alldat);

        const csv1 = parse(alldat);
        console.log(csv1);
        fs.writeFileSync(path.join(__dirname, '..', '..', 'client', 'public', 'files', 'alldata', 'alldata.csv'), csv1, 'utf8', 'w',async function (err) {
            if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
            } else{
            console.log('It\'s saved!');

            }
        });

        res.send('file saved')



        // if(user.email === 'aa@aa.com'){
        //     // res.json()
        //     // console.log(alldata);
        // }
        // res.send('whatupppp')
    } catch (error) {
        res.send(error)

    }

})


//  @route  POST api/post
//  @access private
router.post('/', auth, async (req,res)=>{

    try {   
        const user = await User.findById(req.user.id).select('-password');
        console.log(Object.keys(req.body.gibberish).length);
        const noOfArrGib = Object.keys(req.body.gibberish).length
        const noOfArrNGib = Object.keys(req.body.notGibberish).length
        const newData = new Data({
            user: req.user.id,
        });
        for(i = 0; i < noOfArrGib; i++ ){
        const newGibberish = {
            text: req.body.gibberish[i]
        };

        newData.gibberish.unshift(newGibberish);
        }
        for(i = 0; i < noOfArrNGib; i++ ){
        const newNotGibberish = {
            text: req.body.notGibberish[i]
        };

        newData.notGibberish.unshift(newNotGibberish);
    }

        const data = await newData.save();
        res.json({data});

    } catch (err) {
        console.error(err);
        
        res.status(500).send('Server error');
    }


});

//  @route  Get api/post
//  @access private
router.get('/', auth, async (req,res)=>{

    try {
        
        const user = await User.findById(req.user.id).select('-password');
        res.json(user.link);

    } catch (err) {
        console.error(err);
        
        res.status(500).send('Server error');
    }

});

//  @route  Get api/post/:id
//  @access private
router.get('/:id', auth, async (req,res)=>{

    try {
        
        const user = await User.findById(req.user.id).select('-password');
        const noLinks = Object.keys(user.link).length;
        var chase = null
        
        for(i = 0; i < noLinks; i++ ){
            if(user.link[i]._id == req.params.id){
               chase = user.link[i];
            }
        }
        if(chase){
            res.json(chase)
        } else {
            return res.status(404).json({ msg: 'File not found.'})
        }
    } catch (err) {
        console.error(err);
        if(err.kind == 'ObjectId'){
            return res.status(404).json({ msg: 'Post not found.'})
        }
        res.status(500).send('Server error');
    }

});


router.post('/gibModel', async (req,res)=>{
    const result =await predict(`${req.body.text}`);
    console.log(result);
});

router.post('/botModel', async (req,res)=>{
    const result =await botPredict(`${req.body.text}`);
    console.log(result);
});

//  @route  POST api/post/mlModel
//  @desc   convert the .csv and categorize the text
//  @access private
router.post('/mlModel',auth , async (req,res)=>{
    var predictArrayGib = [];
    var predictArrayReal = [];
    var predictArrayBot = [];
    var predictionLabel = null;
    var csvArr = []
    let dataa = await Data.findOne({link: req.body.link});
    // console.log(dataa);
    if(dataa){
    
        return res.json(dataa);

    }
    console.log(req.body.link);
    const label = req.body.label;
    // console.log(label);
    const jsonArray=await csv({noheader:true}).fromStream(request.get(req.body.link));
    console.log(jsonArray);
    // console.log(jsonArray[0]['responses']);

    // const result =await gibPredict(`${req.body.text}`);
    // console.log(result);

    const noObjects = Object.keys(jsonArray).length
    for(var i = 0; i < noObjects; i++){
    const results = await gibPredict(jsonArray[i][`field1`]);
    console.log(jsonArray[i][`field1`]);
    console.log(results);    
    const text = jsonArray[i][`field1`];
    if(text === undefined){
        res.status(500).json('server error');    
        return;
        console.log('the result', text);   
    }


    if(results == 'Gibberish'){
        predictionLabel = "Gibberish"
        predictArrayGib.push({
            text: text,
            prediction: predictionLabel,
        });
        
      } else {
        predictionLabel = "Not Gibberish";
        const results1 = await botPredict(jsonArray[i][`field1`]);
        if(results1 == 'Real'){
            predictionLabel = "Real";
            predictArrayReal.push({
                text: text,
                prediction: predictionLabel,
            });
            
        } else {
            predictionLabel = "Bot";
            predictArrayBot.push({
                text: text,
                prediction: predictionLabel,
            });
            
        }
        
      }
    }
    const user = await User.findById(req.user.id).select('-password');
    const newData = new Data({
        user: req.user.id,
        link: req.body.link,
    });
    const newUniversalData = new UniversalData()
    const noOfArrGib = Object.keys(predictArrayGib).length
    const noOfArrReal = Object.keys(predictArrayReal).length 
    const noOfArrBot = Object.keys(predictArrayBot).length 

    for(i = 0; i < noOfArrGib; i++ ){
        const newGibberish = {
            text: predictArrayGib[i]['text'],
            prediction: predictArrayGib[i]['prediction'],
        };
        csvArr.push({
            text: predictArrayGib[i]['text'],
            prediction: predictArrayGib[i]['prediction'],
        })

        newData.gibberish.unshift(newGibberish);
        newUniversalData.gibberish.unshift(newGibberish);
        }
    for(i = 0; i < noOfArrReal; i++ ){
        const newReal = {
            text: predictArrayReal[i]['text'],
            prediction: predictArrayReal[i]['prediction'],
        };
        csvArr.push({
            text: predictArrayReal[i]['text'],
            prediction: predictArrayReal[i]['prediction'],
        })
        newData.real.unshift(newReal);
        newUniversalData.real.unshift(newReal);
    }
    for(i = 0; i < noOfArrBot; i++ ){
        const newBot = {
            text: predictArrayBot[i]['text'],
            prediction: predictArrayBot[i]['prediction'],
        };
        csvArr.push({
            text: predictArrayBot[i]['text'],
            prediction: predictArrayBot[i]['prediction'],
        })
        newData.bot.unshift(newBot);
        newUniversalData.bot.unshift(newBot);
    }
    const csv1 = parse(csvArr);
    const uNumber = uuid();
    newData.labelData = `${uNumber}.csv`
    fs.writeFile(path.join(__dirname, '..', '..', 'client', 'public', 'files', `${uNumber}.csv`), csv1, 'utf8', async function (err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
          console.log('It\'s saved!');

        }
      });
    const data = await newData.save();
    const universalData = await newUniversalData.save()
    

    res.json(data);


});



//  @route  DELETE api/post/:id
//  @desc   delete a post
//  @access private
router.delete('/:id/:link_id', auth, async (req,res)=>{

    try {
        var data = null
        if(req.params.id != '1kst'){
            data = await Data.findById(req.params.id);
        }
        
        const user = await User.findById(req.user.id).select('-password');
        const noLinks = Object.keys(user.link).length
        console.log(noLinks);
        console.log(req.params.link_id);
        await User.updateOne( 
            { _id: req.user.id },
            {
                $pull: {
                    link: { _id : req.params.link_id }
                }
            });
        if(data){
        await data.remove()
        }

        res.json({ msg: 'Post removed'});

        

    } catch (err) {
        console.error(err);
        
    }

});



module.exports = router;