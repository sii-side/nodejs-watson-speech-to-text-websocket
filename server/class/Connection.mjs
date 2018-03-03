import io from 'socket.io'
import IoFile from 'socket.io-file'

export default class Connection {
  constructor (server) {
    this.server = server
    this.io = io(server.server)
    this.uploader = null
  }

  attach () {
    this.io.on('connection', socket => {
      this.server.console.log('connected.')

      this.uploader = new IoFile(socket, {
        uploadDir: './upload'
      })

      this.uploader.on('complete', fileInfo => {
        this.info('Upload completed.')
        this.server.message({
          type: 'complete',
          body: fileInfo
        })
      })
    })
  }

  info (message) {
    this.io.sockets.emit('information', {
      message: message
    })
  }

  data (data) {
    this.io.sockets.emit('data', {
      message: data
    })
  }
}
