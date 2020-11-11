const yaml = require('js-yaml')
const fs = require('fs')
const messageResponse = require('./messageResponse')

// config
const config = yaml.safeLoad(fs.readFileSync('./config.yml'))

/**
 * fungsi ini akan dijalankan walaupun pesannya lewat grup
 * maka dari itu ada reply command not found
 */
const functionOwnerResponse = {
    groups: async (client, message) => {
        let result = 'Ini list yang bergabung master'
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
        const json = `${config.path.json}/request.json`
        fs.readFile(json, 'utf8', (async (_, data) => {
            let result = 'Ini list yang di-request master'
            const requestsJson = JSON.parse(data)
            for (let i = 0; i < requestsJson.length; i++) {
                result += `\n- Request: ${requestsJson[i].request}`
                result += `\n- Dari: ${requestsJson[i].sender}`
                result += `\n- Nama: ${requestsJson[i].pushname}`
                result += `\n- Group: ${requestsJson[i].ingroup}`
                result += '\n============================'
            }

            await client.reply(message.from, result, message.id)
        }))
    },

    bc: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.bc.help, message.id)
        } else {
            const argsString = args.toString().replace(/,/g, ' ')
            if (argsString.includes(':')) {
                const array = argsString.substring(1).split(':')
                const groupName = array[0].replace(/,/g, ' ').toLowerCase()
                const text = array[1].replace(/,/g, ' ')

                client.getAllGroups()
                    .then(async (chats) => {
                        let found = false
                        for (let i = 0; i < chats.length; i++) {
                            const groupNameTemp = chats[i].name.toLowerCase()

                            if (groupName === groupNameTemp) {
                                found = true
                                await client.sendText(chats[i].id.toString(), text)
                            }
                        }

                        if (!found) {
                            await client.reply(message.from, messageResponse.bc.error, message.id)
                        }
                    })
            } else {
                await client.reply(message.from, messageResponse.bc.help, message.id)
            }
        }
    },

    bcGroups: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.bcGroups.help, message.id)
        } else {
            let message = args.toString().replace(/,/g, ' ')
            message += '\nby *Grandmaster*'

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
    }
}

module.exports = functionOwnerResponse
