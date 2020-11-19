const {decryptMedia} = require('@open-wa/wa-decrypt')
const userInstagram = require('user-instagram')
const fbVideos = require('fbvideos')
const fetch = require('node-fetch')
const yaml = require('js-yaml')
const fs = require('fs')
const akaneko = require('akaneko')
const translate = require('@k3rn31p4nic/google-translate-api')
const trev = require('trev')
const axios = require('axios')

// my library
const messageResponse = require('./messageResponse')
const {filePath, stringValues} = require('./helper/strings')
const {argExtractor, fetcher, fetcherUrl} = require('./helper/utilities')

// config
const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))

const functionResponse = {
    about: async (client, message) => {
        fetcher(filePath.media.about)
            .then(async (dataUrl) => {
                await client.reply(message.from, messageResponse.about, message.id)
                    .then(async () => {
                        await client.sendImageAsSticker(message.from, dataUrl.toString())
                    })
            })
    },

    request: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.request.help, message.id)
        } else {
            let requestJson = []
            // convert arg to string
            const argString = args.toString().replace(/,/g, ' ')
            // read file
            fs.readFile(filePath.json.request, 'utf8', (_, data) => {
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
                    fs.writeFile(filePath.json.request, json, 'utf8', async (err) => {
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

    report: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.report.help, message.id)
        } else {
            let reportJson = []
            // convert arg to string
            const argString = args.toString().replace(/,/g, ' ')
            // read file
            fs.readFile(filePath.json.report, 'utf8', (_, data) => {
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
                    fs.writeFile(filePath.json.report, json, 'utf8', async (err) => {
                            if (err) {
                                await client.reply(message.from, messageResponse.report.error, message.id)
                            } else {
                                await client.reply(message.from, messageResponse.report.success, message.id)
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
            fetch('https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json')
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
            fetch(`https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${location}/${today[0]}/${today[1]}/${today[2]}.json`)
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
            console.log(args)
            argExtractor.getWord1Word2(args)
                .then(async (result) => {
                    await client.reply(message.from, messageResponse.quoteMaker.wait, message.id)

                    // replace enter and white space
                    const quotes = result.word1.replace(/ /g, '%20').replace(/\n/g, '%5Cn')
                    const author = result.word2.replace(/ /g, '%20').replace(/\n/g, '%5Cn')

                    fetch(`https://terhambar.com/aw/qts/?kata=${quotes}&author=${author}&tipe=random`,)
                        .then((res) => res.json())
                        .then(async (json) => {
                            await client.sendImage(message.from, json.result, 'quotemaker.jpg', messageResponse.quoteMaker.success)
                        })
                        .catch(async () => {
                            await client.reply(message.from, messageResponse.quoteMaker.error, message.id)
                        })
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.quoteMaker.help, message.id)
                })
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
            axios({
                url: `http://157.230.43.115:4000/api/yt-audio?url=${url}`
            }).then(async (resultJson) => {
                const title = resultJson.data.title
                const ext = resultJson.data.ext
                const size = resultJson.data.size.split(' ')
                // 10 mb
                if (size[0] * 10000 < 100000 && ['MB', 'KB'].includes(size[1])) {
                    axios({
                        url: resultJson.data.url,
                        responseType: 'arraybuffer'
                    }).then(async (response) => {
                        const base64 = Buffer.from(response.data, 'binary').toString('base64')
                        const dataUrl = `data:audio/webm;base64,${base64}`
                        await client.sendFile(message.from, dataUrl, `${title}.${ext}`, 'Neh master')
                    })
                } else {
                    await client.reply(message.from, messageResponse.ytAudio.error, message.id)
                }
            }).catch(async () => {
                await client.reply(message.from, messageResponse.ytAudio.error2, message.id)
            })
        }
    },

    ytVideo: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.ytVideo.help, message.id)
        } else {
            await client.reply(message.from, messageResponse.ytVideo.wait, message.id)
            const url = args[0]

            axios({
                url: `http://157.230.43.115:4000/api/yt-video?url=${url}`
            }).then(async (resultJson) => {
                const title = resultJson.data.title
                const ext = resultJson.data.ext
                const size = resultJson.data.size.split(' ')
                // 10 mb
                if (size[0] * 10000 < 100000 && ['MB', 'KB'].includes(size[1])) {
                    axios({
                        url: resultJson.data.url,
                        responseType: 'arraybuffer'
                    }).then(async (response) => {
                        const base64 = Buffer.from(response.data, 'binary').toString('base64')
                        const dataUrl = `data:video/mp4;base64,${base64}`
                        await client.sendFile(message.from, dataUrl, `${title}.${ext}`, 'Neh master')
                    })
                } else {
                    await client.reply(message.from, messageResponse.ytVideo.error, message.id)
                }
            }).catch(async () => {
                await client.reply(message.from, messageResponse.ytVideo.error2, message.id)
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

                    fs.readFile(filePath.json.tugas, 'utf8', async (_, data) => {
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
                            fs.writeFile(filePath.json.tugas, json,
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

                    fs.readFile(filePath.json.tugas, 'utf8', async (err, data) => {
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

        fetcherUrl(akaneko.neko())
            .then(async (dataUrl) => {
                await client.sendFile(message.from.toString(), dataUrl, 'waifu.png', messageResponse.waifu.success, message.id)
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
                result += `${json["potency"]}\n`
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
                const options = {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({text: `${word}`})
                }

                fetcherUrl(url, options)
                    .then(async (dataUrl) => {
                        await client.sendPtt(message.from, dataUrl.toString(), message.id)
                    })
                    .catch(async () => {
                        await client.reply(message.from, messageResponse.speech.error, message.id)
                    })
            } else {
                await client.reply(message.from, messageResponse.speech.help, message.id)
            }
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
            const option = stringValues.switch.list
            let messageResponseTemp = ''

            if (option.includes(args[0])) {
                let nsfwJson = []
                let nsfwTemp = {}

                fs.readFile(filePath.json.nsfw, 'utf8', (_, data) => {
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
                    fs.writeFile(filePath.json.nsfw, json, async (err) => {
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
    },

    lewd: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.lewd.help, message.id)
        } else {
            await client.reply(message.from, messageResponse.lewd.wait, message.id)

            const genre = args.toString().replace(/,/g, ' ')
            let url = ''

            if (genre === 'ass') url = akaneko.nsfw.ass()
            if (genre === 'bdsm') url = akaneko.nsfw.bdsm()
            if (genre === 'blowjob') url = akaneko.nsfw.blowjob()
            if (genre === 'cum') url = akaneko.nsfw.cum()
            if (genre === 'doujin') url = akaneko.nsfw.doujin()
            if (genre === 'feet') url = akaneko.nsfw.feet()
            if (genre === 'femdom') url = akaneko.nsfw.femdom()
            if (genre === 'hentai') url = akaneko.nsfw.hentai()
            if (genre === 'netorare') url = akaneko.nsfw.netorare()
            if (genre === 'maid') url = akaneko.nsfw.maid()
            if (genre === 'orgy') url = akaneko.nsfw.orgy()
            if (genre === 'panties') url = akaneko.nsfw.panties()
            if (genre === 'pussy') url = akaneko.nsfw.pussy()
            if (genre === 'uglybastard') url = akaneko.nsfw.uglyBastard()
            if (genre === 'uniform') url = akaneko.nsfw.uniform()

            fetcherUrl(url)
                .then(async (dataUrl) => {
                    await client.sendFile(message.from, dataUrl.toString(), 'lewd.png', messageResponse.lewd.caption, message.id)
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.lewd.error, message.id)
                })
        }
    },

    lewd2: async (client, message) => {
        await client.reply(message.from, messageResponse.lewd.wait, message.id)
        const hentai = await trev.nsfw.hentai()

        fetcherUrl(hentai.media)
            .then(async (dataUrl) => {
                await client.sendFile(message.from, dataUrl.toString(), 'lewd2.png', messageResponse.lewd.caption, message.id)
            })
            .catch(async () => {
                await client.reply(message.from, messageResponse.lewd.error, message.id)
            })
    },

    wallpaper: async (client, message) => {
        await client.reply(message.from, messageResponse.wallpaper.wait, message.id)

        fetcherUrl(akaneko.nsfw.mobileWallpaper())
            .then(async (dataUrl) => {
                await client.sendFile(message.from, dataUrl.toString(), 'wallpaper.png', messageResponse.wallpaper.caption, message.id)
            })
            .catch(async () => {
                await client.reply(message.from, messageResponse.wallpaper.error, message.id)
            })
    },
    //////////////////////////////////////////////////   SPAM    //////////////////////////////////////////////////
    spam: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.spam.help, message.id)
        } else {
            const groupId = message.chat.groupMetadata.creation
            const option = stringValues.switch.list
            let messageResponseTemp = ''

            if (option.includes(args[0])) {
                let spamJson = []
                let spamTemp = {}

                fs.readFile(filePath.json.spam, 'utf8', (_, data) => {
                    if (data) {
                        spamJson = JSON.parse(data)
                        for (let i = 0; i < spamJson.length; i++) {
                            if (spamJson[i].groupId === groupId) {
                                spamTemp = spamJson[i]
                                break
                            }
                        }
                    }

                    // check if nfswTemp null
                    if (spamTemp.groupId) {
                        spamTemp.option = args[0]
                    } else {
                        spamJson.push({
                            'groupId': groupId,
                            'option': args[0]
                        })
                    }
                    messageResponseTemp = (args[0] === stringValues.switch.on) ? messageResponse.spam.on : messageResponse.spam.off

                    const json = JSON.stringify(spamJson)
                    fs.writeFile(filePath.json.spam, json, async (err) => {
                        if (err) {
                            await client.reply(message.from, messageResponse.spam.error, message.id)
                        } else {
                            await client.reply(message.from, messageResponseTemp, message.id)
                        }
                    })
                })
            } else {
                await client.reply(message.from, messageResponse.spam.help, message.id)
            }
        }
    },
}

module.exports = functionResponse
