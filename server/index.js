require('dotenv').config()

const fs = require('fs')

const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1')
const speechToText = new SpeechToTextV1({
  username: process.env.SPEECH_TO_TEXT_USERNAME,
  password: process.env.SPEECH_TO_TEXT_PASSWORD,
  url: process.env.SPEECH_TO_TEXT_URL
})

const express = require('express')
const app = express()

const multer = require('multer')
const upload = multer({
  dest: './upload'
})

app.use(upload.single('sound'))

app.get('/send', (req, res) => {
  res.send('Sender is currently running. Use with POST method!')
})

app.post('/send', (req, appRes) => {
  const params = {
    model: 'ja-JP_BroadbandModel',
    audio: fs.createReadStream(req.file.path),
    content_type: req.file.mimetype
  }

  speechToText.recognize(params, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      appRes.setHeader('Access-Control-Allow-Origin', '*')
      appRes.setHeader('Content-Type', 'application/json')
      appRes.send(JSON.stringify(res, null, 2))
    }
  })
})

app.listen(3000)
