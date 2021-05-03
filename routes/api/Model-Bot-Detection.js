const tf = require('@tensorflow/tfjs'); // Tensorflow.js
const fetch = require('node-fetch');

const MAX_LENGTH = 256;
const wordIndex = 'http://192.168.1.12:8080/model/tensorflow-tokenizer/bot_detection_word_index.json'

module.exports = async function predict(word) {

    // Converts the given word to lowercase to better fit wordIndex
  
        word = word.toLowerCase()
    

    // Fetching the saved word.index object from Tensorflow's tokenizer
    let vocab = await (await fetch(wordIndex)).json()
    let sequence = new Array();
    // console.log('The input word: ' + word)

    // Splitting each word
    const wordArray = word.split(' ');

    // Parse through the given word and inputting into the sequence array
    Array.from(wordArray).forEach(function (word) {
        // Passing the word into the given word into the fetched JSON word index
        const tokenizedInteger = vocab[word]

        // Passing the tokenized integers into the sequence
        sequence.push(tokenizedInteger)
        // console.log('Word is: ' + word + '\nTokenized integer is: ' + tokenizedInteger + '\nThe sequence is currently: ' + sequence)
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
    const modelURL = 'http://192.168.1.12:8080/model/tensorflow-model/bot-detection-model/Relu-Relu-Sigmoid-Model/model.json'
    let model;
    model = await tf.loadLayersModel(modelURL);
    let tensor = tf.tensor([sequence])
    let prediction = await model.predict(tensor);

    // console.log("Prediction is: " + prediction)

    // Similar to predict_classes
    const predictClasses = model.predict(tensor);
    const prediction2 = predictClasses.argMax(-1).dataSync()[0]

    // Classifying not bot (0) and bot (1) text 
    if (prediction2 == 0) {
        return 'Real';
    } else if (prediction2 == 1) {
        return 'Bot';
    } else {
        console.log("Error obtaining Prediction")
    }
}

