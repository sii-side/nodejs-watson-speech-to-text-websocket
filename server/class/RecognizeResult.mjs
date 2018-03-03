export default class RecognizeResult {
  constructor (result) {
    this.value = result
  }

  output () {
    return this.value.results.map(result => {
      const transcript = result.alternatives[0].transcript
      return transcript.replace(/\u0020/g, '')
    }).join('')
  }
}
