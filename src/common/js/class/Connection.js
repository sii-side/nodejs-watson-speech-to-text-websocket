import io from 'socket.io-client'
import SocketIOFileClient from 'socket.io-file-client'
import Message from './Message'

export default class Connection {
  constructor (translator) {
    this.translator = translator
    this.io = null
    this.uploader = null
  }

  init () {
    this.io = io('http://localhost:3000/')
    this.uploader = new SocketIOFileClient(this.io)
    this.attach()
  }

  attach () {
    this.io.on('information', this.onInformation.bind(this))
    this.io.on('data', this.onResult.bind(this))
  }

  upload (fileElement) {
    this.uploader.upload(fileElement)
  }

  onInformation (data) {
    this.translator.message(new Message('information', data.message))
  }

  onResult (result) {
    this.translator.message(new Message('result', result.message))
  }
}
