// my library
const messageResponse = require('./messageResponse')
const functionResponse = require('./functionResponse')
const functionOwnerResponse = require('./functionOwnerResponse')
const {createLog} = require('./helper/utilities')
const {checkIsOwner, checkIsGroup, checkIsGroupAdmin, checkNsfw} = require('./helper/authorization')

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
                await client.reply(message.from, messageResponse.help, message.id)
                break
            }
            case 'tutorial': {
                await client.reply(message.from, messageResponse.tutorial, message.id)
                break
            }
            case 'request': {
                await functionResponse.request(client, message, args)
                break
            }
            case 'report': {
                await functionResponse.report(client, message, args)
                break
            }
            case 'creator': {
                await client.reply(message.from, messageResponse.creator, message.id)
                break
            }
            case 'donasi': {
                await functionResponse.donasi(client, message)
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
            case 'stickergif': {
                await functionResponse.stickerGif(client, message, args)
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
            case 'ig': {
                await functionResponse.ig(client, message, args)
                break
            }
            case 'igstalk': {
                await functionResponse.igStalk(client, message, args)
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
            case 'ytsearch': {
                await functionResponse.ytSearch(client, message, args)
                break
            }
            case 'ytplay': {
                await functionResponse.ytPlay(client, message, args)
                break
            }
            case 'ytvideo': {
                await functionResponse.ytVideo(client, message, args)
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
            case 'waifu2': {
                await functionResponse.waifu2(client, message)
                break
            }
            case 'waifu3': {
                await functionResponse.waifu3(client, message)
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
            case 'covid': {
                await functionResponse.covid(client, message, args)
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
            case 'quote': {
                await functionResponse.quote(client, message)
                break
            }
            case 'quote2': {
                await functionResponse.quote2(client, message)
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
            case 'kusonime': {
                await functionResponse.kusonime(client, message, args)
                break
            }
            case 'artinama': {
                await functionResponse.artiNama(client, message, args)
                break
            }
            case 'pasangan': {
                await functionResponse.pasangan(client, message, args)
                break
            }
            case 'penyakit': {
                await functionResponse.penyakit(client, message, args)
                break
            }
            case 'pekerjaan': {
                await functionResponse.pekerjaan(client, message, args)
                break
            }
            case 'whatanime': {
                await functionResponse.whatAnime(client, message, args)
                break
            }
            case 'quran': {
                await functionResponse.quran(client, message)
                break
            }
            case 'surat': {
                await functionResponse.surat(client, message, args)
                break
            }
            case 'alkitab': {
                await functionResponse.alkitab(client, message, args)
                break
            }
            case 'drakorasia': {
                await functionResponse.drakorasia(client, message, args)
                break
            }
            case 'lirik': {
                await functionResponse.lirik(client, message, args)
                break
            }
            case 'shortlink': {
                await functionResponse.shortLink(client, message, args)
                break
            }
            case 'suit': {
                await functionResponse.suit(client, message, args)
                break
            }
            case 'manga': {
                await functionResponse.manga(client, message, args)
                break
            }
            case 'movie': {
                await functionResponse.movie(client, message, args)
                break
            }
            case 'movie2': {
                await functionResponse.movie2(client, message, args)
                break
            }
            // Command kerang
            case 'apakah': {
                await functionResponse.apakah(client, message, args)
                break
            }
            case 'kapankah': {
                await functionResponse.kapankah(client, message, args)
                break
            }
            case 'siapakah': {
                checkIsGroup(client, message)
                    .then(async () => {
                        await functionResponse.siapakah(client, message, args)
                    })
                break
            }
            // Command utility
            case 'delete': {
                await functionResponse.delete(client, message)
                break
            }
            // Command khusus di group dan study
            case 'tugas': {
                checkIsGroup(client, message)
                    .then(async () => {
                        await functionResponse.tugas(client, message, args)
                    })
                break
            }
            case 'wiki': {
                await functionResponse.wiki(client, message, args)
                break
            }
            // Command khusus di group dan admin
            case 'add': {
                checkIsGroupAdmin(client, message)
                    .then(async () => {
                        await functionResponse.add(client, message, args)
                    })
                break
            }
            case 'kick': {
                checkIsGroupAdmin(client, message)
                    .then(async () => {
                        await functionResponse.kick(client, message, args)
                    })
                break
            }
            case 'mentionall': {
                checkIsGroupAdmin(client, message)
                    .then(async () => {
                        await functionResponse.mentionAll(client, message)
                    })
                break
            }
            case 'linkgroup': {
                checkIsGroupAdmin(client, message)
                    .then(async () => {
                        await functionResponse.linkGroup(client, message)
                    })
                break
            }
            // Command khusus di group dan admin (NSFW)
            case 'nsfw': {
                checkIsGroupAdmin(client, message)
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
            case 'lewd2': {
                checkNsfw(client, message)
                    .then(async () => {
                        await functionResponse.lewd2(client, message)
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
            // Command khusus owner yang disetting di strings.js
            case 'helpowner': {
                checkIsOwner(client, message)
                    .then(async () => {
                        await client.reply(message.from, messageResponse.helpOwner, message.id)
                    })
                break
            }
            case 'groups': {
                checkIsOwner(client, message)
                    .then(async () => {
                        await functionOwnerResponse.groups(client, message)
                    })
                break
            }
            case 'requests': {
                checkIsOwner(client, message)
                    .then(async () => {
                        await functionOwnerResponse.requests(client, message)
                    })
                break
            }
            case 'reports': {
                checkIsOwner(client, message)
                    .then(async () => {
                        await functionOwnerResponse.reports(client, message)
                    })
                break
            }
            case 'bc': {
                checkIsOwner(client, message)
                    .then(async () => {
                        await functionOwnerResponse.bc(client, message, args)
                    })
                break
            }
            case 'bcgroups': {
                checkIsOwner(client, message)
                    .then(async () => {
                        await functionOwnerResponse.bcGroups(client, message, args)
                    })
                break
            }
            case 'leavegroup': {
                checkIsOwner(client, message)
                    .then(async () => {
                        await functionOwnerResponse.leaveGroup(client, message, args)
                    })
                break
            }
            case 'status': {
                checkIsOwner(client, message)
                    .then(async () => {
                        await functionOwnerResponse.status(client, message)
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

module.exports = messageHandler
