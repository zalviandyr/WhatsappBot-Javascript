const {decryptMedia} = require('@open-wa/wa-decrypt')
const userInstagram = require('user-instagram')
const instagramDownload = require('@juliendu11/instagram-downloader')
const fbVideos = require('fbvideos')
const ytdl = require('ytdl-core')
const fetch = require('node-fetch')
const yaml = require('js-yaml')
const fs = require('fs')
const InstaDp = require('instadp')
const insta = new InstaDp()

// my library
const messageResponse = require('./messageResponse')

// config
const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))

module.exports = functionResponse = {
    about: async (client, message) => {
        fs.readFile(config.path["media"] + '/about.jpg', (async (err, data) => {
            const dataUrl = `data:image/jpeg;base64,${data.toString('base64')}`
            await client.reply(message.from, messageResponse.about, message.id)
                .then(async () => {
                    await client.sendImageAsSticker(message.from, dataUrl)
                })
        }))
    },

    request: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.request.help, message.id)
        } else {
            let requestJson = []
            // convert arg to string
            const argString = args.toString().replace(/,/g, " ")
            // read file
            fs.readFile(config.path["json"] + '/request.json', 'utf8', ((err, data) => {
                // jika tidak kosong
                if (data) {
                    requestJson = JSON.parse(data)
                }
                requestJson.push(
                    {
                        request: argString,
                        sender: message.sender.id,
                        pushname: message.sender.pushname,
                        ingroup: message.chat.name
                    }
                )

                const json = JSON.stringify(requestJson)
                fs.writeFile(config.path["json"] + '/request.json', json, 'utf8', async (err) => {
                    if (err) {
                        await client.reply(message.from, messageResponse.request.error, message.id)
                    } else {
                        await client.reply(message.from, messageResponse.request.success, message.id)
                    }
                })
            }))
        }
    },

    sticker: async (client, message, args) => {
        if (message.type === 'chat') {
            if (args.length === 0) {
                await client.reply(message.from, messageResponse.sticker.help, message.id)
            } else {
                await client.reply(message.from, messageResponse.sticker.wait, message.id)
                    .then(async () => {
                        await client.sendStickerfromUrl(message.from, args[0])
                            .catch(async () => {
                                await client.reply(message.from, messageResponse.error, message.id)
                            })
                    })
            }
        } else if (message.isMedia && message.type === 'image') {
            await client.reply(message.from, messageResponse.sticker.wait, message.id)
                .then(async () => {
                    const mediaData = await decryptMedia(message, config.userAgent)
                    if (mediaData) {
                        console.log(message.mimetype)
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
            .then(res => res.json())
            .then(async (json) => {
                await client.sendImage(message.from, json.url, 'meme', `*Title:* ${json.title}\n*Author:* ${json.author}`)
            })
            .catch(async () => {
                await client.reply(message.from, messageResponse.meme.error, message.id)
            })
    },

    jadwalShalat: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.jadwalShalat.wait, message.id)
            fetch('https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json')
                .then(res => res.json())
                .then(async json => {
                    let result = "*List lokasi* \n"
                    for (let i = 0; i < json.length; i++) {
                        result += `${json[i]}\n`
                    }
                    await client.sendText(message.from, result)
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.jadwalShalat.error, message.id)
                })
        } else {
            await client.reply(message.from, messageResponse.jadwalShalat.waitSecondary, message.id)
            let today = new Date().toISOString().slice(0, 10).split("-")
            let location = args[0]
            fetch(`https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${location}/${today[0]}/${today[1]}/${today[2]}.json`)
                .then(res => res.json())
                .then(async json => {
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
            await client.reply(message.from, messageResponse.quoteMaker.wait, message.id)
            const replaceEnter = args.toString().replace(/\n/g, '%5Cn')
            const array = replaceEnter.substring(1).split(':')
            const quotes = array[0].replace(/,/g, '%20')
            const author = array[1].replace(/,/g, '%20')

            fetch(`https://terhambar.com/aw/qts/?kata=${quotes}&author=${author}&tipe=random`)
                .then(res => res.json())
                .then(async json => {
                    await client.sendImage(message.from, json.result, 'quotemaker.jpg', messageResponse.quoteMaker.success)
                })
                .catch(async () => {
                    await client.reply(message.from, messageResponse.quoteMaker.error, message.id)
                })
        }
    },

    igStalk: async (client, message, args) => {
        if (args.length === 0) {
            await client.reply(message.from, messageResponse.igStalk.help, message.id)
        } else {
            await client.reply(message.from, messageResponse.igStalk.wait, message.id)
            const username = args[0]
            userInstagram.getUserData(username)
                .then(async result => {
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

                fs.readFile(result.file, (async (err, data) => {
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
                }))
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
            await insta.getStories(username)
                .then(async stories => {
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
            fbVideos.low(url)
                .then(async result => {
                    // url null jika link yang dikirim salah atau link private
                    if (result.url != null) {
                        await client.sendFileFromUrl(message.from, result.url, 'facebook.data', messageResponse.fbVideo.success)
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
            const ytAudio = ytdl(url, {
                quality: 'highestaudio',
                filter: 'audioonly',

            })

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
                }).then(() => {
                    // remove unnecessary "
                    const title = info.videoDetails.title.replace(/"/g, '')
                    const path = config.path["youtube"] + `/${title}.${format.container}`
                    const file = ytAudio.pipe(fs.createWriteStream(path)).addListener('finish', async () => {
                        const fileName = `${info.videoDetails.title}.${format.container}`
                        await client.sendFile(message.from, path, fileName, messageResponse.ytAudio.success)
                        file.close()
                    })
                }).catch(async () => {
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
                filter: format => format.container === 'mp4'
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
                }).then(() => {
                    // remove unnecessary "
                    const title = info.videoDetails.title.replace(/"/g, '')
                    const path = config.path["youtube"] + `/${title}.${format.container}`
                    const file = ytVideo.pipe(fs.createWriteStream(path)).addListener('finish', async () => {
                        const fileName = `${info.videoDetails.title}.${format.container}`
                        await client.sendFile(message.from, path, fileName, messageResponse.ytVideo.success)
                        file.close()
                    })
                }).catch(async () => {
                    await client.sendText(message.from, messageResponse.ytVideo.error)
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
                const deskripsi = args.slice(1, args.length).toString().replace(/,/g, " ")

                if (command === 'add' || command === 'del') {
                    if (deskripsi === "") {
                        await client.reply(message.from, messageResponse.tugas.noDescription, message.id)
                        return
                    }

                    fs.readFile(config.path['json'] + '/tugas.json', 'utf8', ((err, data) => {
                        let tugas = []
                        let tugasJson = []

                        if (data) {
                            tugasJson = JSON.parse(data)
                            for (let i in tugasJson) {
                                if (tugasJson[i]['id'] === groupId) {
                                    tugas = tugasJson[i]['tugas']
                                    break
                                }
                            }
                        }

                        // cek tugas jika kosong
                        if (tugas.length !== 0) {
                            // add
                            if (command === 'add') {
                                let lastTugas = tugas[tugas.length - 1]
                                let index = lastTugas['id'] + 1
                                tugas.push(
                                    {
                                        id: index,
                                        deskripsi: deskripsi
                                    }
                                )
                            }

                            // delete
                            if (command === 'del') {
                                let index
                                for (let i in tugas) {
                                    // deskripsi bisa saja id untuk menghapus
                                    if (tugas[i]['id'] === deskripsi) {
                                        index = i
                                        break
                                    }
                                }

                                tugas.splice(index, 1)
                            }
                        } else {
                            tugas = [{
                                id: 1,
                                deskripsi: deskripsi
                            }]
                            tugasJson.push(
                                {
                                    id: groupId,
                                    tugas: tugas
                                }
                            )
                        }

                        const json = JSON.stringify(tugasJson)
                        fs.writeFile(config.path['json'] + '/tugas.json', json, async (err) => {
                            if (err) {
                                await client.reply(message.from, messageResponse.tugas.error, message.id)
                            } else {
                                await client.reply(message.from, messageResponse.tugas.success, message.id)
                            }
                        })
                    }))
                }

                if (command === 'list') {
                    const groupName = message.chat.name

                    fs.readFile(config.path['json'] + '/tugas.json', 'utf8', (async (err, data) => {
                        let tugasList = []
                        let tugasJson = []
                        let result = `Nih tugas tugas yang di grup *${groupName}*\n`

                        if (data) {
                            tugasJson = JSON.parse(data)
                            for (let i in tugasJson) {
                                if (tugasJson[i]['id'] === groupId) {
                                    tugasList = tugasJson[i]['tugas']
                                }
                            }

                            result += `ID\tDeskripsi`
                            for (let i in tugasList) {
                                result += `\n${tugasList[i]['id']} - ${tugasList[i]['deskripsi']}`
                            }
                        }
                        await client.reply(message.from, result, message.id)
                    }))
                }
            }
        } else {
            await client.reply(message.from, messageResponse.tugas.noGroup, message.id)
        }
    }
}