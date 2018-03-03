export default class Message {
  constructor (type, body) {
    this.type = type
    this.body = body
  }

  output (withDate = true) {
    if (withDate) {
      return `[${new Date().toLocaleString()}] ${this.body}`
    } else {
      return this.body
    }
  }
}
