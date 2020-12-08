const {YoutubeError} = require('./error')

const youtubeSizeValidation = (responseData, sizeMustBe, endMessage) => {
    const title = responseData.title
    const ext = responseData.ext
    const duration = responseData.duration
    const size = responseData.size.split(' ')

    if (size[1] === 'KB' || (size[1] === 'MB' && size[0] * 10 < (sizeMustBe * 10))) {
        return true
    }

    let messageError = `*${title}*\n\n`
    messageError += `*Duration:* ${duration}\n`
    messageError += `*Ext:* ${ext}\n`
    messageError += `*Size:* ${size}\n\n`
    messageError += endMessage
    throw new YoutubeError(messageError)
}
exports.youtubeSizeValidation = youtubeSizeValidation

const checkFacebookLink = (link) => {
    const temp = url.parse(link)
    const validQueryDomains = new Set([
        'facebook.com',
        'www.facebook.com',
        'm.facebook.com',
    ]);

    return validQueryDomains.has(temp.hostname)
}
exports.checkFacebookLink = checkFacebookLink
