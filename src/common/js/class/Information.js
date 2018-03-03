export default class Information {
  constructor (selector, translator) {
    this.element = document.querySelector(selector)
    this.translator = translator
  }

  output (data) {
    const p = document.createElement('p')
    p.innerHTML = typeof data === 'object' ? JSON.stringify(data) : data
    this.element.appendChild(p)
  }
}
