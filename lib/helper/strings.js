const filePath = {
    json: {
        base: './storage/json',
        nsfw: './storage/json/nsfw.json',
        request: './storage/json/request.json',
        report: './storage/json/report.json',
        spam: './storage/json/spam.json',
        state: './storage/json/state.json',
        tugas: './storage/json/tugas.json',
    },
    log: {
        base: './storage/log',
        logText: './storage/log/log.txt'
    },
    media: {
        base: './storage/media',
        about: './storage/media/about.jpg'
    },
    tempMedia: {
        base: './storage/temp-media',
        instagram: './storage/temp-media/instagram',
        youtube: './storage/temp-media/youtube'
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

    userAgent: 'WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
    ownerNumber: '6289696133160@c.us',
    ownerName: '*Grandmaster*'
}
exports.stringValues = stringValues