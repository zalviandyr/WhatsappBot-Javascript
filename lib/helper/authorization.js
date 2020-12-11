const fs = require('fs')

// my library
const messageResponse = require('../messageResponse')
const {filePath, stringValues} = require('./strings')

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

async function checkIsOwner(client, message) {
    return new Promise(async resolve => {
        if (message.from === stringValues.ownerNumber) {
            resolve()
        } else {
            await client.reply(message.from, messageResponse.notFound, message.id)
        }
    })
}

exports.checkIsOwner = checkIsOwner

async function checkIsGroup(client, message) {
    return new Promise(async resolve => {
        if (message.isGroupMsg) {
            resolve()
        } else {
            await client.reply(message.from, messageResponse.onlyGroup, message.id)
        }
    })
}

exports.checkIsGroup = checkIsGroup

async function checkIsGroupAdmin(client, message) {
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

exports.checkIsGroupAdmin = checkIsGroupAdmin
