const yaml = require('js-yaml')
const fs = require('fs')
const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))

const filePath = {
    json: {
        base: config.path.json,
        nsfw: `${config.path.json}/nsfw.json`,
        request: `${config.path.json}/request.json`,
        spam: `${config.path.json}/spam.json`,
        state: `${config.path.json}/state.json`,
        tugas: `${config.path.json}/tugas.json`,
    },
    log: {
        base: config.path.log,
        logText: `${config.path.log}/log.txt`
    },
    media: {
        base: config.path.media,
        about: `${config.path.media}/about.jpg`
    },
    tempMedia: {
        base: config.path.tempMedia,
        instagram: config.path.instagram,
        youtube: config.path.youtube
    }
}
exports.filePath = filePath

const stringValues = {
    state: {
        list: ['started', 'paused'],
        started: 'started',
        paused: 'paused',
    },

    switch: {
        list: ['on', 'off'],
        on: 'on'
    },

    ownerName: '*Grandmaster*'
}
exports.stringValues = stringValues