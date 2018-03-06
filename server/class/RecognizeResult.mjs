export default class RecognizeResult {
  constructor (result) {
    this.value = result
  }

  index () {
    return this.value.result_index
  }

  confidence () {
    return this.value.results[0].alternatives[0].confidence
  }

  final () {
    return this.value.results[0].final
  }

  output () {
    return this.value.results.map(result => {
      const transcript = result.alternatives[0].transcript
      return transcript.replace(/\u0020/g, '')
    }).join('')
  }
}
