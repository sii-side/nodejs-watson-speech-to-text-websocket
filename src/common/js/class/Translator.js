import Input from './Input'
import Information from './Information'
import Result from './Result'
import Connection from './Connection'

export default class Translator {
  constructor () {
    this.input = new Input('#sound', this)
    this.information = new Information('#info', this)
    this.result = new Result('#result', this)
    this.connection = new Connection(this)
  }

  init () {
    this.input.init()
    this.connection.init()
  }

  upload (fileElement) {
    this.connection.upload(fileElement)
  }

  message (message) {
    if (message.type === 'information') {
      return this.information.output(message.output())
    }
    if (message.type === 'result') {
      return this.result.output(message.output(false))
    }
    if (message.type === 'error') {
      throw new Error(message.output())
    }
  }
}
