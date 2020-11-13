const yaml = require('js-yaml')
const fs = require('fs')
const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))

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
        base: config.path.log,
        logText: `${config.path.log}/log.txt`
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

const authorization = {
    checkState: async function (client, message) {
        return new Promise( (resolve, reject) => {
            // check jika tipe chat dan diawali tanda ! (seru)
            if (message.type === 'chat' && message.body.startsWith('!')) {
                fs.readFile(filePath.json.state, 'utf8',  (_, data) => {
                    let stateJson = [];
                    let stateJsonTemp;
                    const groupName = message.chat.name.toLowerCase()

                    if (data) {
                        stateJson = JSON.parse(data)

                        for (let i = 0; i < stateJson.length; i++) {
                            if (groupName === stateJson[i].name.toLowerCase()) {
                                stateJsonTemp = stateJson[i]
                                break
                            }
                        }
                    }

                    if (stateJsonTemp) {
                        resolve(stateJsonTemp.state)
                    } else {
                        // jika terjadi bot tidak aktif dan ada seseorang yang memasukkan ny ke group
                        // otomatis event onAddedToGroup tidak tereksekusi

                        // check jika itu !request
                        const messages = message.body.split(' ')
                        const command = messages[0].substring(1)
                        let err
                        if (command !== 'request') {
                            err = 'ada error'
                        }

                        reject(err)
                    }
                })
            }
        })
    }
}
exports.authorization = authorization

const stringValues = {
    state: {
        list: ['started', 'paused'],
        started: 'started',
        paused: 'paused',
    },

    ownerName: '*Grandmaster*'
}
exports.stringValues = stringValues