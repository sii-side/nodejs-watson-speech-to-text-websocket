import Input from './Input'
import Result from './Result'

export default class Translator {
  constructor () {
    this.input = new Input('#sound', this)
    this.result = new Result('#result', this)
  }

  init () {
    this.input.init()
  }

  message (data) {
    if (data.type === 'result') {
      this.result.view(data.body)
    }

    if (data.type === 'error') {
      throw new Error(data.body)
    }
  }
}
