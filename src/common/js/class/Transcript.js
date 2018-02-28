export default class Transcript {
  constructor (fetchResultJson) {
    this.value = this.toString(fetchResultJson)
  }

  toString (fetchResultJson) {
    const transcripts = fetchResultJson.results.map(result => result.alternatives[0].transcript)
    return transcripts.join('').replace(/\u0020/g, '')
  }

  normalize () {
    const convertTable = {
      '一': '1',
      '二': '2',
      '三': '3',
      '四': '4',
      '五': '5',
      '六': '6',
      '七': '7',
      '八': '8',
      '九': '9',
      '〇': '0'
    }
    const regExp = new RegExp(`[${Object.keys(convertTable).join('')}]`, 'g')
    return this.value.replace(regExp, match => convertTable[match])
  }

  output () {
    return this.normalize()
  }
}
