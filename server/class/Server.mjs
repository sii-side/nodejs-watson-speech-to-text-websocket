import express from 'express'
import http from 'http'
import Connection from './Connection'
import SpeechToText from './SpeechToText'
import Console from './Console'

export default class Server {
  constructor () {
    this.app = express()
    this.server = http.createServer(this.app)
    this.connection = new Connection(this)
    this.recognizer = new SpeechToText(this)
    this.console = new Console()
  }

  init () {
    this.listen(3000)
    this.connection.attach()
  }

  listen (port) {
    this.server.listen(port)
  }

  message (message) {
    if (message.type === 'complete') {
      this.console.log('Upload Completed.')
      this.recognizer.recognize(message.body.uploadDir, message.body.mime)
    }
    if (message.type === 'information') {
      this.console.log(message.body)
      this.connection.info(message.body)
    }
    if (message.type === 'data') {
      this.connection.data(message.body)
    }
  }
}
