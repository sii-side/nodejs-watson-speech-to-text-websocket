export default class Result {
  constructor (selector, translator) {
    this.element = document.querySelector(selector)
    this.translator = translator
  }

  view (data) {
    this.element.innerHTML = JSON.stringify(data)
  }
}
