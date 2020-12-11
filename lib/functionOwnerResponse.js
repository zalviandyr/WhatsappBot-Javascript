const fs = require('fs').promises
const messageResponse = require('./messageResponse')
const {filePath} = require('./helper/strings')
const {argExtractor, createErrorLog, createFile} = require('./helper/utilities')

/**
 * fungsi ini akan dijalankan walaupun pesannya lewat grup
 * maka dari itu ada reply command not found
 */
const functionOwnerResponse = {
    groups: async (client, message) => {
        try {
            let result = messageResponse.groups.result
            const chats = await client.getAllGroups()
            for (let i = 0; i < chats.length; i++) {
                result += `\n=> ${chats[i].id}`
                result += `\n=> ${chats[i].formattedTitle}`
            }

            await client.reply(message.from, result, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    requests: async (client, message) => {
        try {
            await createFile(filePath.json.request)
            const data = await fs.readFile(filePath.json.request, 'utf8')
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
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    reports: async (client, message) => {
        try {
            await createFile(filePath.json.report)
            const data = await fs.readFile(filePath.json.report, 'utf8')
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
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    bc: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.bc.help, message.id)
            } else {
                const result = argExtractor.getWord1Word2(args)
                const groupName = result.word1.toLowerCase()
                const text = result.word2

                const chats = await client.getAllGroups()
                let found = false
                for (let i = 0; i < chats.length; i++) {
                    const groupNameTemp = chats[i].name.toLowerCase()

                    if (groupName === groupNameTemp) {
                        found = true
                        await client.reply(message.from, messageResponse.bc.success, message.id)
                        await client.sendText(chats[i].id.toString(), text)
                    }
                }

                if (!found) {
                    await client.reply(message.from, messageResponse.bc.error, message.id)
                }
            }
        } catch (err) {
            if (err.name === 'WordExtractorError') {
                await client.reply(message.from, messageResponse.bc.help, message.id)
            } else {
                // mengatasi jika bot sudah leave tpi group masih ada di getAllGroups
                // (Blum didelete di chat whatsapp)
                await client.reply(message.from, messageResponse.bc.error, message.id)
                createErrorLog(message, err)
            }
        }
    },

    bcGroups: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.bcGroups.help, message.id)
            } else {
                let message = args.toString().replace(/,/g, ' ') + '\n'

                const chats = await client.getAllGroups()
                for (let i = 0; i < chats.length; i++) {
                    await client.sendText(chats[i].id.toString(), message)
                }
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    leaveGroup: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.leaveGroup.help, message.id)
            } else {
                const groupName = args.toString().replace(/,/g, ' ').toLowerCase()

                const chats = await client.getAllGroups()
                let found = false
                for (let i = 0; i < chats.length; i++) {
                    const groupNameTemp = chats[i].formattedTitle.toLowerCase()

                    if (groupName === groupNameTemp) {
                        found = true

                        const groupId = chats[i].id.toString()
                        const response = `Selamat tinggal para master di ${chats[i].name}`
                        await client.reply(message.from, messageResponse.leaveGroup.success, message.id)
                        await client.sendText(groupId, response)
                        await client.leaveGroup(groupId)
                    }
                }

                if (!found) {
                    await client.reply(message.from, messageResponse.leaveGroup.error, message.id)
                }
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    status: async (client, message) => {
        try {
            await client.reply(message.from, messageResponse.commonWait, message.id)

            const NS_PER_SEC = 1e9
            const MS_PER_NS = 1e-6
            const time = process.hrtime()

            const allChat = await client.getAllChats()
            const allGroup = await client.getAllGroups()
            const allPrivateChat = allChat.length - allGroup.length

            let allMessage = 0
            for (let i = 0; i < allChat.length; i++) {
                const allMessagePerChat = await client.getAllMessagesInChat(allChat[i].id, true, true)
                allMessage += allMessagePerChat.length
            }
            const diff = process.hrtime(time)

            let result = '🤖 Inori Yuzuriha Bot 🤖\n'
            result += 'Status bot right now\n\n'
            result += `*Chats:* ${allChat.length}\n`
            result += `*Groups:* ${allGroup.length}\n`
            result += `*Private Chat:* ${allPrivateChat}\n`
            result += `*Messages:* ${allMessage}\n\n`
            result += '*Response time:*\n'
            result += `${(diff[0] * NS_PER_SEC + diff[1]) * MS_PER_NS} milliseconds\n\n`
            result += 'Semakin lama response time, maka ada kemungkinan pesan yang dikirim akan delay atau tidak terkirim sama sekali'

            const dataUrl = await fetcher(filePath.media.inori)
            await client.sendFile(message.from, dataUrl.toString(), 'inori.jpg', result, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    }
}

module.exports = functionOwnerResponse
