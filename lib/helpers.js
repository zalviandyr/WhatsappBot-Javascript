const yaml = require('js-yaml')
const fs = require('fs')
const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))
const messageResponse = require('./messageResponse')

const filePath = {
    json: {
        base: config.path.json,
        nsfw: `${config.path.json}/nsfw.json`,
        request: `${config.path.json}/request.json`,
        spam: `${config.path.json}/spam.json`,
        state: `${config.path.json}/state.json`,
        tugas: `${config.path.json}/tugas.json`,
    },
    log: {
        base: config.path.log
    },
    media: {
        base: config.path.media,
        about: `${config.path.media}/about.jpg`
    },
    tempMedia: {
        base: config.path.tempMedia,
        instagram: config.path.instagram,
        youtube: config.path.youtube
    }
}
exports.filePath = filePath

// function for read and write file authorization
// like: nsfw, spam, state,
const fileAuth = function (type, jsonPattern) {
    let path
    if (type === 'nsfw') {
        path = filePath.json.nsfw
    } else if (type === 'spam') {
        path = filePath.json.spam
    }

    let spamJson = []
    let spamTemp = {}

    fs.readFile(filePath.json.spam, 'utf8', (_, data) => {
        if (data) {
            spamJson = JSON.parse(data)
            for (let i = 0; i < spamJson.length; i++) {
                if (spamJson[i].groupId === groupId) {
                    spamTemp = spamJson[i]
                    break
                }
            }
        }

        // check if nfswTemp null
        if (spamTemp.groupId) {
            spamTemp.option = args[0]
        } else {
            spamJson.push({
                'groupId': groupId,
                'option': args[0]
            })
        }
        messageResponseTemp = (args[0] === 'on') ? messageResponse.spam.on : messageResponse.spam.off

        const json = JSON.stringify(spamJson)
        fs.writeFile(filePath.json.spam, json, async (err) => {
            if (err) {
                await client.reply(message.from, messageResponse.spam.error, message.id)
            } else {
                await client.reply(message.from, messageResponseTemp, message.id)
            }
        })
    })
}
exports.fileAuth = fileAuth