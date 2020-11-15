const wa = require('@open-wa/wa-automate')
const yaml = require('js-yaml')
const fs = require('fs')

// my library
const messageHandler = require('./lib/messageHandler')
const messageResponse = require('./lib/messageResponse')
const {filePath} = require('./lib/helper/strings')
const {checkState} = require('./lib/helper/authorization')

// config
const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))

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

        // check ini pesan group atau tidak
        if (message.isGroupMsg) {
            // check state
            checkState(client, message)
                .then(async () => {
                    await messageHandler(client, message)
                })
        } else {
            // chat private for check status bot
            if (message.from === config['ownerNumber']) {
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
            await client.sendText(chat.id, `Hallo master master di group *${chat.formattedTitle}*\nsemoga saya dipake dengan benar`,)
            // todo mungkin feature ini harus dipake lagi
            // jika member terpenuhi
            // await client.getAllGroups().then(async (chats) => {
            //     const allGroup = chats.length
            //     // artinya hanya 3 group yn bisa ditangani
            //     if (allGroup > 3) {
            //         await client.sendText(chat.id, 'Mohon maaf tidak terima slot master,\nsaya dh puas dipake',)
            //             .then(() => {
            //                 client.leaveGroup(chat.id)
            //             })
            //     } else {
            //         // jika berhasil masuk
            //         await client.sendText(chat.id, `Hallo master master di group *${chat.formattedTitle}*\nsemoga saya dipake dengan benar`,)
            //     }
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
    // delete path and recreate temp-media
    fs.rmdirSync(filePath.tempMedia.base, {recursive: true})
    fs.mkdirSync(filePath.tempMedia.base, {recursive: true})

    // create temp-media child directory
    fs.mkdirSync(filePath.tempMedia.instagram)
    fs.mkdirSync(filePath.tempMedia.youtube)

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
