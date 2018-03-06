export default class Message {
  constructor (type, body) {
    this.type = type
    this.body = body
  }

  output (withTime = true) {
    return withTime ? `[${new Date().toLocaleString()}] ${this.body}` : this.body
  }
}
