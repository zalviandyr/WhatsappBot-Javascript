const {stringValues} = require('./helpers')

const messageResponse = {
    help:
        '🤖 Inori Yuzuriha Bot 🤖\n'
        + 'Can i help you ?\n'
        + 'There is a list of command:\n'
        + '*=========================*\n'
        + '*---------Intro---------*\n'
        + '*!help*\n'
        + '*!tutorial*\n'
        + '*!request* [message]\n'
        + '*!creator*\n'
        + '*!about*\n'
        + '\n*---------Downloader---------*\n'
        + '*!igstalk* [username]\n'
        + '*!igstories* [username] [position]\n'
        + '*!ig* [url]\n'
        + '*!fbvideo* [url]\n'
        + '*!ytaudio* [url]\n'
        + '*!ytvideo* [url]\n'
        + '*!play* [title]\n' // todo add this feature
        + '\n*---------Other---------*\n'
        + '*!sticker* [url]\n'
        + '*!meme*\n'
        + '*!quotemaker* [:quotes:author]\n'
        + '*!jadwalshalat* [lokasi]\n'
        + '*!translate* [word]\n'
        + '*!waifu*\n'
        + '*!kabupatenkota* [provinsi]\n'
        + '*!infogempa*\n'
        + '*!cuaca* [kabupatenkota]\n'
        + '_(dev scrap)_*!kusonime*\n' // todo add this feature
        + '_(dev api)_*!movie*\n' // todo add this feature
        + '*!bosan*\n'
        + '*!speech* [kata]\n'
        + '*!kanyequote*\n'
        + '\n*---------Study---------*\n'
        + '*!tugas* [command] [desc]\n'
        + '\n*---------Group---------*\n'
        + '*!kick* [mention]\n'
        + '*!add* [number]\n'
        + '*!mentionall*\n'
        + '*!linkgroup*\n'
        + '\n*---------NSFW---------*\n'
        + '*lewd* [genre]\n'
        + '*lewd2*\n'
        + '*wallpaper*\n'
        + '\n*---------Spam---------*\n'
        + '*!lirik*\n'
        + '*!brainly*\n'
        + '\n*---------Option---------*\n'
        + '*nsfw* [on|off]\n'
        + '*spam* [on|off]',

    helpOwner:
        '🤖 Inori Yuzuriha Bot 🤖\n'
        + 'Hai owner, can i help you ?\n'
        + 'Your a special person for me ❤\n'
        + 'There is a list of command:\n'
        + '*=========================*\n'
        + '*---------Owner---------*\n'
        + '*!groups*\n'
        + '*!requests*\n'
        + '*!bc* [:groupName:message]\n'
        + '*!bcgroups* [message]\n'
        + '*!state* [:groupName:state]\n'
        + '_(dev)_*!command* [:groupName:limitCommand]\n' // TODO add this function
        + '_(dev)_*!clean*\n' // TODO add this function
        + '*!leavegroup* [groupName]',

    tutorial:
        'Cara memakai sangat mudah, mungkin fitur ini harus dihilangkan dilain waktu\n'
        + '1. Ketik perintah sesuai list\n'
        + '2. Pastikan didahului tanda ! (seru)\n'
        + '3. Jika bingung apa saja argument disetiap fitur, cukup ketik nama fiturnya saja\n'
        + '4. Contoh poin 3: !jadwalshalat\n'
        + '5. Lanjutan poin 4, nanti bot akan memberi response tahap selanjutnya\n'
        + '6. Itu saja sepertinyaa~',

    request: {
        help:
            'Kok gk ada request-an nya master\n_Contoh: !request bisa anu gtu_',
        success:
            'Baik master, terima kasih atas masukannya. Ntar dibaca oleh orang itu',
        result: `Ini list yang di-request ${stringValues.ownerName}`,
        error: 'Kayakny ada yang salah nih master',
        empty: 'Belum ada yang request nih master'
    },

    sticker: {
        help: 'Tolong yang dikirim gambar atau ditambahkan url dong!!',
        wait: 'Tunggu yaa~\nLagi diproses nih',
        error: 'Kayakny ada yang salah nih master',
    },

    meme: {
        wait: 'Tunggu yaa~\nLagi diproses nih',
        error: 'Kayakny ada yang salah nih master',
    },

    jadwalShalat: {
        error: 'Kayakny ada yang salah nih master',
    },

    quoteMaker: {
        help: '_Contohnya: \n!quotemaker :Contoh:Editor berkelas_',
        wait: 'Tunggu yaa~\nLagi diproses nih',
        success: 'neh master',
        error: 'Kayakny ada yang salah nih master',
    },

    igStalk: {
        help:
            'Tambahkan usernamenya tanpa @ master\n_Contohnya: !igstalk zukronalviandy11_',
        wait: 'Tunggu yaa~\nLagi diproses nih',
        error: 'Kayakny ada yang salah nih master',
    },

    ig: {
        help: 'URL-nya mana master',
        wait: 'Tunggu yaa~\nLagi diproses nih',
        success: 'neh master',
        error: 'Kayakny ada yang salah nih master',
    },

    igStories: {
        help:
            'Tambahkan usernamenya tanpa @ master\n'
            + '_Contoh: !igstories zukronalviandy11_\n'
            + 'ntar dikasih tu berapa banyak stories-nya\n'
            + 'master tinggal pilih, mulai dari 1 sampai ...\n'
            + '_Contoh: !igstories zukronalviandy11 3_',
        wait: 'Tunggu yaa~\nLagi diproses nih',
        success: 'neh master',
        error:
            'Kayakny ada yang salah nih master\nmungkin instagram-nya private',
    },

    fbVideo: {
        help: 'URL-nya mana master',
        wait: 'Tunggu yaa~\nLagi diproses nih',
        success: 'neh master',
        error:
            'Kayakny ada yang salah nih master\nUrl salah atau di private group',
    },

    ytAudio: {
        help: 'URL-nya mana master',
        wait: 'Tunggu yaa~\nLagi diproses nih',
        success: 'neh master',
        error: 'Gk sanggup master\nkelebihan beban maks. 10Mb',
    },

    ytVideo: {
        help: 'URL-nya mana master',
        wait: 'Tunggu yaa~\nLagi diproses nih',
        success: 'neh master',
        error: 'Gk sanggup master\nkelebihan beban maks. 50Mb',
    },

    tugas: {
        help:
            'Command-nya mana master\n'
            + 'ada 3: list, add, del\n'
            + '-list: !tugas list\n'
            + '-add: !tugas add laporan laporan dosen\n'
            + '-del: !tugas del 5\n'
            + 'Note. khusus untuk del harus id',
        success: 'Berhasil neh master',
        error: 'Kayakny ada yang salah nih master',
        noGroup: 'Command hanya berlaku di grup master',
        noDescription: 'Kok tidak ada deskripsinya master',
    },

    translate: {
        help:
            'Kata-kata nya mana master\n'
            + 'Translate to id\n'
            + '_Contoh: !translate unnecessary_',
        error: 'Kayakny ada yang salah nih master',
    },

    waifu: {
        wait: 'Tunggu yaa~\nLagi diproses nih',
        success: 'neh master',
        error: 'Kayakny ada yang salah nih master',
    },

    kabupatenKota: {
        help:
            'Tambahkan provinsinya master\n'
            + '_Contoh: !kabupatenkota jambi_'
    },

    cuaca: {
        help:
            'Tambahkan kabupaten kota-nya master\n'
            + '_Contoh: !cuaca kabupaten bungo_\n'
            + 'kabupaten kota bisa diambil dari fitur !kabupatenkota',
        error: 'Kayakny ada yang salah nih master\n'
            + 'kabupaten atau kota tidak ditemukan\n'
            + 'mungkin typo di kabupaten atau kota',
    },

    speech: {
        help:
            'Kata kata dengan bahasa nya mana master\n'
            + 'Language:\n'
            + '- en (English)\n'
            + '- kr (Korean)\n'
            + '- jp (Japanese)\n'
            + '- es (Spanish)\n'
            + '- fr (French)\n'
            + '- br (Brazilian)\n'
            + '- cn (Mandarin)\n'
            + '- nl (Dutch)\n'
            + '- ar (Arabic)\n'
            + '- it (Italian)\n'
            + '- de (German)\n'
            + '_Contoh: !speech en something weird_',
        wait: 'Tunggu yaa~\nLagi diproses nih',
        error: 'Kayakny ada yang salah nih master'
    },

    add: {
        help:
            'Add dengan nomor master\n'
            + '_Contoh: !kick 628xxxx_',
        success: 'Selamat datang master',
        error: 'Kayakny ada yang salah nih master',
    },

    kick: {
        help:
            'Kick dengan mention master\n'
            + '_Contoh: !kick @udin_',
        success: 'Kasian ter-kick',
        error: 'Kayakny ada yang salah nih master',
    },

    nsfw: {
        help:
            'Fitur ini bisa membuat efek ketagihan\n'
            + 'Gunakan dengan bijak biar menambah efek anu\n'
            + '_Contoh: !nsfw on_',
        on: 'Selamat menikmati master',
        off: 'Yaah, dah tobat ya master',
        offError: 'On kan dulu master fitur !nsfw nya',
        error: 'Kayakny ada yang salah nih master'
    },

    spam: {
        help:
            'Fitur ini untuk bisa memakai fitur-fitur spam lainnya\n'
            + '_Contoh: !spam on_',
        on: 'Jangan kebablasan master',
        off: 'Ingin chat bersih ya master',
        offError: 'On kan dulu master fitur !spam nya',
        error: 'Kayakny ada yang salah nih master',
    },

    brainly: {
        help:
            'Keyword-nya mana master\n'
            + '_Contoh: !brainly cara menjadi human_\n'
            + 'Ntar hasilnya dikirim secara private',
        error: 'Kayakny ada yang salah nih master',
    },

    lirik: {
        help:
            'Keyword-nya mana master\n'
            + '_Contoh: !lirik mitis moments_\n'
            + 'Ntar hasilnya dikirim secara private',
        error: 'Kayakny ada yang salah nih\n'
            + 'Mungkin lagunya kurang populer master, ehe'
    },

    lewd: {
        help:
            'Genre-nya mana master\n'
            + 'Genre: ass, bdsm, blowjob, cum, doujin\n'
            + 'feet, femdom, hentai, netorare, maid\n'
            + 'orgy, panties, pussy, uglybastard, uniform',
        wait: 'Tunggu yaa~\nLagi diproses nih',
        caption: 'Neh master',
        error: 'Kayakny ada yang salah nih'
    },

    wallpaper: {
        wait: 'Tunggu yaa~\nLagi diproses nih',
        caption: 'Neh master',
        error: 'Kayakny ada yang salah nih'
    },

    bc: {
        help: 'Nama group dengan kata-kata nya mana master\n'
            + '_Contoh: !bc :nama group:pesan_',
        error: 'Kayakny ada yang salah nih'
            + '\nmungkin group-nya tidak ada'
    },

    groups: {
        result: `Ini list yang bergabung ${stringValues.ownerName}`
    },

    bcGroups: {
        help: 'Pesan-nya mana master\n'
            + '_Contoh: !bcgroups hai para master master_',
        success: `by ${stringValues.ownerName}`
    },

    state: {
        help: 'Nama group dengan state-ny mana master\n'
            + 'State yang berlaku hanya 2, yaitu\n'
            + `*${stringValues.state.list}*\n`
            + '_Contoh: !state :nama group:started_',
        empty: 'Masih kosong nih master state-nya\n'
            + '==========================\n'
            + 'Nama group dengan state-ny mana master\n'
            + 'State yang berlaku hanya 2, yaitu\n'
            + `*${stringValues.state.list}*\n`
            + '_Contoh: !state :nama group:started_',
        result: `Ini list state-nya ${stringValues.ownerName}`,
        success: 'State berhasil diubah',
        started: 'Silahkan dipergunakan master\n'
            + `by ${stringValues.ownerName}`,
        paused: 'Maaf master saat ini tidak lagi terima command\n'
            + 'Capek jadi babu, istirahat bentaran dulu\n'
            + `by ${stringValues.ownerName}`,
        notRegistered: 'Sepertinya ini penyelundupan master\n'
            + `Coba request dulu ke ${stringValues.ownerName} agar dibuka aksesnya\n`
            + '_Contoh: !request buka dong grup nya_',
        error: 'Kayakny ada yang salah nih'
            + '\nmungkin group-nya tidak ada'
    },

    leaveGroup: {
        help: 'Nama group nya mana master\n'
            + '_Contoh: !leavegroup para lelaki tamvan_',
        error: 'Kayakny ada yang salah nih'
            + '\nmungkin group-nya tidak ada'
    },

    creator: `${stringValues.ownerName} yang ada di salah satu grup`,

    about:
        '❤❤ Inori Yuzuriha Bot ❤❤\n'
        + 'Karena bot bukan di-cloud server\n'
        + 'Maka kalau download sesuatu harap bersabar',

    notFound: 'Command tidak ditemukan, ulangi lagi yaa~',

    onlyGroup: 'Command hanya digunakan di dalam group saja',

    onlyAdmin: 'Command hanya digunakan jika bot adalah admin',

    privateMessage: 'Berdua aja nih ? makasih, tidak terima curhat',

    lessParticipants: 'Cuman segini master ?\nminimal 20 dong, biar rame gtu',

    incomingCall: 'Maaf, aku tidak bisa diajak ginian\nblok yaaa~ ehe'
}

module.exports = messageResponse
