const fs = require('fs')
const url = require('url')
const fileType = require('file-type')

// my lib
const {filePath} = require('./strings')

const argExtractor = {
    getWord1Word2: (args) => {
        return new Promise((resolve, reject) => {
            const argsString = args.toString().replace(/,/g, ' ')

            if (argsString.includes(':')) {
                // check jika ':' cuman satu
                if (argsString.split(':').length === 3) {
                    const array = argsString.substring(1).split(':')
                    const result = {
                        'word1': array[0],
                        'word2': array[1]
                    }
                    resolve(result)
                }
            }
            reject()
        })
    }
}
exports.argExtractor = argExtractor

async function createLog(message, command) {
    const path = filePath.log.logText
    const name = message.sender.pushname
    const group = message.chat.contact.name
    const dateNow = new Date().toLocaleDateString()
    const timeNow = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    })
    fs.readFile(path, 'utf8', (err, data) => {
        let prevData = ''
        if (data) {
            prevData = data
        }
        const template = `${prevData}[${dateNow} - ${timeNow}] => ${name} eksekusi ${command} di ${group}\n`

        // write into file
        fs.writeFile(path, template, (err1) => {
            if (err1) {
                console.log(err1)
            } else {
                // show on console
                console.log(
                    `[${dateNow} - ${timeNow}] => ${name} eksekusi ${command} di ${group}`,
                )
            }
        })
    })
}
exports.createLog = createLog

const fetcher = async (filePath) => {
    return new Promise(async (resolve, reject) => {
        fs.readFile(filePath, async (_, data) => {
            if (data) {
               await fileType.fromBuffer(data)
                   .then(result => {
                       const dataUrl = `data:${result.mime};base64,${data.toString('base64')}`
                       resolve(dataUrl)
                   })
            } else {
                reject()
            }
        })
    })
}
exports.fetcher = fetcher

const checkFacebookLink = (link) => {
    const temp = url.parse(link)
    const validQueryDomains = new Set([
        'facebook.com',
        'www.facebook.com',
        'm.facebook.com',
    ]);

    return validQueryDomains.has(temp.hostname)
}
exports.checkFacebookLink = checkFacebookLink