const yaml = require('js-yaml')
const fs = require('fs')

// my library
const messageResponse = require('../messageResponse')
const functionResponse = require('../functionResponse')
const {filePath, stringValues} = require('./strings')

// config
const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))

const checkSpam = async (client, message) => {
    return new Promise(async resolve => {
        try {
            const groupId = message.chat.groupMetadata.creation // bisa menyebabkan error, karena variable creation cuman ada di group
            fs.readFile(filePath.json.spam, 'utf8', async (_, data) => {
                if (data) {
                    const spamJson = JSON.parse(data)

                    for (let i = 0; i < spamJson.length; i++) {
                        if (spamJson[i].groupId === groupId) {
                            if (spamJson[i].option === 'on') {
                                resolve()
                                return
                            }
                        }
                    }
                }
                await client.reply(message.from, messageResponse.spam.offError, message.id)
            })
        } catch {
            await client.reply(message.from, messageResponse.onlyGroup, message.id)
        }
    })
}
exports.checkSpam = checkSpam

async function checkNsfw(client, message) {
    return new Promise(async resolve => {
        try {
            const groupId = message.chat.groupMetadata.creation // bisa menyebabkan error, karena variable creation cuman ada di group
            fs.readFile(filePath.json.nsfw, 'utf8', async (_, data) => {
                if (data) {
                    const nsfwJson = JSON.parse(data)

                    for (let i = 0; i < nsfwJson.length; i++) {
                        if (nsfwJson[i].groupId === groupId) {
                            if (nsfwJson[i].option === 'on') {
                                resolve()
                                return
                            }
                        }
                    }
                }
                await client.reply(message.from, messageResponse.nsfw.offError, message.id)
            })
        } catch {
            await client.reply(message.from, messageResponse.onlyGroup, message.id)
        }
    })
}

exports.checkNsfw = checkNsfw

async function checkIfOwner(client, message) {
    return new Promise(async resolve => {
        if (message.from === config['ownerNumber']) {
            resolve()
        } else {
            await client.reply(message.from, messageResponse.notFound, message.id)
        }
    })
}

exports.checkIfOwner = checkIfOwner

async function checkIfGroupAdmin(client, message) {
    return new Promise(async resolve => {
        if (message.isGroupMsg) {
            const results = await client.iAmAdmin()
            if (results.includes(message.from)) {
                resolve()
            } else {
                await client.reply(message.from, messageResponse.onlyAdmin, message.id)
            }
        } else {
            await client.reply(message.from, messageResponse.onlyGroup, message.id)
        }
    })
}

exports.checkIfGroupAdmin = checkIfGroupAdmin

const checkState = async (client, message) => {
    return new Promise(async (resolve, reject) => {
        // check jika tipe chat dan diawali tanda ! (seru)
        if (message.type === 'chat' && message.body.startsWith('!')) {
            fs.readFile(filePath.json.state, 'utf8', async (_, data) => {
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
                    if (stateJsonTemp.state === stringValues.state.started) {
                        resolve()
                    } else {
                        await client.reply(message.from, messageResponse.state.paused, message.id)
                    }
                } else {
                    // jika terjadi bot tidak aktif dan ada seseorang yang memasukkan ny ke group
                    // otomatis event onAddedToGroup tidak tereksekusi

                    // check jika itu !request
                    const messages = message.body.split(' ')
                    const command = messages[0].substring(1)
                    let err
                    if (command !== 'request') {
                        await client.reply(message.from, messageResponse.state.notRegistered, message.id)
                    } else {
                        const messages = message.body.split(' ')
                        const args = messages.slice(1, messages.length)
                        await functionResponse.request(client, message, args)
                    }
                }
            })
        }
    })
}
exports.checkState = checkState