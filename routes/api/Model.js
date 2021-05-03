const tf = require('@tensorflow/tfjs'); // Tensorflow.js
const fetch = require('node-fetch');
const { response } = require('express');

const MAX_LENGTH = 256;
const wordIndex = 'http://192.168.1.12:8080/model/tensorflow-tokenizer/gibberish_detection_word_index.json'

module.exports = async function predict(word) {

    // Converts the given word to lowercase to better fit wordIndex
  
        word = word.toLowerCase()
    

    // Fetching the saved word.index object from Tensorflow's tokenizer
    let vocab = await (await fetch(wordIndex)).json()
    let sequence = new Array();
    // console.log('The input word: ' + word)

    // Parse through the given word and inputting into the sequence array
    Array.from(word.slice(0, MAX_LENGTH)).forEach(function (word) {

        // Passing the word into the given word into the fetched JSON word index
        const tokenizedInteger = vocab[word]

        // Passing the tokenized integers into the sequence
        sequence.push(tokenizedInteger)
        //console.log('Letter is: ' + word + '\nTokenized integer is: ' + tokenizedInteger + '\nThe sequence is currently: ' + sequence)
        return sequence;
    });
    //console.log('The sequence before padding: ' + sequence)

    // Padding
    if (sequence.length < MAX_LENGTH) {
        let paddedArray = Array(MAX_LENGTH - sequence.length); // Creats an array with proper size
        paddedArray.fill(0); // Pads an array with appropriate  size with 0s
        sequence = sequence.concat(paddedArray); // Merge the two arrays to the sequence variable
    }
    //console.log('The completed sequence after padding: ' + sequence)
    //console.log('The sequence length: ' + sequence.length)
    // console.log(sequence)

    // Passing the sequence into the model
    const modelURL = 'http://192.168.1.12:8080/model/tensorflow-model/gibberish-detection-model/Relu-Softmax-Model/model.json'
    let model;
    model = await tf.loadLayersModel(modelURL);
    let tensor = tf.tensor([sequence])
    let prediction = await model.predict(tensor);

    // console.log("Prediction is: " + prediction)

    // Similar to predict_classes
    const predictClasses = model.predict(tensor);
    const prediction2 = predictClasses.argMax(-1).dataSync()[0]

    // Classifying real (0) and gibberish (1) text 
    if (prediction2 == 0) {
        // console.log("Prediction: Text is real");
        return 'NotGibberish';
    } else if (prediction2 == 1) {
        // console.log("Prediction: Text is gibberish");
        return 'Gibberish';
    } else {
        console.log("Error obtaining Prediction")
    }

    //Below is trying to just get the prediction to show up on the website, not the console.
    var exports = {}
    exports.exportedPrediction = prediction;
    //console.log("Exporting Prediction: \n" + exports.exportedPrediction)
    //

}
