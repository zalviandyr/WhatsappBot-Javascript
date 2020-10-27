const yaml = require('js-yaml')
const fs = require('fs')

// my library
const messageResponse = require('./messageResponse')

// config
const config = yaml.safeLoad(fs.readFileSync('./config.yml'))

/**
 * fungsi ini akan dijalankan walaupun pesannya lewat grup
 * maka dari itu ada reply command not found
 */
module.exports = functionOwnerResponse = {
    groups: async (client, message) => {
        let result = "Ini list yang bergabung master"
        client.getAllGroups()
            .then(async (chats) => {
                for (let i in chats) {
                    result += `\n=> ${chats[i]['formattedTitle']}`
                }

                await client.reply(message.from, result, message.id)
            })
    },

    requests: async (client, message) => {
        const json = config.path['json'] + '/request.json'
        fs.readFile(json, 'utf8', ( async (err, data) => {
            let result = 'Ini list yang di-request master'
            const requestsJson = JSON.parse(data)
            for (let i in requestsJson) {
                result += `\n- Request: ${requestsJson[i]['request']}`
                result += `\n- Dari: ${requestsJson[i]['sender']}`
                result += `\n- Nama: ${requestsJson[i]['pushname']}`
                result += `\n- Group: ${requestsJson[i]['ingroup']}`
                result += `\n============================`
            }

            await client.reply(message.from, result, message.id)
        }))
    }
}