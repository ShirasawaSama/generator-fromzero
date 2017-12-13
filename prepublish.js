const fs = require('fs')
const { join } = require('path')

const dirName = join(__dirname, 'generators')
fs
  .readdirSync(dirName)
  .map(dir => join(dirName, dir))
  .filter(dir => fs.existsSync(join(dir, 'package-lock.json')))
  .forEach(dir => fs.writeFileSync(
    join(dir, 'packageLock.json'),
    fs.readFileSync(join(dir, 'package-lock.json'))
  ))
