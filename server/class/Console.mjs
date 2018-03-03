export default class Console {
  log (...message) {
    console.log(this.time(), message.join('\u0020'))
  }

  time () {
    return `[${new Date().toLocaleString()}]`
  }
}
