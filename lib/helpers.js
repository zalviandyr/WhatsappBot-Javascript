const {filePath} = require('./helper/strings')
const fs = require('fs')

const authorization = {
    checkState: async function (client, message) {
        return new Promise((resolve, reject) => {
            // check jika tipe chat dan diawali tanda ! (seru)
            if (message.type === 'chat' && message.body.startsWith('!')) {
                fs.readFile(filePath.json.state, 'utf8', (_, data) => {
                    let stateJson = [];
                    let stateJsonTemp;
                    const groupName = message.chat.name.toLowerCase()

                    if (data) {
                        stateJson = JSON.parse(data)

                        for (let i = 0; i < stateJson.length; i++) {
                            if (groupName === stateJson[i].name.toLowerCase()) {
                                stateJsonTemp = stateJson[i]
                                break
                            }
                        }
                    }

                    if (stateJsonTemp) {
                        resolve(stateJsonTemp.state)
                    } else {
                        // jika terjadi bot tidak aktif dan ada seseorang yang memasukkan ny ke group
                        // otomatis event onAddedToGroup tidak tereksekusi

                        // check jika itu !request
                        const messages = message.body.split(' ')
                        const command = messages[0].substring(1)
                        let err
                        if (command !== 'request') {
                            err = 'ada error'
                        }

                        reject(err)
                    }
                })
            }
        })
    }
}
exports.authorization = authorization