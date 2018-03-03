import Transcript from './Transcript'

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
    this.translator.message({
      type: 'result',
      body: 'Sending File...'
    })
    const formData = new FormData()
    formData.append('sound', e.target.files[0])
    this.send(formData)
  }

  send (formData) {
    fetch('http://localhost:3000/send', {
      method: 'POST',
      mode: 'cors',
      body: formData
    }).then(response => {
      return response.json()
    }).then(result => {
      this.translator.message({
        type: 'result',
        body: new Transcript(result).output()
      })
    })
  }
}
