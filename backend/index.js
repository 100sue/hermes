const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require ('dotenv').config();
const fs = require('fs');


// Configuration de l'openai (voir https://beta.openai.com/docs/api-reference/making-requests)

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({ apikey: process.env.OPENAI_API_KEY })
const openai = new OpenAIApi(configuration);

const AWS = require('aws-sdk');
AWS.config.loadFromPath("awsCreds.json");



app.use(bodyParser.json());
app.use(cors());


// Configuration de la réponse de l'IA :
// Temperature est le degré de créativité de la réponse (echelle de 0 à 0.9).

app.post('/api/text-to-audio-file', async (req, res) => {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.body.text,
        max_tokens: 100,
        temperature: 0.5
    })

    let num = (Math.random() * 100000000).toFixed(0);

    const polly = new AWS.Polly({ region: "us-east-1" });
    const params = {
        OutputFormat: "mp3",
        Text: completion.data.choices[0].text,
        VoiceId: "Léa"
    }

    polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let filePath = "../public/voice/";
        let fileName = num + ".mp3"

        if (num) fs.writeFileSync(filePath + fileName, data.AudioStream)
    })

// SetTimeout pour forcer le delai a s'executer:

    setTimeout(() => { res.status(200).json(num) }, 4500)

})

app.listen(4001, () => {
    console.log(`Server started at http://localhost:4001`);
})
