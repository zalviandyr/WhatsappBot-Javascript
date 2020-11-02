const {decryptMedia} = require('@open-wa/wa-decrypt')
const userInstagram = require('user-instagram')
const instagramDownload = require('@juliendu11/instagram-downloader')
const fbVideos = require('fbvideos')
const ytdl = require('ytdl-core')
const fetch = require('node-fetch')
const yaml = require('js-yaml')
const fs = require('fs')
const InstaDp = require('instadp')
const akaneko = require('akaneko')
const translate = require('@k3rn31p4nic/google-translate-api')
const brainly = require('brainly-scraper')

const insta = new InstaDp()

// my library
const messageResponse = require('./messageResponse')

// config
const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))

const functionResponse = {
    about: async (client, message) => {
        fs.readFile(`${config.path.media}/about.jpg`, async (_, data) => {
            const dataUrl = `data:image/jpeg;base64,${data.toString('base64')}`
            await client.reply(message.from, messageResponse.about, message.id)
                .then(async () => {
                    await client.sendImageAsSticker(message.from, dataUrl)
                })
        })
    },

    request: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(
                message.from,
                messageResponse.request.help,
                message.id,
            )
        } else {
            let requestJson = []
            // convert arg to string
            const argString = args.toString().replace(/,/g, ' ')
            // read file
            fs.readFile(
                `${config.path.json}/request.json`,
                'utf8',
                (_, data) => {
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
                    fs.writeFile(
                        `${config.path.json}/request.json`,
                        json,
                        'utf8',
                        async (err) => {
                            if (err) {
                                await client.reply(message.from, messageResponse.request.error, message.id)
                            } else {
                                await client.reply(message.from, messageResponse.request.success, message.id)
                            }
                        },
                    )
                },
            )
        }
    },

    sticker: async (client, message, args) => {
        if (message.type === 'chat') {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.sticker.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.sticker.wait, message.id)
                    .then(async () => {
                        await client
                            .sendStickerfromUrl(message.from, args[0])
                            .catch(async () => {
                                await client.reply(message.from, messageResponse.sticker.error, message.id)
                            })
                    })
            }
        } else if (message.isMedia && message.type === 'image') {
            await client.reply(message.from, messageResponse.sticker.wait, message.id)
                .then(async () => {
                    const mediaData = await decryptMedia(message, config.userAgent)
                    if (mediaData) {
                        const imageBase64 = `data:${message.mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(message.from, imageBase64)
                    } else {
                        await client.reply(message.from, messageResponse.sticker.error, message.id)
                    }
                })
        }
    },

    meme: async (client, message) => {
        await client.reply(message.from, messageResponse.meme.wait, message.id)
        fetch('https://meme-api.herokuapp.com/gimme')
            .then((res) => res.json())
            .then(async (json) => {
                const caption = `*Post:* ${json["postLink"]}\n*Subreddit:* ${json["subreddit"]}\n*Title:* ${json["title"]}\n*Author:* ${json["author"]}`
                await client.sendImage(message.from, json.url, 'meme.jpg', caption)
            })
            .catch(async () => {
                await client.reply(message.from, messageResponse.meme.error, message.id)
            })
    },

    jadwalShalat: async (client, message, args) => {
        if (args.length === 0) {
            fetch(
                'https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json',
            )
                .then((res) => res.json())
                .then(async (json) => {
                    let result = '*List lokasi* \n'
                    for (let i = 0; i < json.length; i++) {
                        result += `${json[i]}\n`
                    }
                    await client.sendText(message.from, result)
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.jadwalShalat.error, message.id)
                })
        } else {
            const today = new Date().toISOString().slice(0, 10).split('-')
            const location = args[0]
            fetch(
                `https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${location}/${today[0]}/${today[1]}/${today[2]}.json`,
            )
                .then((res) => res.json())
                .then(async (json) => {
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
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.jadwalShalat.error, message.id)
                })
        }
    },

    quoteMaker: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.quoteMaker.help, message.id)
        } else {
            const argsString = args.toString().replace(/,/g, ' ')

            if (argsString.includes(':')) {
                await client.reply(message.from, messageResponse.quoteMaker.wait, message.id)
                const replaceEnter = args.toString().replace(/\n/g, '%5Cn')
                const array = replaceEnter.substring(1).split(':')
                const quotes = array[0].replace(/,/g, '%20')
                const author = array[1].replace(/,/g, '%20')

                fetch(`https://terhambar.com/aw/qts/?kata=${quotes}&author=${author}&tipe=random`,)
                    .then((res) => res.json())
                    .then(async (json) => {
                        await client.sendImage(message.from, json.result, 'quotemaker.jpg', messageResponse.quoteMaker.success)
                    })
                    .catch(async () => {
                        await client.reply(message.from, messageResponse.quoteMaker.error, message.id)
                    })
            } else {
                await client.reply(message.from, messageResponse.quoteMaker.help, message.id)
            }
        }
    },

    igStalk: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.igStalk.help, message.id)
        } else {
            await client.reply(message.from, messageResponse.igStalk.wait, message.id)
            const username = args[0]
            userInstagram
                .getUserData(username)
                .then(async (result) => {
                    const caption = `*Link*: ${result.link}\n*Name*: ${result.fullName}\n*Bio*: ${result.biography}\n*Followers:* ${result.subscribersCount}\n*Following:* ${result.subscribtions}\n*Private|Verified*: ${result.isPrivate}|${result.isVerified}\n*Posts Count*: ${result.postsCount}`

                    await client.sendImage(message.from, result.profilePicHD, 'profile.png', caption)
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.igStalk.error, message.id)
                })
        }
    },

    ig: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.ig.help, message.id)
        } else {
            try {
                await client.reply(message.from, messageResponse.ig.wait, message.id)
                // get id url
                const urlArray = args[0].split('/')
                const urlId = urlArray[4]
                const url = `https://www.instagram.com/p/${urlId}`
                const result = await instagramDownload.downloadMedia(url, config.path["instagram"])

                fs.readFile(result.file, async (err, data) => {
                    if (err != null) {
                        await client.sendText(message.from, messageResponse.ig.error)
                    } else {
                        let dataUrl
                        if (result.type === 'Image') {
                            dataUrl = `data:image/jpeg;base64,${data.toString('base64')}`
                        } else {
                            dataUrl = `data:video/mp4;base64,${data.toString('base64')}`
                        }

                        await client.sendFile(message.from, dataUrl, 'instagram.data', messageResponse.ig.success)
                    }
                })
            } catch {
                await client.sendText(message.from, messageResponse.ig.error)
            }
        }
    },

    igStories: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.igStories.help, message.id)
        } else {
            await client.reply(message.from, messageResponse.igStories.wait, message.id)
            const username = args[0]
            const position = args[1]
            await insta.getStories(username).then(async (stories) => {
                if (stories.constructor === Array) {
                    if (position) {
                        if (position > stories.length) {
                            // jika user bebal, dan mengirimi lebih dari yang ada
                            await client.reply(message.from, messageResponse.igStories.error, message.id)
                            return
                        }

                        // kurang 1 karena index mulai dari 0
                        const response = await fetch(stories[position - 1])
                        const buffer = await response.buffer()
                        const dataUrl = `data:${response.headers.get('content-type')};base64,${buffer.toString('base64')}`
                        await client.sendFile(message.from, dataUrl, 'igStories.data', messageResponse.igStories.success)
                    } else {
                        await client.reply(message.from, `Ada ${stories.length} stories di instagram *${username}* master`, message.id)
                    }
                } else {
                    await client.reply(message.from, messageResponse.igStories.error, message.id)
                }
            })
        }
    },

    fbVideo: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.fbVideo.help, message.id)
        } else {
            await client.reply(message.from, messageResponse.fbVideo.wait, message.id)
            const url = args[0]
            fbVideos.low(url).then(async (result) => {
                // url null jika link yang dikirim salah atau link private
                if (result.url != null) {
                    await client.sendFileFromUrl(message.from, result.url, 'facebook.data', messageResponse.fbVideo.success,)
                } else {
                    await client.reply(message.from, messageResponse.fbVideo.error, message.id)
                }
            })
        }
    },

    ytAudio: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.ytAudio.help, message.id)
        } else {
            await client.reply(message.from, messageResponse.ytAudio.wait, message.id)
            const url = args[0]
            const ytAudio = ytdl(url, {quality: 'highestaudio', filter: 'audioonly'})

            ytAudio.on('info', (info, format) => {
                new Promise((resolve, reject) => {
                    ytAudio.on('progress', (chunkSize, downloaded, size) => {
                        // 10 mb
                        if (size > 10000000) {
                            ytAudio.destroy()
                            reject()
                        } else {
                            resolve()
                        }
                    })
                })
                    .then(() => {
                        // remove unnecessary "
                        const title = info.videoDetails.title.replace(/"/g, '')
                        const path = `${config.path["youtube"]}/${title}.${format.container}`
                        const file = ytAudio
                            .pipe(fs.createWriteStream(path))
                            .addListener('finish', async () => {
                                const fileName = `${info.videoDetails.title}.${format.container}`
                                await client.sendFile(message.from, path, fileName, messageResponse.ytAudio.success)
                                file.close()
                            })
                    })
                    .catch(async () => {
                        await client.sendText(message.from, messageResponse.ytAudio.error)
                    })
            })
        }
    },

    ytVideo: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.ytVideo.help, message.id)
        } else {
            await client.reply(message.from, messageResponse.ytVideo.wait, message.id)

            const url = args[0]
            const ytVideo = ytdl(url, {
                filter: (format) => format.container === 'mp4',
            })

            ytVideo.on('info', (info, format) => {
                new Promise((resolve, reject) => {
                    ytVideo.on('progress', (chunkSize, downloaded, size) => {
                        // 50 mb
                        if (size > 50000000) {
                            ytVideo.destroy()
                            reject()
                        } else {
                            resolve()
                        }
                    })
                })
                    .then(() => {
                        // to remove any icon and special charater except &,()
                        const title = info.videoDetails.title
                            .replace(/[^a-zA-Z0-9&()]/g, ' ')
                            .trim()
                        const path = `${config.path["youtube"]}/${title}.${format.container}`
                        const file = ytVideo
                            .pipe(fs.createWriteStream(path))
                            .addListener('finish', async () => {
                                const fileName = `${info.videoDetails.title}.${format.container}`
                                await client.sendFile(message.from, path, fileName, messageResponse.ytVideo.success)
                                file.close()
                            })
                    })
                    .catch(async () => {
                        await client.sendText(
                            message.from,
                            messageResponse.ytVideo.error,
                        )
                    })
            })
        }
    },

    tugas: async (client, message, args) => {
        if (message.isGroupMsg) {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.tugas.help, message.id)
            } else {
                // command add dan del
                const groupId = message.chat.groupMetadata.creation
                const command = args[0]
                const deskripsi = args.slice(1, args.length).toString().replace(/,/g, ' ')

                if (command === 'add' || command === 'del') {
                    if (deskripsi === '') {
                        await client.reply(message.from, messageResponse.tugas.noDescription, message.id)
                        return
                    }

                    fs.readFile(`${config.path.json}/tugas.json`, 'utf8', async (_, data) => {
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
                            fs.writeFile(`${config.path.json}/tugas.json`, json,
                                async (err) => {
                                    if (err) {
                                        await client.reply(message.from, messageResponse.tugas.error, message.id,)
                                    } else {
                                        await client.reply(message.from, messageResponse.tugas.success, message.id,)
                                    }
                                })
                        },
                    )
                }

                if (command === 'list') {
                    const groupName = message.chat.name

                    fs.readFile(
                        `${config.path.json}/tugas.json`,
                        'utf8',
                        async (err, data) => {
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
                        },
                    )
                }
            }
        } else {
            await client.reply(message.from, messageResponse.tugas.noGroup, message.id)
        }
    },

    translate: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.translate.help, message.id)
        } else {
            // conversi array ke string, dengan join =
            // karena kalau toString(), ntar ada kalimat berkoma akan di replace juga
            const word = args.join('=').replace(/=/g, ' ')
            translate(word, {to: 'id'}).then(async (res) => {
                await client.reply(message.from, res.text, message.id)
            })
        }
    },

    waifu: async (client, message) => {
        await client.reply(message.from, messageResponse.waifu.wait, message.id)

        fetch(akaneko.neko())
            .then(res => res.buffer())
            .then(async buffer => {
                const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`
                await client.sendFile(message.from, dataUrl, 'waifu.png', messageResponse.waifu.success, message.id)
            })
            .catch(async () => {
                await client.reply(message.from, messageResponse.waifu.error, message.id)
            })
    },

    kabupatenKota: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.kabupatenKota.help, message.id)
        } else {
            const provinsi = args.toString().replace(/,/g, ' ')
            let result = ''

            fetch(`http://localhost:8000/kabupaten-kota/${provinsi}`)
                .then(res => res.json())
                .then(async json => {
                    result += `*Provinsi:* ${json['provinsi']}\n`
                    result += '*Kabupaten Kota:*'

                    for (let i = 0; i < json['kabupaten_kota'].length; i++) {
                        result += `\n- ${json['kabupaten_kota'][i]}`
                    }

                    await client.reply(message.from, result, message.id)
                })
        }
    },

    cuaca: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.cuaca.help, message.id)
        } else {
            const kabupatenKota = args.toString().replace(/,/g, ' ')
            let result = ''

            fetch(`http://localhost:8000/cuaca/${kabupatenKota}/1`)
                .then(res => res.json())
                .then(async json => {
                    result += `*${json['provinsi']}*\n`
                    result += `*${json['kabupaten']}*\n`

                    for (let i = 0; i < json['weather_list'].length; i++) {
                        result += `==> ${json['weather_list'][i]['date_time']}\n`
                        result += `Temperatur: ${json['weather_list'][i]['temperature']}\n`
                        result += `Cuaca: ${json['weather_list'][i]['weather']}\n\n`
                    }

                    result += 'by BMKG'

                    await client.reply(message.from, result, message.id)
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.cuaca.error, message.id)
                })
        }
    },

    infoGempa: async (client, message) => {
        fetch('http://localhost:8000/gempa')
            .then(res => res.json())
            .then(async json => {
                let result = `*Tanggal*: ${json["date"]}\n`
                result += `*Jam*: ${json["time"]}\n`
                result += `*Kedalaman.* ${json["depth"]}\n`
                result += `*Mag.* ${json["magnitude"]}\n`
                result += `----------\n`

                for (let i = 0; i < json["zone"].length; i++) {
                    result += `${json["zone"][i]}\n`
                }
                result += `----------\n`
                result += `${json["potency"]}`
                result += 'by BMKG'

                await client.reply(message.from, result, message.id)
            })
    },

    bosan: async (client, message) => {
        fetch('https://www.boredapi.com/api/activity')
            .then(res => res.json())
            .then(async json => {
                let result = `${json["activity"]}\n`
                result += `*Type:* ${json["type"]}`
                await client.reply(message.from, result, message.id)
            })
    },

    kanyeQuote: async (client, message) => {
        fetch('https://api.kanye.rest/')
            .then(res => res.json())
            .then(async json => {
                await client.reply(message.from, json["quote"], message.id)
            })
    },

    speech: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.speech.help, message.id)
        } else {
            // language: en, kr, jp
            const lang = args[0]
            const baseLang = ['en', 'kr', 'jp', 'es', 'fr', 'br', 'cn', 'nl', 'ar', 'it', 'de']
            let url = ''

            if (baseLang.includes(lang)) {
                if (lang === 'en') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=en-US_EmilyV3Voice'
                } else if (lang === 'kr') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=ko-KR_YunaVoice'
                } else if (lang === 'jp') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=ja-JP_EmiV3Voice'
                } else if (lang === 'es') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=es-ES_LauraV3Voice'
                } else if (lang === 'fr') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=fr-FR_ReneeV3Voice'
                } else if (lang === 'br') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=pt-BR_IsabelaV3Voice'
                } else if (lang === 'cn') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=zh-CN_ZhangJingVoice'
                } else if (lang === 'nl') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=nl-NL_EmmaVoice'
                } else if (lang === 'ar') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=ar-AR_OmarVoice'
                } else if (lang === 'it') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=it-IT_FrancescaV3Voice'
                } else if (lang === 'de') {
                    url = 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/ce3d3b7b-679f-436f-9b2a-1873729665e0/v1/synthesize?voice=de-DE_ErikaV3Voice'
                }

                await client.reply(message.from, messageResponse.speech.wait, message.id)

                const username = 'apikey'
                const password = 'eFqDzlg1HOxCUJHvJQioQnJswV8IcoF_KCl6l4pLtBWs'
                const word = args.slice(1, args.length).toString().replace(/,/g, ' ')

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64'),
                        'Content-Type': 'application/json',
                        // 'Accept': 'audio/wav'
                    },
                    body: JSON.stringify({text: `${word}`})
                }).then(res => res.buffer())
                    .then(async buffer => {
                        const dataUrl = `data:audio/ogg;base64,${buffer.toString('base64')}`
                        await client.sendPtt(message.from, dataUrl, message.id)
                    })
            } else {
                await client.reply(message.from, messageResponse.speech.help, message.id)
            }
        }
    },

    brainly: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.brainly.help, message.id)
        } else {
            const sender = message.sender.id
            const query = args.toString().replace(/,/g, ' ')
            let result = `*Keyword:* ${query}\n`
            result += '---------------\n'

            brainly(query)
                .then(async res => {
                    for (let i = 0; i < res.data.length; i++) {
                        result += `*Pertanyaan:* ${res.data[i].pertanyaan}\n`

                        for (let j = 0; j < res.data[i].jawaban.length; j++) {
                            result += `*Jawaban:* ${res.data[i].jawaban[j].text}\n`
                        }
                        result += '---------------\n'
                    }

                    await client.reply(message.from, messageResponse.brainly.success, message.id)
                        .then(async () => {
                            await client.sendText(sender, result)
                        })
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.brainly.error, message.id)
                })
        }
    },

    //////////////////////////////////////////////////   GROUP    //////////////////////////////////////////////////
    add: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.add.help, message.id)
        } else {
            const number = args[0].concat('@c.us')
            await client.addParticipant(message.chatId, number)
                .then(async () => {
                    await client.reply(message.from, messageResponse.add.success, message.id)
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.add.error, message.id)
                })
        }
    },

    kick: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.kick.help, message.id)
        } else {
            const number = args[0].replace(/@/g, '').concat('@c.us')
            await client.removeParticipant(message.chatId, number)
                .then(async () => {
                    await client.reply(message.from, messageResponse.kick.success, message.id)
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.kick.error, message.id)
                })
        }
    },

    mentionAll: async (client, message) => {
        await client.getGroupMembers(message.chatId)
            .then(async (results) => {
                let numbers = ''
                for (let i = 0; i < results.length; i++) {
                    numbers += `@${results[i].id.split('@')[0]} `
                }
                await client.sendTextWithMentions(message.from, numbers)
            })
    },

    linkGroup: async (client, message) => {
        await client.getGroupInviteLink(message.chatId)
            .then(async result => {
                await client.reply(message.from, result, message.id)
            })
    },
    //////////////////////////////////////////////////   NSFW    //////////////////////////////////////////////////
    nsfw: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.nsfw.help, message.id)
        } else {
            const groupId = message.chat.groupMetadata.creation
            const option = ['on', 'off']
            let messageResponseTemp = ''

            if (option.includes(args[0])) {
                let nsfwJson = []
                let nsfwTemp = {}

                fs.readFile(`${config.path.json}/nsfw.json`, 'utf8', (_, data) => {
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
                    messageResponseTemp = (args[0] === 'on') ? messageResponse.nsfw.on : messageResponse.nsfw.off

                    const json = JSON.stringify(nsfwJson)
                    fs.writeFile(`${config.path.json}/nsfw.json`, json, async (err) => {
                        if (err) {
                            await client.reply(message.from, messageResponse.nsfw.error, message.id)
                        } else {
                            await client.reply(message.from, messageResponseTemp, message.id)
                        }
                    })
                })
            } else {
                await client.reply(message.from, messageResponse.nsfw.help, message.id)
            }
        }
    }
}

module.exports = functionResponse
