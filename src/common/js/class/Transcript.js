export default class Transcript {
  constructor (fetchResultJson) {
    this.value = this.toString(fetchResultJson)
  }

  toString (fetchResultJson) {
    const transcripts = fetchResultJson.results.map(result => result.alternatives[0].transcript)
    return transcripts.join('').replace(/\u0020/g, '')
  }

  output () {
    return this.value
  }
}
