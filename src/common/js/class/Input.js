import Message from './Message'

export default class Input {
  constructor (selector, translator) {
    this.element = document.querySelector(selector)
    this.translator = translator
  }

  init () {
    this.attach()
  }

  attach () {
    this.element.addEventListener('change', this.onChange.bind(this))
  }

  onChange (e) {
    this.upload()
    this.translator.message(new Message('information', 'Uploading File...'))
  }

  upload () {
    this.translator.upload(this.element)
  }
}
