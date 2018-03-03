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
    this.stream.on('data', result => {
      this.server.console.log('Result', JSON.stringify(result))
      if (result.results[0].final) {
        this.server.message({
          type: 'data',
          body: new RecognizeResult(result).output()
        })
      }
    })

    this.stream.on('close', result => {
      this.server.console.log('Close', JSON.stringify(result))
      this.server.message({
        type: 'information',
        body: 'Recognization completed.'
      })
      this.stream = null
    })
  }
}
