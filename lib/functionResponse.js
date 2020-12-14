const {decryptMedia} = require('@open-wa/wa-decrypt')
const fs = require('fs').promises
const axios = require('axios')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
const tinyurl = require('tinyurl')

// my library
const messageResponse = require('./messageResponse')
const {filePath, stringValues} = require('./helper/strings')
const {argExtractor, fetcher, createErrorLog, createFile} = require('./helper/utilities')
const {youtubeSizeValidation, checkFacebookLink} = require('./helper/validate')

// set path ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath)

const functionResponse = {
    about: async (client, message) => {
        try {
            const dataUrl = await fetcher(filePath.media.about)
            await client.reply(message.from, messageResponse.about, message.id)
            await client.sendImageAsSticker(message.from, dataUrl.toString())
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    donasi: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/saweria`
            const dataUrl = await fetcher(filePath.media.inori)
            const response = await axios.get(url)
            let result = `${response.data['description']}\n\n`
            result += `*Donasi:*\n`
            for (let i = 0; i < response.data['transactions'].length; i++) {
                const transactions = response.data['transactions'][i]
                result += `${i + 1}. ${transactions['donatur']['firstName']}\n`
            }
            result += `\n*Link:* ${response.data['link']}`

            await client.sendFile(message.from, dataUrl.toString(), 'inori.jpg', result, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    request: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.request.help, message.id)
        } else {
            try {
                let requestJson = []
                // convert arg to string
                const argString = args.toString().replace(/,/g, ' ')
                // read file and write
                await createFile(filePath.json.request)
                const data = await fs.readFile(filePath.json.request, 'utf8')
                // jika tidak kosong
                if (data) {
                    requestJson = JSON.parse(data)
                }
                requestJson.push({
                    request: argString,
                    sender: message.sender.id,
                    pushname: message.sender.pushname,
                    ingroup: message.chat.name,
                })

                const json = JSON.stringify(requestJson)
                await fs.writeFile(filePath.json.request, json, 'utf8')
                await client.reply(message.from, messageResponse.request.success, message.id)
            } catch (err) {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    report: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.report.help, message.id)
        } else {
            try {
                let reportJson = []
                // convert arg to string
                const argString = args.toString().replace(/,/g, ' ')
                // read file and write
                await createFile(filePath.json.report)
                const data = await fs.readFile(filePath.json.report, 'utf8')
                // jika tidak kosong
                if (data) {
                    reportJson = JSON.parse(data)
                }
                reportJson.push({
                    report: argString,
                    sender: message.sender.id,
                    pushname: message.sender.pushname,
                    ingroup: message.chat.name,
                })

                const json = JSON.stringify(reportJson)
                await fs.writeFile(filePath.json.report, json, 'utf8')
                await client.reply(message.from, messageResponse.report.success, message.id)
            } catch (err) {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    sticker: async (client, message, args) => {
        try {
            if (message.type === 'chat') {
                if (args.length === 0) {
                    // check if quote message
                    if (message.quotedMsg && message.quotedMsg.type === 'image') {
                        const mime = message.quotedMsg.mimetype
                        const mediaData = await decryptMedia(message.quotedMsg, stringValues.userAgent)
                        const dataUri = `data:${mime};base64,${mediaData.toString('base64')}`

                        await client.sendImageAsSticker(message.from, dataUri)
                        return
                    }

                    await client.reply(message.from, messageResponse.sticker.help, message.id)
                } else {
                    await client.sendStickerfromUrl(message.from, args[0])
                }
            } else if (message.type === 'image') {
                const mediaData = await decryptMedia(message, stringValues.userAgent)
                const imageBase64 = `data:${message.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(message.from, imageBase64)
            } else {
                await client.reply(message.from, messageResponse.sticker.help, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    stickerGif: async (client, message) => {
        try {
            if (message.type === 'chat') {
                if (message.quotedMsg && message.quotedMsg.type === 'video') {
                    const mediaData = await decryptMedia(message.quotedMsg)
                    const dataUri = `data:${message.quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendMp4AsSticker(message.from, dataUri)
                } else {
                    await client.reply(message.from, messageResponse.stickerGif.help, message.id)
                }
            } else if (message.type === 'video') {
                const mediaData = await decryptMedia(message)
                const dataUri = `data:${message.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendMp4AsSticker(message.from, dataUri)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.stickerGif.error, message.id)
            createErrorLog(message, err)
        }
    },

    meme: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/meme`
            const result = await axios.get(url)
            const json = result.data
            const caption = `*Post:* ${json["post_link"]}\n*Subreddit:* ${json["subreddit"]}\n*Title:* ${json["title"]}\n*Author:* ${json["author"]}`
            await client.sendImage(message.from, json.url, 'meme.jpg', caption)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    jadwalShalat: async (client, message, args) => {
        try {
            if (args.length === 0) {
                const url = `${stringValues.apiServer}/jadwal-sholat`
                const response = await axios.get(url)

                let result = '*List lokasi* \n'
                result += response.data['kota'].join('\n')
                await client.sendText(message.from, result)
            } else {
                const location = args[0]
                const url = `${stringValues.apiServer}/jadwal-sholat?kota=${location}`

                const response = await axios.get(url)
                const json = response.data
                let result = `*Tanggal hari ini ->* ${json["tanggal"]} \n`
                result += `*Imsyak*\t: ${json["imsyak"]}\n`
                result += `*Shubuh*\t: ${json["shubuh"]}\n`
                result += `*Terbit*\t: ${json["terbit"]}\n`
                result += `*Dhuha*\t: ${json["dhuha"]}\n`
                result += `*Dzuhur*\t: ${json["dzuhur"]}\n`
                result += `*Ashr*\t: ${json["ashr"]}\n`
                result += `*Magrib*\t: ${json["magrib"]}\n`
                result += `*Isya*\t\t: ${json["isya"]}`

                await client.sendText(message.from, result)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    quoteMaker: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.quoteMaker.help, message.id)
            } else {
                const result = await argExtractor.getWord1Word2(args)
                await client.reply(message.from, messageResponse.commonWait, message.id)

                // replace enter and white space
                const quotes = result.word1.replace(/ /g, '%20').replace(/\n/g, '%5Cn')
                const author = result.word2.replace(/ /g, '%20').replace(/\n/g, '%5Cn')
                const url = `${stringValues.apiServer}/quote-maker?author=${author}&quote=${quotes}`

                const response = await axios.get(url)
                await client.sendImage(message.from, response.data['result'], 'quotemaker.jpg', messageResponse.commonSuccess, message.id)
            }
        } catch (err) {
            if (err.name === 'WordExtractorError') {
                await client.reply(message.from, messageResponse.quoteMaker.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    ig: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.ig.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWait, message.id)
                const urlTarget = encodeURI(args[0])
                const url = `${stringValues.apiServer}/ig?url=${urlTarget}`

                const response = await axios.get(url)
                await client.sendFileFromUrl(message.from, response.data['url'], 'insta', messageResponse.commonSuccess, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    igStalk: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.igStalk.help, message.id)
            } else {
                const username = args[0]
                const url = `${stringValues.apiServer}/ig-profile?username=${username}`

                const response = await axios.get(url)
                const result = response.data
                const link = `https://www.instagram.com/${result['username']}/`
                const caption = `*Link*: ${link}\n*Name*: ${result['name']}\n*Bio*: ${result['biography']}\n*Followers:* ${result['follower']}\n*Following:* ${result['following']}\n*Private|Verified*: ${result['is_private']}|${result['is_verified']}\n*Posts Count*: ${result['posts']}`

                await client.sendImage(message.from, result['profile_picture'], 'profile.png', caption)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    fbVideo: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.fbVideo.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWait, message.id)
                const url = args[0]

                if (!checkFacebookLink((url))) {
                    await client.reply(message.from, messageResponse.commonError, message.id)
                    return
                }

                const apiUrl = `${stringValues.apiServer}/fb-video?url=${url}`
                const response = await axios.get(apiUrl)
                await client.sendFileFromUrl(message.from, response.data['url'], 'facebook.data', messageResponse.commonSuccess, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.fbVideo.error, message.id)
            createErrorLog(message, err)
        }
    },

    tiktok: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.tiktok.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWait, message.id)
                const url = encodeURI(args[0])
                const urlApi = `${stringValues.apiServer}/tiktok?url=${url}`
                const {data} = await axios.get(urlApi)
                let result = `*Title:* ${data.title}\n`
                result += `*Tanggal:* ${data.date}\n\n`
                result += data.description
                const downloads = data['downloads']
                const link = downloads[downloads.length - 1]

                await client.sendFileFromUrl(message.from, link, 'tiktok', result, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    ytAudio: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.ytAudio.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWait, message.id)
                const url = encodeURI(args[0])

                const response = await axios.get(`${stringValues.apiServer}/yt-audio?url=${url}`)
                const title = response.data.title
                const ext = response.data.ext
                // 50 mb
                if (youtubeSizeValidation(response.data, 50, messageResponse.ytAudio.error)) {
                    await client.sendFileFromUrl(
                        message.from,
                        response.data.url,
                        `${title}.${ext}`,
                        messageResponse.commonSuccess,
                        message.id,
                        {},
                        false,
                        false,
                        true
                    )
                }
            }
        } catch (err) {
            if (err.name === 'YoutubeError') {
                await client.reply(message.from, err.message, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    ytSearch: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.ytSearch.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWait, message.id)
                const keyword = encodeURI(args.join(' '))
                const url = `${stringValues.apiServer}/yt-search?search=${keyword}`

                const response = await axios.get(url)
                let caption = `*${response.data['title']}*\n\n`
                caption += `*Channel:* ${response.data['channel_title']}\n`
                caption += `*Duration:* ${response.data['duration']}\n`
                caption += `*Views:* ${response.data['views']}\n`
                caption += `*Link:* ${response.data['link']}\n\n`
                caption += response.data['description']

                await client.sendFileFromUrl(message.from, response.data['thumb'], 'thumb.png', caption, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    ytPlay: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.ytPlay.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWait, message.id)
                const keyword = encodeURI(args.join(' '))
                const url = `${stringValues.apiServer}/yt-search?search=${keyword}`

                const response = await axios.get(url)
                let caption = `*${response.data['title']}*\n\n`
                caption += `*Channel:* ${response.data['channel_title']}\n`
                caption += `*Duration:* ${response.data['duration']}\n`
                caption += `*Views:* ${response.data['views']}\n`
                caption += `*Link:* ${response.data['link']}\n\n`
                caption += response.data['description']

                await client.sendFileFromUrl(message.from, response.data['thumb'], 'thumb.png', caption, message.id,)
                await client.reply(message.from, messageResponse.ytPlay.wait, message.id)

                const urlAudio = `${stringValues.apiServer}/yt-audio?url=${response.data['link']}`
                const responseAudio = await axios.get(urlAudio)
                const title = responseAudio.data.title
                const ext = responseAudio.data.ext

                // 10 mb
                if (youtubeSizeValidation(responseAudio.data, 10, messageResponse.ytPlay.error)) {
                    await client.sendFileFromUrl(
                        message.from,
                        responseAudio.data.url,
                        `${title}.${ext}`,
                        messageResponse.commonSuccess,
                        message.id,
                        {},
                        false,
                        true)
                }
            }
        } catch (err) {
            if (err.name === 'YoutubeError') {
                await client.reply(message.from, err.message, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    ytVideo: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.ytVideo.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWait, message.id)
                const url = encodeURI(args[0])

                const response = await axios.get(`${stringValues.apiServer}/yt-video?url=${url}`)
                const title = response.data.title
                const ext = response.data.ext

                // 50 mb
                if (youtubeSizeValidation(response.data, 50, messageResponse.ytVideo.error)) {
                    await client.sendFile(message.from, response.data.url, `${title}.${ext}`, messageResponse.commonSuccess, message.id)
                }
            }
        } catch (err) {
            if (err.name === 'YoutubeError') {
                await client.reply(message.from, err.message, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    tugas: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.tugas.help, message.id)
            } else {
                // command add dan del
                const groupId = message.chat.groupMetadata.creation
                const command = args[0]
                const deskripsi = args.slice(1, args.length).toString().replace(/,/g, ' ')

                // create file
                await createFile(filePath.json.tugas)
                if (command === 'add' || command === 'del') {
                    if (deskripsi === '') {
                        await client.reply(message.from, messageResponse.tugas.noDescription, message.id)
                        return
                    }

                    const data = await fs.readFile(filePath.json.tugas, 'utf8')
                    let tugas = []
                    let tugasJson = []
                    let parentTugas = false // tugasJson

                    if (data) {
                        tugasJson = JSON.parse(data)
                        for (let i = 0; i < tugasJson.length; i++) {
                            if (tugasJson[i].id === groupId) {
                                tugas = tugasJson[i].tugas
                                parentTugas = true
                                break
                            }
                        }
                    }

                    // init index
                    let index = 1
                    // cek tugas jika kosong
                    if (tugas.length !== 0) {
                        // add
                        if (command === 'add') {
                            const lastTugas = tugas[tugas.length - 1]
                            index = lastTugas.id + 1
                        }

                        // delete
                        if (command === 'del') {
                            for (let i = 0; i < tugas.length; i++) {
                                // deskripsi bisa saja id untuk menghapus
                                // konversi ke string karena deskripsi string
                                if (tugas[i].id.toString() === deskripsi) {
                                    index = i
                                    break
                                }
                            }
                            tugas.splice(index, 1)
                        }
                    }

                    // add tugas jika tugas array kosong atau pun berisi
                    if (command === 'add') {
                        tugas.push({
                            id: index,
                            deskripsi,
                        })

                        // jika tidak punya parent tugas maka push
                        if (!parentTugas) {
                            tugasJson.push({
                                id: groupId,
                                tugas,
                            })
                        }
                    }

                    const json = JSON.stringify(tugasJson)
                    await fs.writeFile(filePath.json.tugas, json)
                    await client.reply(message.from, messageResponse.tugas.success, message.id)
                }

                if (command === 'list') {
                    const groupName = message.chat.contact.name

                    const data = await fs.readFile(filePath.json.tugas, 'utf8')
                    let tugasList = []
                    let tugasJson = []
                    let result = `Nih tugas tugas yang di grup *${groupName}*\n`

                    if (data) {
                        tugasJson = JSON.parse(data)
                        for (let i = 0; i < tugasJson.length; i++) {
                            if (tugasJson[i].id === groupId) {
                                tugasList = tugasJson[i].tugas
                            }
                        }

                        result += 'ID\tDeskripsi'
                        for (let i = 0; i < tugasList.length; i++) {
                            result += `\n${tugasList[i].id} - ${tugasList[i].deskripsi}`
                        }
                    }
                    await client.reply(message.from, result, message.id)
                }
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    wiki: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.wiki.help, message.id)
            } else {
                const keyword = args.join(' ')
                const url = `${stringValues.apiServer}/wiki?keyword=${keyword}`
                const {data} = await axios.get(url)
                let result = `*${data.title}*\n\n`
                result += data.result.join('\n\n')

                await client.reply(message.from, result, message.id)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await client.reply(message.from, messageResponse.notFoundSearchResult, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    translate: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.translate.help, message.id)
            } else {
                // conversi array ke string, dengan join =
                // karena kalau toString(), ntar ada kalimat berkoma akan di replace juga
                const word = args.join(' ')
                const url = `${stringValues.apiServer}/translate?text=${encodeURI(word)}`

                const response = await axios.get(url)
                await client.reply(message.from, response.data['text'], message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    husbu: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/anime-pic?genre=husbu`
            const response = await axios.get(url)
            await client.sendFileFromUrl(message.from, response.data['url'], 'husbu.png', messageResponse.commonSuccess, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    waifu: async (client, message) => {
        try {
            const typeList = ['neko', 'foxgirl']
            const type = typeList[Math.floor(Math.random() * 2)]
            const url = `${stringValues.apiServer}/anime-pic?genre=${type}`
            const response = await axios.get(url)
            await client.sendFileFromUrl(message.from, response.data['url'], 'waifu.png', messageResponse.commonSuccess, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    waifu2: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/anime-pic?genre=randomsfw`
            const response = await axios.get(url)
            await client.sendFile(message.from, response.data['url'], 'waifu2.png', messageResponse.commonSuccess, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    waifu3: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/anime-pic?genre=lolisfw`
            const response = await axios.get(url)
            await client.sendFile(message.from, response.data['url'], 'waifu3.png', messageResponse.commonSuccess, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    wallpaper: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/anime-pic?genre=wallpapersfw`
            const response = await axios.get(url)
            await client.sendFile(message.from, response.data['url'], 'wallpaper.png', messageResponse.commonSuccess, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    kabupatenKota: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.kabupatenKota.help, message.id)
            } else {
                const provinsi = args.join(' ')
                const url = `${stringValues.apiServer}/kabupaten-kota?provinsi=${provinsi}`

                const response = await axios.get(url)
                const json = response.data
                let result = `*Provinsi:* ${json['nama']}\n`
                result += '*Kabupaten Kota:*'

                for (let i = 0; i < json['kabupaten_kota'].length; i++) {
                    result += `\n- ${json['kabupaten_kota'][i]}`
                }
                await client.reply(message.from, result, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    cuaca: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.cuaca.help, message.id)
            } else {
                const kabupatenKota = args.toString().replace(/,/g, ' ')
                const url = `${stringValues.apiServer}/cuaca?kabupaten=${kabupatenKota}&day=2`

                const response = await axios.get(url)
                const json = response.data
                let result = `*${json['nama1']}*\n`
                result += `*${json['nama2']}*\n`

                for (let i = 0; i < json['data'].length; i++) {
                    result += `==> ${json['data'][i]['waktu']}\n`
                    result += `Kelembaban: ${json['data'][i]['kelembaban']}\n`
                    result += `Temperatur: ${json['data'][i]['temperatur']['celsius']}\n`
                    result += `Cuaca: ${json['data'][i]['cuaca']}\n\n`
                }

                result += 'by BMKG'

                await client.reply(message.from, result, message.id)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await client.reply(message.from, messageResponse.cuaca.error, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    infoGempa: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/info-gempa`
            const response = await axios.get(url)
            const json = response.data
            let result = `*Tanggal*: ${json['tanggal']}\n`
            result += `*Jam*: ${json['jam']}\n`
            result += `*Kedalaman.* ${json['kedalaman']}\n`
            result += `*Mag.* ${json['magnitude']}\n`
            result += `----------\n`
            result += `> ${json['wilayah1']}\n`
            result += `> ${json['wilayah2']}\n`
            result += `> ${json['wilayah3']}\n`
            result += `> ${json['wilayah4']}\n`
            result += `> ${json['wilayah5']}\n`
            result += `----------\n`
            result += `${json['potensi']}\n`
            result += 'by BMKG'

            await client.sendFileFromUrl(message.from, json['gif'], 'bmkg.gif', result, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    covid: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/covid-indonesia`
            const response = await axios.get(url)
            let result = '*Data Covid Indonesia*\n'
            result += `Positif: ${response.data['positif']}\n`
            result += `Dirawat: ${response.data['dirawat']}\n`
            result += `Sembuh: ${response.data['sembuh']}\n`
            result += `Meninggal: ${response.data['meninggal']}\n\n`
            result += `Last update: ${response.data['last_update']}\n`

            await client.reply(message.from, result, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    bosan: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/bosan`
            const response = await axios.get(url)
            const json = response.data

            let result = `${json["activity"]}\n`
            result += `*Type:* ${json["type"]}`

            await client.reply(message.from, result, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    quote: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/quote?type=random`
            const response = await axios.get(url)
            let result = `*EN:* ${response.data['text_en']}\n\n`
            result += `*ID:* ${response.data['text_id']}\n\n`
            result += `*Author:* ${response.data['author']}\n`

            await client.reply(message.from, result, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    quote2: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/quote?type=agamis`
            const response = await axios.get(url)
            const result = response.data['text_id']

            await client.reply(message.from, result, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    kanyeQuote: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/quote?type=kanye`
            const response = await axios.get(url)
            let result = `*EN:* ${response.data['text_en']}\n\n`
            result += `*ID:* ${response.data['text_id']}\n\n`
            result += `*Author:* ${response.data['author']}\n`

            await client.reply(message.from, result, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    speech: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.speech.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWait, message.id)

                const lang = args[0]
                const word = args.slice(1, args.length).toString().replace(/,/g, ' ')
                const baseLang = ['en', 'kr', 'jp', 'es', 'fr', 'br', 'cn', 'nl', 'ar', 'it', 'de']
                const url = `${stringValues.apiServer}/speech?lang=${lang}&text=${encodeURI(word)}`

                if (baseLang.includes(lang)) {
                    const response = await axios.get(url, {responseType: 'arraybuffer'})
                    const buffer = Buffer.from(response.data, 'binary').toString('base64')
                    const dataUrl = `data:audio/mp3;base64,${buffer}`

                    await client.sendPtt(message.from, dataUrl, message.id)
                } else {
                    await client.reply(message.from, messageResponse.speech.help, message.id)
                }
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    artiNama: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.artiNama.help, message.id)
            } else {
                const nama = args.join(' ')
                const url = `${stringValues.apiServer}/arti-nama?nama=${nama}`

                const response = await axios.get(url)
                let result = `*Nama:* ${nama}\n\n`
                result += `*Arti:* ${response.data['arti']}\n\n`
                result += response.data['deskripsi']

                await client.reply(message.from, result, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    pasangan: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.pasangan.help, message.id)
            } else {
                const extract = await argExtractor.getWord1Word2(args)
                const nama1 = extract.word1
                const nama2 = extract.word2
                const url = `${stringValues.apiServer}/pasangan?nama1=${nama1}&nama2=${nama2}`

                const response = await axios.get(url)
                let result = `*Nama:* ${response.data['nama_anda']}\n`
                result += `*Doi:* ${response.data['nama_pasangan']}\n\n`
                result += `*Sisi Positif Anda:* ${response.data['sisi_positif_anda']}\n\n`
                result += `*Sisi Negatif Anda:* ${response.data['sisi_negatif_anda']}\n\n`
                result += response.data['deskripsi']

                await client.reply(message.from, result, message.id)
            }
        } catch (err) {
            if (err.name === 'WordExtractorError') {
                await client.reply(message.from, messageResponse.pasangan.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    penyakit: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.penyakit.help, message.id)
            } else {
                const tanggal = args[0]
                const url = `${stringValues.apiServer}/penyakit?tanggal=${tanggal}`

                const response = await axios.get(url)
                let result = `*Tanggal:* ${tanggal}\n`
                result += `*Analisa:* \n${response.data['analisa'].join('\n')}\n\n`
                result += `*Deskripsi:* ${response.data['deskripsi']}\n\n`
                result += `*Penyakit:* ${response.data['penyakit'].join('\n')}`

                await client.reply(message.from, result, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    pekerjaan: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.pekerjaan.help, message.id)
            } else {
                const tanggal = args[0]
                const url = `${stringValues.apiServer}/pekerjaan?tanggal=${tanggal}`

                const response = await axios.get(url)
                let result = `*Hari Lahir:* ${response.data['hari_lahir']}\n\n`
                result += response.data['deskripsi']

                await client.reply(message.from, result, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    whatAnime: async (client, message, args) => {
        const response = await (async () => {
            try {
                if (args.length === 0) { // yang dikirim via quote message atau gambar tanpa argument
                    let mediaData
                    if (message.type === 'image') { // yang dikirim gambar
                        mediaData = await decryptMedia(message, stringValues.userAgent)
                    } else if (message.quotedMsg && message.quotedMsg.type === 'image') { // quote message yang dikirim gambar
                        mediaData = await decryptMedia(message.quotedMsg, stringValues.userAgent)
                    } else {
                        await client.reply(message.from, messageResponse.whatAnime.help, message.id)
                        return
                    }

                    await client.reply(message.from, messageResponse.commonWait, message.id)
                    const url = `${stringValues.apiServer}/what-anime?limit=1`
                    return await axios({
                        url,
                        method: 'post',
                        headers: {'Content-Type': 'application/json'},
                        data: {image: mediaData.toString('base64')}
                    })
                } else { // yang dikirim via url
                    await client.reply(message.from, messageResponse.commonWait, message.id)
                    const url = `${stringValues.apiServer}/what-anime?url=${args[0]}&limit=1`
                    return await axios({
                        url,
                        method: 'get'
                    });
                }
            } catch (err) {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        })()

        if (response) {
            const responseData = response.data[0]
            let result = `*${responseData['title']}*\n\n`
            result += `*Season:* ${responseData['season']}\n`
            result += `*Score:* ${responseData['score']}\n`
            result += `*Genre:* ${responseData['genre']}\n`
            result += `*Adult:* ${responseData['adult']}\n`
            result += `*MyAnimeList:* ${responseData['url']}\n\n`
            result += (() => {
                if (responseData['similarity'] <= 8) {
                    return messageResponse.whatAnime.lowSimilarity
                } else {
                    return messageResponse.whatAnime.highSimilarity
                }
            })()

            await client.sendFileFromUrl(message.from, responseData['thumb'], 'thumb.jpg', result, message.id)
        }
    },

    drakorasia: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.drakorasia.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWaitTime, message.id)

                const keyword = args.join(' ')
                const url = `${stringValues.apiServer}/drakorasia?search=${keyword}`

                const response = await axios.get(url)
                let result = `*${response.data['title']}*\n\n`
                result += `*Duration:* ${response.data['duration']}\n`
                result += `*Episode:* ${response.data['episode']}\n`
                result += `*Network:* ${response.data['network']}\n`
                result += `*Year:* ${response.data['year']}\n`
                result += `*Genre:* ${response.data['genre']}\n`
                result += `*Caster:* ${response.data['casters']}\n\n`

                result += `${response.data['synopsis']}\n`
                for (let i = 0; i < response.data['episodes'].length; i++) {
                    result += `\n*${response.data['episodes'][i]['episode']}*\n`

                    for (let j = 0; j < response.data['episodes'][i]['downloads'].length; j++) {
                        const downloads = response.data['episodes'][i]['downloads'][j]
                        const resolution = downloads['resolution']
                        const downloadLink = downloads['download_link'][0]

                        result += `=> *${resolution}*\n`
                        if (downloadLink) {
                            const link = downloads['download_link'][0]['link']
                            const shortLink = new Promise((resolve, rejects) => {
                                tinyurl.shorten(link, (res, err) => {
                                    if (err) rejects(err)
                                    resolve(res)
                                })
                            })
                            result += `${await shortLink}\n`
                        } else {
                            result += 'Belum ada link\n'
                        }
                    }
                }

                await client.sendFileFromUrl(message.from, response.data['thumb'], 'thumb.jpg', result, message.id)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await client.reply(message.from, messageResponse.notFoundSearchResult, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    lirik: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.lirik.help, message.id)
            } else {
                const keyword = args.join(' ')
                const url = `${stringValues.apiServer}/lirik?search=${encodeURI(keyword)}`

                const response = await axios.get(url)
                let result = `*${response.data['title']}*\n\n`
                for (let i = 0; i < response.data['lyric'].length; i++) {
                    if (i === (response.data['lyric'].length - 1)) {
                        result += response.data['lyric'][i]
                    } else {
                        result += `${response.data['lyric'][i]}\n\n`
                    }
                }

                await client.reply(message.from, result, message.id)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await client.reply(message.from, messageResponse.notFoundSearchResult, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    shortLink: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.shortLink.help, message.id)
            } else {
                const url = args[0]
                const result = await tinyurl.shorten(url)
                await client.reply(message.from, result, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    suit: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.suit.help, message.id)
        } else {
            const choices = ['batu', 'gunting', 'kertas']
            const choice1 = args[0]
            const choice2 = choices[Math.floor(Math.random() * 3)]

            if (choices.includes(choice1)) {
                let result = `*User:* ${choice1}\n`
                result += `*Inori:* ${choice2}\n\n`
                if (choice1 === 'batu') {
                    if (choice2 === 'gunting') result += messageResponse.suit.lose
                    else if (choice2 === 'kertas') result += messageResponse.suit.win
                    else result += messageResponse.suit.tie
                }

                if (choice1 === 'gunting') {
                    if (choice2 === 'kertas') result += messageResponse.suit.lose
                    else if (choice2 === 'batu') result += messageResponse.suit.win
                    else result += messageResponse.suit.tie
                }

                if (choice1 === 'kertas') {
                    if (choice2 === 'batu') result += messageResponse.suit.lose
                    else if (choice2 === 'gunting') result += messageResponse.suit.win
                    else result += messageResponse.suit.tie
                }

                await client.reply(message.from, result, message.id)
            } else {
                await client.reply(message.from, messageResponse.suit.help, message.id)
            }
        }
    },

    manga: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.manga.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWaitTime, message.id)
                const keyword = encodeURI(args.join(' '))
                const url = `${stringValues.apiServer}/manga?keyword=${keyword}`

                const response = await axios.get(url)
                let result = `*${response.data['title']}*\n\n`
                result += `*Name:* ${response.data['name']}\n`
                result += `*Type:* ${response.data['type']}\n`
                result += `*Author:* ${response.data['author']}\n`
                result += `*Status:* ${response.data['status']}\n`
                result += `*Rating:* ${response.data['rating']}\n`
                result += `*Released:* ${response.data['released']}\n`
                result += `*Genre:* ${response.data['genre']}\n\n`
                result += '*Description:*\n'
                result += `${response.data['description'][0]}\n\n`
                result += '*Downloads:*\n'

                for (let i = 0; i < response.data['downloads'].length; i++) {
                    const downloads = response.data['downloads'][i]
                    result += `*Date:* ${downloads['date']}\n`
                    result += `*Title:* ${downloads['title']}\n`
                    result += `*Link:* ${downloads['link']}\n\n`
                }
                result += response.data['note']
                await client.sendFileFromUrl(message.from, response.data['thumb'], 'thumb.jpg', result, message.id)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await client.reply(message.from, messageResponse.notFoundSearchResult, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    movie2: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.movie2.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWaitTime, message.id)
                const keyword = encodeURI(args.join(' '))
                const url = `${stringValues.apiServer}/movie2?search=${keyword}`

                const response = await axios.get(url)
                let result = `*${response.data['title']}*\n\n`
                result += `*Score:* ${response.data['score']}\n`
                result += `*Quality:* ${response.data['quality']}\n`
                result += `*Duration:* ${response.data['duration']}\n`
                result += `*Genre:* ${response.data['genre']}\n`
                result += `*Trailer:* ${response.data['trailer']}\n\n`
                result += '*Synopsis:*\n'
                result += `${response.data['synopsis']}\n\n`
                result += '*Downloads:*\n'

                for (let i = 0; i < response.data['downloads'].length; i++) {
                    const downloads = response.data['downloads'][i]
                    result += `*Server:* ${downloads['server']}\n`
                    result += `*Desc:* ${downloads['description']}\n`
                    result += `*Size:* ${downloads['size']}\n`
                    result += `*Link:* ${downloads['link']}\n`

                    if (i !== (response.data['downloads'].length - 1)) result += '\n'
                }

                await client.sendFileFromUrl(message.from, response.data['thumb'], 'thumb.jpg', result, message.id)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await client.reply(message.from, messageResponse.notFoundSearchResult, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    movie: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.movie.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWaitTime, message.id)
                const keyword = args.join(' ')
                const url = `${stringValues.apiServer}/movie?search=${encodeURI(keyword)}`

                const response = await axios.get(url)
                let result = `*${response.data['title']}*\n\n`
                result += `*Genre:* ${response.data['genre']}\n`
                result += `*IMDB:* ${response.data['imdb']}\n`
                result += `*Country:* ${response.data['country']}\n`
                result += `*Quality:* ${response.data['quality']}\n`
                result += `*Duration:* ${response.data['duration']}\n`
                result += `*Actor:* ${response.data['actor']}\n\n`
                result += `*Synopsis*\n`
                result += `${response.data['synopsis']}\n\n`
                result += `*Downloads*\n`

                for (let i = 0; i < response.data['downloads'].length; i++) {
                    result += `*Provider:* ${response.data['downloads'][i]['provider']}\n`
                    result += `*Res:* ${response.data['downloads'][i]['resolution']}\n`

                    for (let j = 0; j < response.data['downloads'][i]['download_link'].length; j++) {
                        if (response.data['downloads'][i]['download_link'][j]['link']) {
                            const title = response.data['downloads'][i]['download_link'][j]['title']
                            const link = response.data['downloads'][i]['download_link'][j]['link']
                            const shortLink = new Promise((resolve, rejects) => {
                                tinyurl.shorten(link, (res, err) => {
                                    if (err) rejects(err)
                                    resolve(res)
                                })
                            })

                            result += `${title}\n`
                            result += `${await shortLink}\n`
                        }
                    }

                    // tidak ada enter di baris akhir
                    if (i !== (response.data['downloads'].length - 1)) {
                        result += '\n'
                    }
                }

                await client.sendFileFromUrl(message.from, response.data['thumb'], 'thumb.jpg', result, message.id)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await client.reply(message.from, messageResponse.notFoundSearchResult, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    kusonime: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.kusonime.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWaitTime, message.id)

                // mengatasi jika ada yang menginputkan , (koma)
                const keyword = args.join('=').replace(/=/g, ' ')
                const url = `${stringValues.apiServer}/kusonime?search=${keyword}`

                const response = await axios.get(url)
                let result = `*${response.data['title']}*\n\n`
                result += `*Season:* ${response.data['season']}\n`
                result += `*Score:* ${response.data['score']}\n`
                result += `*Genre:* ${response.data['genre']}\n\n`
                result += '*Description:*\n'
                result += `${response.data['description']}\n\n`
                result += '*Download:*\n'

                for (let i = 0; i < response.data['download'].length; i++) {
                    result += `*==> ${response.data['download'][i]['resolution']}*\n`
                    result += `${response.data['download'][i]['download_list'][0]['download_link']}\n`
                }

                await client.sendFileFromUrl(message.from, response.data['thumbs'], 'thumb.png', result, message.id)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await client.reply(message.from, messageResponse.notFoundSearchResult, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    neonime: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.nenonime.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonWaitTime, message.id)
                const keyword = encodeURI(args.join(' '))
                const url = `${stringValues.apiServer}/neonime?search=${keyword}`
                const {data} = await axios.get(url)
                let result = `*${data['title']}*\n\n`
                result += `*Date:* ${data['date']}\n`
                result += `*Season:* ${data['season']}\n`
                result += `*Episode:* ${data['episode']}\n`
                result += `*Genre:* ${data['genre']}\n\n`
                result += `*Description:*\n`
                result += `${data['description']}\n\n`

                result += `*Downloads MP4:*\n`
                for (let i = 0; i < data['download_mp4'].length; i++) {
                    const mp4 = data['download_mp4'][i]
                    result += `*Resolution*: ${mp4['resolution']}\n`
                    for (let j = 0; j < mp4['server'].length; j++) {
                        result += `*Server*: ${mp4['server'][j]['name']}\n`
                        result += `*Link*: ${mp4['server'][j]['link']}\n\n`
                    }
                }

                result += `\n*Downloads MKV:*\n`
                for (let i = 0; i < data['download_mkv'].length; i++) {
                    const mkv = data['download_mkv'][i]
                    result += `*Resolution*: ${mkv['resolution']}\n`
                    for (let j = 0; j < mkv['server'].length; j++) {
                        result += `*Server*: ${mkv['server'][j]['name']}\n`
                        result += `*Link*: ${mkv['server'][j]['link']}\n\n`
                    }
                }

                await client.sendFileFromUrl(message.from, data['thumb'], 'thumb.jpg', result, message.id)
            }
        } catch (err) {
            if (err.response.status === 404) {
                await client.reply(message.from, messageResponse.notFoundSearchResult, message.id)
            } else {
                await client.reply(message.from, messageResponse.commonError, message.id)
                createErrorLog(message, err)
            }
        }
    },

    ///////////////////////////////////////////////   KITAB    ///////////////////////////////////////////////
    quran: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/quran`
            const response = await axios.get(url)
            const json = response.data
            let result = `*Surat:* ${json['surat']}\n`
            result += `*Asma:* ${json['asma']}\n`
            result += `*Surat ke:* ${json['surat_ke']}\n`
            result += `*Jumlah ayat:* ${json['jumlah_ayat']}\n`
            result += `*Rukuk:* ${json['rukuk']}\n`
            result += `*Arti:* ${json['arti']}\n`
            result += `*Tipe:* ${json['tipe']}\n\n`
            result += `*Keterangan:*\n${json['keterangan']
                .replace(/<i>/g, '_')
                .replace(/<\/i>/g, '_')
                .replace(/<br>/g, '\\n')}\`}\n\n`
            result += `*Ayat ke:* ${json['ayat']['ayat_ke']}\n`
            result += `${json['ayat']['teks_ar']}\n`
            result += json['ayat']['teks_id']

            await client.reply(message.from, result, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    surat: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.surat.help, message.id)
            } else {
                const noSurat = args[0]
                let url = `${stringValues.apiServer}/surat?surat=${noSurat}`
                if (args[1]) { // jika ada no ayat
                    const noAyat = args[1]
                    url = `${stringValues.apiServer}/surat?surat=${noSurat}&ayat=${noAyat}`
                }

                const response = await axios.get(url)
                const json = response.data
                let result = `*Surat:* ${json['surat']}\n`
                result += `*Asma:* ${json['asma']}\n`
                result += `*Surat ke:* ${json['surat_ke']}\n`
                result += `*Jumlah ayat:* ${json['jumlah_ayat']}\n`
                result += `*Rukuk:* ${json['rukuk']}\n`
                result += `*Arti:* ${json['arti']}\n`
                result += `*Tipe:* ${json['tipe']}\n\n`
                result += `*Keterangan:*\n${json['keterangan']
                    .replace(/<i>/g, '_')
                    .replace(/<\/i>/g, '_')
                    .replace(/<br>/g, '\n')}`

                if (json['ayat']) {
                    result += `\n\n*Ayat ke:* ${json['ayat']['ayat_ke']}\n`
                    result += `${json['ayat']['teks_ar']}\n`
                    result += json['ayat']['teks_id']
                }

                await client.reply(message.from, result, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    alkitab: async (client, message, args) => {
        try {
            if (args.length === 0 || args.length === 1) {
                await client.reply(message.from, messageResponse.alkitab.help, message.id)
            } else {
                const nameUser = args[0]
                const chapterUser = args[1].split(':')[0]
                const numberUser = encodeURI(args[1].split(':')[1])
                const url = `${stringValues.apiServer}/alkitab?name=${nameUser}&chapter=${chapterUser}&number=${numberUser}`

                const response = await axios.get(url)
                const name = response.data['name']
                const chapter = response.data['chapter']

                let result = ''
                for (let i = 0; i < response.data['description'].length; i++) {
                    const number = response.data['description'][i]['number']
                    const text = response.data['description'][i]['text']
                    result += `*${name} ${chapter}:${number}*\n`
                    result += `${text}\n`

                    if (i !== (response.data['description'].length - 1)) {
                        result += '\n'
                    }
                }

                await client.reply(message.from, result, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },
    ///////////////////////////////////////////////   KERANG AJAIB    ///////////////////////////////////////////////
    apakah: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.apakah.help, message.id)
        } else {
            const list = stringValues.kerangAjaibResponse.apakah
            const random = Math.floor(Math.random() * list.length)

            // jika tidak ada tanda ? di pertanyaan, maka tambahkan
            const pertanyaan = (args.join(' ').includes('?')
                ? args.join(' ')
                : args.join(' ').concat(' ?'))

            // cek jika pertanyaan mengandung mention
            let result = `*Pertanyaan:* Apakah ${pertanyaan}\n\n`
            result += `*Jawaban:* ${list[random]}`
            if (pertanyaan.includes('@')) {
                await client.sendTextWithMentions(message.from, result)
            } else {
                await client.sendText(message.from, result)
            }
        }
    },

    kapankah: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.kapankah.help, message.id)
        } else {
            const list = stringValues.kerangAjaibResponse.kapankah
            const random = Math.floor(Math.random() * list.length)

            // jika tidak ada tanda ? di pertanyaan, maka tambahkan
            const pertanyaan = (args.join(' ').includes('?')
                ? args.join(' ')
                : args.join(' ').concat(' ?'))
            let result = `*Pertanyaan:* Kapankah ${pertanyaan}\n\n`
            result += `*Jawaban:* ${list[random]}`

            if (pertanyaan.includes('@')) {
                await client.sendTextWithMentions(message.from, result)
            } else {
                await client.sendText(message.from, result)
            }
        }
    },

    siapakah: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.apakah.help, message.id)
        } else {
            const list = stringValues.kerangAjaibResponse.siapakah
            const randomJawaban = Math.floor(Math.random() * list.length)

            await client.getGroupMembers(message.chatId)
                .then(async (results) => {
                    let mention1, mention2
                    do {
                        const randomMention1 = Math.floor(Math.random() * results.length)
                        const randomMention2 = Math.floor(Math.random() * results.length)

                        mention1 = `@${results[randomMention1].id.split('@')[0]}`
                        mention2 = `@${results[randomMention2].id.split('@')[0]}`
                        // jika sama random ulang
                    } while (mention1 === mention2)

                    // jika tidak ada tanda ? di pertanyaan, maka tambahkan
                    const pertanyaan = (args.join(' ').includes('?')
                        ? args.join(' ')
                        : args.join(' ').concat(' ?'))
                    let result = `*Pertanyaan:* Siapakah ${pertanyaan}\n\n`
                    result += `*Jawaban:* ${list[randomJawaban].replace(/#/, mention1).replace(/#/, mention2)}`

                    // jika ada mention
                    if (list[randomJawaban].includes('#')) {
                        await client.sendTextWithMentions(message.from, result)
                    } else {
                        await client.sendText(message.from, result)
                    }
                })
        }
    },

    //////////////////////////////////////////////////   GROUP    //////////////////////////////////////////////////
    admin: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.admin.help, message.id)
            } else {
                const groupId = message.chatId
                const contact = args[0].replace('@', '').concat('@c.us')
                await client.promoteParticipant(groupId, contact)
                await client.reply(message.from, messageResponse.admin.success, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    adminAll: async (client, message) => {
        try {
            const groupId = message.chatId
            const members = await client.getGroupMembersId(groupId)
            const admins = await client.getGroupAdmins(groupId)

            // filter yang bukan admin
            const clean = members
                .filter((el, i) => el !== admins[i])
                .filter((el) => el !== message.author)

            for (let i = 0; i < clean.length; i++) {
                await client.promoteParticipant(groupId, clean[i])
            }
            await client.reply(message.from, messageResponse.adminAll.success, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    user: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.user.help, message.id)
            } else {
                const groupId = message.chatId
                const contact = args[0].replace('@', '').concat('@c.us')
                await client.demoteParticipant(groupId, contact)
                await client.reply(message.from, messageResponse.user.success, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    userAll: async (client, message) => {
        try {
            const hostNumber = await client.getHostNumber()
            const groupId = message.chatId
            const admins = await client.getGroupAdmins(groupId)
            // filter agar bot tidak kena imbas
            const clean = admins
                .filter((el) => el !== hostNumber.concat('@c.us'))
                .filter((el) => el !== message.author)

            for (let i = 0; i < clean.length; i++) {
                await client.demoteParticipant(groupId, clean[i])
            }
            await client.reply(message.from, messageResponse.userAll.success, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    add: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.add.help, message.id)
            } else {
                let number = args.join('').replace(/[^0-9]/g, '') // remove special character
                if (number.startsWith('08')) {
                    number = number.replace(/08/, '628')
                }
                number = number.concat('@c.us')

                await client.addParticipant(message.chatId, number)
                await client.reply(message.from, messageResponse.add.success, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    kick: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.kick.help, message.id)
            } else {
                const number = args[0].replace(/@/g, '').concat('@c.us')
                await client.removeParticipant(message.chatId, number)
                await client.reply(message.from, messageResponse.kick.success, message.id)
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    mentionAll: async (client, message) => {
        try {
            const results = await client.getGroupMembers(message.chatId)
            let numbers = ''
            for (let i = 0; i < results.length; i++) {
                numbers += `@${results[i].id.split('@')[0]} `
            }
            await client.sendTextWithMentions(message.from, numbers)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    linkGroup: async (client, message) => {
        try {
            const result = await client.getGroupInviteLink(message.chatId)
            await client.reply(message.from, result, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },
    //////////////////////////////////////////////////   NSFW    //////////////////////////////////////////////////
    nsfw: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.nsfw.help, message.id)
            } else {
                const groupId = message.chat.groupMetadata.creation
                const option = stringValues.switch.list
                let messageResponseTemp = ''

                if (option.includes(args[0])) {
                    let nsfwJson = []
                    let nsfwTemp = {}

                    // create file if not exist
                    await createFile(filePath.json.nsfw)
                    const data = await fs.readFile(filePath.json.nsfw, 'utf8')
                    if (data) {
                        nsfwJson = JSON.parse(data)
                        for (let i = 0; i < nsfwJson.length; i++) {
                            if (nsfwJson[i].groupId === groupId) {
                                nsfwTemp = nsfwJson[i]
                                break
                            }
                        }
                    }

                    // check if nfswTemp null
                    if (nsfwTemp.groupId) {
                        nsfwTemp.option = args[0]
                    } else {
                        nsfwJson.push({
                            'groupId': groupId,
                            'option': args[0]
                        })
                    }
                    messageResponseTemp = (args[0] === stringValues.switch.on) ? messageResponse.nsfw.on : messageResponse.nsfw.off

                    const json = JSON.stringify(nsfwJson)
                    await fs.writeFile(filePath.json.nsfw, json)
                    await client.reply(message.from, messageResponseTemp, message.id)
                } else {
                    await client.reply(message.from, messageResponse.nsfw.help, message.id)
                }
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    lewd: async (client, message, args) => {
        try {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.lewd.help, message.id)
            } else {
                const genre = args.toString().replace(/,/g, ' ')
                const genreList = [
                    'ass', 'bdsm', 'blowjob', 'cum',
                    'doujin', 'feet', 'femdom', 'glasses', 'hentai', 'loli',
                    'netorare', 'maid', 'masturbation', 'orgy', 'panties',
                    'pussy', 'school', 'tentacles', 'thighs', 'uglybastard',
                    'uniform', 'yaoi', 'yuri', 'wallpaper'
                ]

                if (genreList.includes(genre)) {
                    let temp = ''
                    if (genre === 'wallpaper') temp = 'wallpapernsfw'
                    else temp = genre
                    const url = `${stringValues.apiServer}/anime-pic?genre=${temp}`

                    const response = await axios.get(url)
                    await client.sendFile(message.from, response.data['url'], 'lewd.png', messageResponse.commonSuccess, message.id)
                } else {
                    await client.reply(message.from, messageResponse.lewd.help, message.id)
                }
            }
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    lewd2: async (client, message) => {
        try {
            const url = `${stringValues.apiServer}/anime-pic?genre=randomnsfw`
            const response = await axios.get(url)
            await client.sendFile(message.from, response.data['url'], 'lewd2.png', messageResponse.commonSuccess, message.id)
        } catch (err) {
            await client.reply(message.from, messageResponse.commonError, message.id)
            createErrorLog(message, err)
        }
    },

    //////////////////////////////////////////////////   UTILITY    //////////////////////////////////////////////////
    delete: async (client, message) => {
        if (message.quotedMsgObj) {
            await client.deleteMessage(message.quotedMsgObj.from, message.quotedMsgObj.id)
        } else {
            await client.reply(message.from, messageResponse.delete.help, message.id)
        }
    }
}

module.exports = functionResponse
