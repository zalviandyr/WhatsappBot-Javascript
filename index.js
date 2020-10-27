const wa = require("@open-wa/wa-automate");
const yaml = require("js-yaml");
const fs = require("fs");

// my library
const messageHandler = require("./lib/messageHandler");

// config
const config = yaml.safeLoad(fs.readFileSync("./config.yml", "utf8"));

const start = async (client, callback) => {
    // create delete path
    callback();

    // listening a messages
    await client.onMessage(async (message) => {
        client.getAmountOfLoadedMessages().then((numberMsg) => {
            if (numberMsg >= 1000) {
                client.cutMsgCache();
            }
        });

        // check ini pesan group atau tidak
        if (message.isGroupMsg) {
            await messageHandler(client, message);
        } else {
            // chat private for check status bot
            if (message.from === config["ownerNumber"]) {
                await messageHandler(client, message);
            } else {
                await client.sendText(
                    message.from,
                    "Berdua aja nih ? makasih, tidak terima curhat"
                );
            }
        }
    });

    // listening on added to group
    await client.onAddedToGroup(async (chat) => {
        const groupMember = chat.groupMetadata.participants.length;
        if (groupMember < 20) {
            await client
                .sendText(
                    chat.id,
                    "Cuman segini master ?\nminimal 20 dong, biar rame gtu"
                )
                .then(() => {
                    client.leaveGroup(chat.id);
                });
        } else {
            // jika member terpenuhi
            await client.getAllGroups().then(async (chats) => {
                const allGroup = chats.length;
                // artinya hanya 3 group yn bisa ditangani
                if (allGroup > 3) {
                    await client
                        .sendText(
                            chat.id,
                            "Mohon maaf tidak terima slot master,\nsaya dh puas dipake"
                        )
                        .then(() => {
                            client.leaveGroup(chat.id);
                        });
                } else {
                    // jika berhasil masuk
                    await client.sendText(
                        chat.id,
                        `Hallo master master di group *${chat.formattedTitle}*\nsemoga saya dipake dengan benar`
                    );
                }
            });
        }
    });

    // listening on incoming call
    await client.onIncomingCall(async (call) => {
        await client
            .sendText(
                call.peerJid,
                "Maaf, aku tidak bisa diajak ginian\nblok yaaa~ ehe"
            )
            .then(() => {
                client.contactBlock(call.peerJid);
            });
    });
};

/**
 * Hapus dan buat ulang folder temp-media yang berisikan hasil download
 * jika server dihidupkan kembali
 */
function createDeletePath() {
    // delete path and recreate temp-media
    fs.rmdirSync(config.path["tempMedia"], { recursive: true });
    fs.mkdirSync(config.path["tempMedia"], { recursive: true });

    // create temp-media child directory
    fs.mkdirSync(config.path["instagram"]);
    fs.mkdirSync(config.path["youtube"]);

    // create json and log path, recursive to ignore error
    fs.mkdirSync(config.path["json"], { recursive: true });
    fs.mkdirSync(config.path["log"], { recursive: true });
}

wa.create({
    restartOnCrash: start,
    // untuk kirim video set chrome exe
    useChrome: true,
    executablePath: config.path.chrome,
}).then((client) => start(client, createDeletePath));
