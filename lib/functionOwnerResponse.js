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
                    result += `\n=> ${chats[i].name}`
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
            message += messageResponse.bcGroups.success

            client.getAllGroups()
                .then(async (chats) => {
                    for (let i = 0; i < chats.length; i++) {
                        await client.sendText(chats[i].id.toString(), message)
                    }
                })
        }
    },

    clean: async (client, message) => {
        // delete path and recreate temp-media
        fs.rmdirSync(filePath.tempMedia.base, {recursive: true})
        fs.mkdirSync(filePath.tempMedia.base, {recursive: true})

        // create temp-media child directory
        fs.mkdirSync(filePath.tempMedia.instagram)
        fs.mkdirSync(filePath.tempMedia.youtube)

        await client.reply(message.from, messageResponse.clean.success, message.id)
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
                        const groupNameTemp = chats[i].name.toLowerCase()

                        if (groupName === groupNameTemp) {
                            found = true

                            const groupId = chats[i].id.toString()
                            const message = `Selamat tinggal para master di ${chats[i].name}`
                            await client.sendText(groupId, message)
                                .then(async () => {
                                    await client.leaveGroup(groupId)
                                })
                        }
                    }

                    if (!found) {
                        await client.reply(message.from, messageResponse.leaveGroup.error, message.id)
                    }
                })
        }
    },

    state: async (client, message, args) => {
        if (args.length === 0) {
            fs.readFile(filePath.json.state, 'utf8', async (_, data) => {
                if (data) {
                    const dataJson = JSON.parse(data)
                    let result = messageResponse.state.result

                    for (let i = 0; i < dataJson.length; i++) {
                        result += `\n- State: ${dataJson[i].state}`
                        result += `\n- Nama Group: ${dataJson[i].name}`
                        result += `\n- ID Group: ${dataJson[i].groupId}`
                        result += '\n============================'
                    }
                    result += `\n${messageResponse.state.help}`

                    await client.reply(message.from, result, message.id)
                } else {
                    await client.reply(message.from, messageResponse.state.empty, message.id)
                }
            })
        } else {
            argExtractor.getWord1Word2(args)
                .then(async (result) => {
                    const groupName = result.word1.toLowerCase()
                    const state = result.word2
                    const stateList = stringValues.state.list

                    if (stateList.includes(state)) {
                        let found = false
                        await client.getAllGroups()
                            .then(async (chats) => {
                                for (let i = 0; i < chats.length; i++) {
                                    const groupNameTemp = chats[i].name.toLowerCase()

                                    if (groupName === groupNameTemp) {
                                        found = true

                                        const groupId = chats[i].id
                                        const name = chats[i].name
                                        fs.readFile(filePath.json.state, 'utf8', (_, data) => {
                                            let stateJson = [];
                                            let stateJsonTemp;

                                            if (data) {
                                                stateJson = JSON.parse(data)

                                                for (let i = 0; i < stateJson.length; i++) {
                                                    if (groupId === stateJson[i].groupId) {
                                                        stateJsonTemp = stateJson[i]
                                                        break
                                                    }
                                                }
                                            }

                                            if (!stateJsonTemp) {
                                                stateJson.push(
                                                    {
                                                        'groupId': groupId,
                                                        'name': name,
                                                        'state': state
                                                    }
                                                )
                                            } else {
                                                stateJsonTemp.state = state
                                            }

                                            const json = JSON.stringify(stateJson, null, '\t')
                                            fs.writeFile(filePath.json.state, json, async (err) => {
                                                if (err) {
                                                    await client.reply(message.from, messageResponse.state.error, message.id)
                                                } else {
                                                    await client.reply(message.from, messageResponse.state.success, message.id)
                                                        .then(async () => {
                                                            const messageTemp = (state === stringValues.state.started) ? messageResponse.state.started : messageResponse.state.paused
                                                            await client.sendText(groupId.toString(), messageTemp)
                                                        })
                                                }
                                            })
                                        })

                                        break
                                    }
                                }

                                if (!found) {
                                    await client.reply(message.from, messageResponse.state.error, message.id)
                                }
                            })
                    } else {
                        throw 'State not found'
                    }
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.state.help, message.id)
                })
        }
    }
}

module.exports = functionOwnerResponse
