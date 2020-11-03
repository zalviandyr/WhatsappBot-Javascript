const yaml = require('js-yaml')
const fs = require('fs')

// my library
const messageResponse = require('./messageResponse')
const functionResponse = require('./functionResponse')
const functionOwnerResponse = require('./functionOwnerResponse')

// config
const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))

// hanya untuk membuat variable Client tau apa" method nya
const messageHandler = async (client, message) => {
    let messages
    let command
    let args

    // cek jika pesan tipe-nya chat
    if (message.type === 'chat') {
        messages = message.body.split(' ')
        args = messages.slice(1, messages.length)
        command = messages[0]
    } else {
        messages = message.caption.split(' ')
        args = messages.slice(1, messages.length)
        command = messages[0]
    }

    // mengecek jika pesan diawali ! (tanda seru)
    if (command.startsWith('!')) {
        // dan buang tanda seru tersebut
        command = command.substring(1)

        // create log
        await createLog(message, command)

        switch (command) {
            case 'help': {
                await client.reply(
                    message.from,
                    messageResponse.help,
                    message.id,
                )
                break
            }
            case 'tutorial': {
                await client.reply(
                    message.from,
                    messageResponse.tutorial,
                    message.id,
                )
                break
            }
            case 'request': {
                await functionResponse.request(client, message, args)
                break
            }
            case 'creator': {
                await client.reply(
                    message.from,
                    messageResponse.creator,
                    message.id,
                )
                break
            }
            case 'about': {
                await functionResponse.about(client, message)
                break
            }
            case 'sticker': {
                await functionResponse.sticker(client, message, args)
                break
            }
            case 'meme': {
                await functionResponse.meme(client, message)
                break
            }
            case 'jadwalshalat': {
                await functionResponse.jadwalShalat(client, message, args)
                break
            }
            case 'quotemaker': {
                await functionResponse.quoteMaker(client, message, args)
                break
            }
            case 'igstalk': {
                await functionResponse.igStalk(client, message, args)
                break
            }
            case 'ig': {
                await functionResponse.ig(client, message, args)
                break
            }
            case 'igstories': {
                await functionResponse.igStories(client, message, args)
                break
            }
            case 'fbvideo': {
                await functionResponse.fbVideo(client, message, args)
                break
            }
            case 'ytaudio': {
                await functionResponse.ytAudio(client, message, args)
                break
            }
            case 'ytvideo': {
                await functionResponse.ytVideo(client, message, args)
                break
            }
            case 'tugas': {
                await functionResponse.tugas(client, message, args)
                break
            }
            case 'translate': {
                await functionResponse.translate(client, message, args)
                break
            }
            case 'waifu': {
                await functionResponse.waifu(client, message)
                break
            }
            case 'kabupatenkota': {
                await functionResponse.kabupatenKota(client, message, args)
                break
            }
            case 'cuaca': {
                await functionResponse.cuaca(client, message, args)
                break
            }
            case 'infogempa': {
                await functionResponse.infoGempa(client, message)
                break
            }
            case 'bosan': {
                await functionResponse.bosan(client, message)
                break
            }
            case 'kanyequote': {
                await functionResponse.kanyeQuote(client, message)
                break
            }
            case 'speech': {
                await functionResponse.speech(client, message, args)
                break
            }
            case 'brainly': {
                await functionResponse.brainly(client, message, args)
                break
            }
            case 'lirik': {
                await functionResponse.lirik(client, message, args)
                break
            }
            // Command khusus di group dan admin
            case 'add': {
                checkIfGroupAdmin(client, message)
                    .then(async () => {
                        await functionResponse.add(client, message, args)
                    })
                break
            }
            case 'kick': {
                checkIfGroupAdmin(client, message)
                    .then(async () => {
                        await functionResponse.kick(client, message, args)
                    })
                break
            }
            case 'mentionall': {
                checkIfGroupAdmin(client, message)
                    .then(async () => {
                        await functionResponse.mentionAll(client, message)
                    })
                break
            }
            case 'linkgroup': {
                checkIfGroupAdmin(client, message)
                    .then(async () => {
                        await functionResponse.linkGroup(client, message)
                    })
                break
            }
            // Command khusus di group dan admin (NSFW)
            case 'nsfw': {
                checkIfGroupAdmin(client, message)
                    .then(async () => {
                        await functionResponse.nsfw(client, message, args)
                    })
                break
            }
            case 'lewd': {
                checkNsfw(client, message)
                    .then(async () => {
                        await functionResponse.lewd(client, message, args)
                    })
                break
            }
            case 'wallpaper': {
                checkNsfw(client, message)
                    .then(async () => {
                        await functionResponse.wallpaper(client, message)
                    })
                break
            }
            // Command khusus owner yang disetting di config.yml
            case 'helpowner': {
                checkIfOwner(client, message)
                    .then(async () => {
                        await client.reply(message.from, messageResponse.helpOwner, message.id)
                    })
                break
            }
            case 'groups': {
                checkIfOwner(client, message)
                    .then(async () => {
                        await functionOwnerResponse.groups(client, message)
                    })
                break
            }
            case 'requests': {
                checkIfOwner(client, message)
                    .then(async () => {
                        await functionOwnerResponse.requests(client, message)
                    })
                break
            }
            default: {
                await client.reply(message.from, messageResponse.notFound, message.id)
                break
            }
        }
    }
}

async function checkIfOwner(client, message) {
    return new Promise(async resolve => {
        if (message.from === config.ownerNumber) {
            resolve()
        } else {
            await client.reply(message.from, messageResponse.notFound, message.id)
        }
    })
}

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

async function checkNsfw(client, message) {
    return new Promise(async resolve => {
        try {
            const groupId = message.chat.groupMetadata.creation // bisa menyebabkan error, karena variable creation cuman ada di group
            fs.readFile(`${config.path['json']}/nsfw.json`, 'utf8', async (_, data) => {
                if (data) {
                    const nsfwJson = JSON.parse(data)

                    for (let i = 0; i < nsfwJson.length; i++) {
                        if (nsfwJson[i].groupId === groupId) {
                            if (nsfwJson[i].option === 'on') {
                                resolve()
                            } else {
                                await client.reply(message.from, messageResponse.nsfw.offError, message.id)
                            }
                            break
                        }
                    }
                } else {
                    await client.reply(message.from, messageResponse.nsfw.offError, message.id)
                }
            })
        } catch {
            await client.reply(message.from, messageResponse.onlyGroup, message.id)
        }
    })
}

async function createLog(message, command) {
    const path = `${config.path.log}/log.txt`
    const name = message.sender.pushname
    const group = message.chat.contact.name
    const dateNow = new Date().toLocaleDateString()
    const timeNow = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    })
    fs.readFile(path, 'utf8', (err, data) => {
        let prevData = ''
        if (data) {
            prevData = data
        }
        const template = `${prevData}[${dateNow} - ${timeNow}] => ${name} eksekusi ${command} di ${group}\n`

        // write into file
        fs.writeFile(path, template, (err1) => {
            if (err1) {
                console.log(err1)
            } else {
                // show on console
                console.log(
                    `[${dateNow} - ${timeNow}] => ${name} eksekusi ${command} di ${group}`,
                )
            }
        })
    })
}

module.exports = messageHandler
