import fs from 'fs'
import path from 'path'

module.exports = (req, res) => {
  fs.readFile(path.resolve(__dirname, './micro-lc-base.js'), function (err, data) {
    if (err) throw err
    res.end(data)
  })
}
