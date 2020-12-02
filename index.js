const wa = require('@open-wa/wa-automate')
const fs = require('fs')

// my library
const messageHandler = require('./lib/messageHandler')
const messageResponse = require('./lib/messageResponse')
const {filePath, stringValues} = require('./lib/helper/strings')

const start = async (client) => {
    // create delete path
    createDeletePath()

    // listening a messages
    await client.onMessage(async (message) => {
        client.getAmountOfLoadedMessages().then((numberMsg) => {
            if (numberMsg >= 1000) {
                client.cutMsgCache()
            }
        })
        await filterContact(client, message)

        // check ini pesan group atau tidak
        if (message.isGroupMsg) {
            await messageHandler(client, message)
        } else {
            // chat private for check status bot
            if (message.from === stringValues.ownerNumber) {
                await messageHandler(client, message)
            } else {
                await client.sendText(message.from, messageResponse.privateMessage)
            }
        }
    })

    // listening on added to group
    await client.onAddedToGroup(async (chat) => {
        const groupMember = chat.groupMetadata.participants.length
        if (groupMember < 10) {
            await client.sendText(chat.id.toString(), messageResponse.lessParticipants)
                .then(() => {
                    client.leaveGroup(chat.id)
                })
        } else {
            const ownerNumber = stringValues.ownerNumber
            await client.sendText(chat.id.toString(), `Hallo master master di group *${chat.formattedTitle}*\nsemoga saya dipake dengan benar\nSilahkan ketik *!help* untuk melihat menu master`)
            await client.sendText(ownerNumber, `‼ Inori join ke group *${chat.formattedTitle}*`)

            // todo mungkin feature ini harus dipake lagi
            // jika member terpenuhi
            // await client.getAllGroups().then(async (chats) => {
            //     const allGroup = chats.length
            //     // artinya hanya 3 group yn bisa ditangani
            //     if (allGroup > 3) {
            //       :  await client.sendText(chat.id, 'Mohon maaf tidak terima slot master,\nsaya dh puas dipake',)
            //             .then(() => {
            //                 client.leaveGroup(chat.id)
            //             })
            //     } else {
            //         // jika berhasil masuk
            //         await client.sendTddext(chat.id, `Hallo master master di group *${chat.formattedTitle}*\nsemoga saya dipake dengan benar`,)
            //     }:
            // })
        }
    })

    // listening on incoming call
    await client.onIncomingCall(async (call) => {
        await client.sendText(call.peerJid, messageResponse.incomingCall)
            .then(() => {
                client.contactBlock(call.peerJid)
            })
    })
}

/**
 * Hapus dan buat ulang folder temp-media yang berisikan hasil download
 * jika server dihidupkan kembali
 */
function createDeletePath() {
    // create json and log path, recursive to ignore error
    fs.mkdirSync(filePath.json.base, {recursive: true})
    fs.mkdirSync(filePath.log.base, {recursive: true})
}

wa.create({
    restartOnCrash: start,
    // untuk kirim video set chrome exe
    useChrome: true,
    autoRefresh: true,
    sessionId: 'inori',
    cacheEnabled: false,
    killProcessOnBrowserClose: true,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0',
        '--disable-gpu',
        '--disable-dev-shm-usage'
    ]
}).then((client) => start(client))

async function filterContact(client, message) {
    if (message.isGroupMsg) { // auto out jika banya nomor +62 tidak diatas 80%
        const groupId = message.from
        const members = await client.getGroupMembers(groupId)
        const noID = []
        members.forEach(((value) => {
            if (value.id.startsWith('62')) {
                noID.push(value.id)
            }
        }))

        const percentage = (noID.length / members.length) * 100
        if (percentage < 80) {
            await client.sendText(groupId, 'Bye bye master')
            await client.leaveGroup(groupId)
        }
    } else { // autos block jika private message tidak dari +62
        const contactId = message.from
        if (!contactId.startsWith('62')) {
            await client.sendText(contactId, 'Bye bye master')
            await client.contactBlock(contactId)
        }
    }
}
