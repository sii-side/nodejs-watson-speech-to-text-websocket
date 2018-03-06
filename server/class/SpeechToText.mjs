import SpeechToTextV1 from 'watson-developer-cloud/speech-to-text/v1'
import RecognizeResult from './RecognizeResult'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

export default class SpeechToText {
  constructor (server) {
    this.server = server
    this.instance = new SpeechToTextV1({
      username: process.env.SPEECH_TO_TEXT_USERNAME,
      password: process.env.SPEECH_TO_TEXT_PASSWORD
    })
    this.stream = null
  }

  recognize (path, contentType) {
    this.stream = this.instance.createRecognizeStream({
      model: 'ja-JP_BroadbandModel',
      'content-type': contentType,
      interim_results: true,
      objectMode: true,
      smart_formatting: true
    })
    this.attach()
    fs.createReadStream(path).pipe(this.stream)
  }

  attach () {
    this.stream.on('data', this.onData.bind(this))
    this.stream.on('close', this.onClose.bind(this))
  }

  onData (result) {
    const recognizeResult = new RecognizeResult(result)
    if (recognizeResult.final()) {
      this.server.message({
        type: 'data',
        body: recognizeResult.output()
      })
      this.server.message({
        type: 'information',
        body: `Data received: index->${recognizeResult.index()} confidence->${recognizeResult.confidence()}`
      })
    }
  }

  onClose (result) {
    this.server.console.log('Close', JSON.stringify(result))
    this.server.message({
      type: 'information',
      body: 'Recognization completed.'
    })
    this.stream = null
  }
}
