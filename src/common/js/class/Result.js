export default class Result {
  constructor (selector, translator) {
    this.element = document.querySelector(selector)
    this.translator = translator
  }

  output (data) {
    this.element.innerHTML += data
  }
}
