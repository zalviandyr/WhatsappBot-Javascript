const fs = require('fs')
const messageResponse = require('./messageResponse')
const {filePath, stringValues} = require('./helper/strings')
const {argExtractor} = require('./helper/utilities')

/**
 * fungsi ini akan dijalankan walaupun pesannya lewat grup
 * maka dari itu ada reply command not found
 */
const functionOwnerResponse = {
    groups: async (client, message) => {
        let result = messageResponse.groups.result
        client.getAllGroups()
            .then(async (chats) => {
                for (let i = 0; i < chats.length; i++) {
                    result += `\n=> ${chats[i].id}`
                    result += `\n=> ${chats[i].formattedTitle}`
                }

                await client.reply(message.from, result, message.id)
            })
    },

    requests: async (client, message) => {
        fs.readFile(filePath.json.request, 'utf8', (async (_, data) => {
            if (data) {
                let result = messageResponse.request.result
                const requestsJson = JSON.parse(data)
                for (let i = 0; i < requestsJson.length; i++) {
                    result += `\n- Request: ${requestsJson[i].request}`
                    result += `\n- Dari: ${requestsJson[i].sender}`
                    result += `\n- Nama: ${requestsJson[i].pushname}`
                    result += `\n- Group: ${requestsJson[i].ingroup}`
                    result += '\n============================'
                }

                await client.reply(message.from, result, message.id)
            } else {
                await client.reply(message.from, messageResponse.request.empty, message.id)
            }
        }))
    },

    reports: async (client, message) => {
        fs.readFile(filePath.json.report, 'utf8', (async (_, data) => {
            if (data) {
                let result = messageResponse.report.result
                const requestsJson = JSON.parse(data)
                for (let i = 0; i < requestsJson.length; i++) {
                    result += `\n- Report: ${requestsJson[i].report}`
                    result += `\n- Dari: ${requestsJson[i].sender}`
                    result += `\n- Nama: ${requestsJson[i].pushname}`
                    result += `\n- Group: ${requestsJson[i].ingroup}`
                    result += '\n============================'
                }

                await client.reply(message.from, result, message.id)
            } else {
                await client.reply(message.from, messageResponse.report.empty, message.id)
            }
        }))
    },

    bc: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.bc.help, message.id)
        } else {
            argExtractor.getWord1Word2(args)
                .then(async (result) => {
                    const groupName = result.word1.toLowerCase()
                    const text = result.word2

                    client.getAllGroups()
                        .then(async (chats) => {
                            let found = false
                            for (let i = 0; i < chats.length; i++) {
                                const groupNameTemp = chats[i].name.toLowerCase()

                                if (groupName === groupNameTemp) {
                                    found = true
                                    await client.reply(message.from, messageResponse.bc.success, message.id)
                                        .then(async () => {
                                            await client.sendText(chats[i].id.toString(), text)
                                        })
                                }
                            }

                            if (!found) {
                                await client.reply(message.from, messageResponse.bc.error, message.id)
                            }
                        })
                        .catch(async () => {
                            // mengatasi jika bot sudah leave tpi group masih ada di getAllGroups
                            // (Blum didelete di chat whatsapp)
                            await client.reply(message.from, messageResponse.bc.error, message.id)
                        })
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.bc.help, message.id)
                })
        }
    },

    bcGroups: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.bcGroups.help, message.id)
        } else {
            let message = args.toString().replace(/,/g, ' ') + '\n'

            client.getAllGroups()
                .then(async (chats) => {
                    for (let i = 0; i < chats.length; i++) {
                        await client.sendText(chats[i].id.toString(), message)
                    }
                })
        }
    },

    leaveGroup: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.leaveGroup.help, message.id)
        } else {
            const groupName = args.toString().replace(/,/g, ' ').toLowerCase()

            client.getAllGroups()
                .then(async (chats) => {
                    let found = false
                    for (let i = 0; i < chats.length; i++) {
                        const groupNameTemp = chats[i].formattedTitle.toLowerCase()

                        if (groupName === groupNameTemp) {
                            found = true

                            const groupId = chats[i].id.toString()
                            const response = `Selamat tinggal para master di ${chats[i].name}`
                            await client.reply(message.from, messageResponse.leaveGroup.success, message.id)
                                .then(async () => {
                                    await client.sendText(groupId, response)
                                        .then(async () => {
                                            await client.leaveGroup(groupId)
                                        })
                                })
                        }
                    }

                    if (!found) {
                        await client.reply(message.from, messageResponse.leaveGroup.error, message.id)
                    }
                })
        }
    }
}

module.exports = functionOwnerResponse
