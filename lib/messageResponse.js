const {stringValues} = require('./helper/strings')

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
        + '*!report* [message]\n'
        + '*!creator*\n'
        + '*!about*\n'
        + '\n*---------IG FB YT---------*\n'
        + '*!igstalk* [username]\n'
        + '*!fbvideo* [url]\n'
        + '*!ytaudio* [url]\n'
        + '*!ytsearch* [keyword]\n'
        + '*!ytvideo* [url]\n'
        + '\n*---------Other---------*\n'
        + '*!sticker* [url]\n'
        + '*!meme*\n'
        + '*!quotemaker* [:quotes:author]\n'
        + '*!jadwalshalat* [lokasi]\n'
        + '*!translate* [word]\n'
        + '*!kabupatenkota* [provinsi]\n'
        + '*!infogempa*\n'
        + '*!cuaca* [kabupatenkota]\n'
        + '*!covid*\n'
        + '*!bosan*\n'
        + '*!speech* [lang] [kata]\n'
        + '*!quote*\n'
        + '*!kanyequote*\n'
        + '\n*---------Anime---------*\n'
        + '*!waifu*\n'
        + '*!kusonime* [keyword]\n'
        + '\n*---------Study---------*\n'
        + '*!tugas* [command] [desc]\n'
        + '\n*---------Group---------*\n'
        + '*!kick* [mention]\n'
        + '*!add* [number]\n'
        + '*!mentionall*\n'
        + '*!linkgroup*\n'
        + '\n*---------NSFW---------*\n'
        + '*!lewd* [genre]\n'
        + '*!lewd2*\n'
        + '*!wallpaper*\n'
        + '\n*---------Option---------*\n'
        + '*!nsfw* [on|off]',

    helpOwner:
        '🤖 Inori Yuzuriha Bot 🤖\n'
        + 'Hai owner, can i help you ?\n'
        + 'Your a special person for me ❤\n'
        + 'There is a list of command:\n'
        + '*=========================*\n'
        + '*---------Owner---------*\n'
        + '*!groups*\n'
        + '*!reports*\n'
        + '*!requests*\n'
        + '*!bc* [:groupName:message]\n'
        + '*!bcgroups* [message]\n'
        + '*!state* [:groupName:state]\n'
        + '*!clean*\n'
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
            'Kok gk ada request-an nya master\n_Contoh: !request tambahkan fitur anu gtu_',
        success:
            `Baik master, terima kasih atas masukannya. Ntar dibaca oleh ${stringValues.ownerName}`,
        result: `Ini list yang di-request ${stringValues.ownerName}`,
        empty: 'Belum ada yang request nih master'
    },

    report: {
        help:
            'Kok gk ada report nya master\n_Contoh: !report ada bug di fitur_',
        success:
            `Baik master, terima kasih atas masukannya. Ntar dibaca oleh ${stringValues.ownerName}`,
        result: `Ini list yang di-report ${stringValues.ownerName}`,
        empty: 'Belum ada yang report nih master'
    },

    sticker: {
        help: 'Tolong yang dikirim gambar atau ditambahkan url dong!!',
    },

    quoteMaker: {
        help: '_Contohnya: !quotemaker :Contoh:Editor berkelas_',
    },

    igStalk: {
        help:
            'Tambahkan usernamenya tanpa @ master\n_Contohnya: !igstalk zukronalviandy11_',
    },

    fbVideo: {
        help: 'URL-nya mana master',
        error:
            'Kayakny ada yang salah nih master\nUrl salah atau di private group',
    },

    ytAudio: {
        help: 'URL-nya mana master',
        error: 'Gk sanggup master\nkelebihan beban maks. 10MB',
    },

    ytSearch: {
        help: 'Keyword mana master\n'
            + '_Contoh: !ytsearch mitis moments_',
    },

    ytVideo: {
        help: 'URL-nya mana master',
        error: 'Gk sanggup master\nkelebihan beban maks. 10MB',
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
        noGroup: 'Command hanya berlaku di grup master',
        noDescription: 'Kok tidak ada deskripsinya master',
    },

    translate: {
        help:
            'Kata-kata nya mana master\n'
            + 'Translate to id\n'
            + '_Contoh: !translate unnecessary_',
    },

    kabupatenKota: {
        help:
            'Tambahkan provinsinya master\n'
            + '_Contoh: !kabupatenkota jambi_',
    },

    cuaca: {
        help:
            'Tambahkan kabupaten kota-nya master\n'
            + '_Contoh: !cuaca kab bungo_\n'
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
    },

    add: {
        help:
            'Add dengan nomor master\n'
            + '_Contoh: !add 628xxxx_',
        success: 'Selamat datang master',
    },

    kick: {
        help:
            'Kick dengan mention master\n'
            + '_Contoh: !kick @udin_',
        success: 'Kasian ter-kick',
    },

    kusonime: {
        help:
            'Keyword-nya mana master\n'
            + '_Contoh: !kusonime dr stone_'
    },

    nsfw: {
        help:
            'Fitur ini bisa membuat efek ketagihan\n'
            + 'Gunakan dengan bijak biar menambah efek anu\n'
            + '_Contoh: !nsfw on_',
        on: 'Selamat menikmati master',
        off: 'Yaah, dah tobat ya master',
        offError: 'On kan dulu master fitur !nsfw nya',
    },

    lewd: {
        help:
            'Genre-nya mana master\n'
            + 'Genre: ass, bdsm, blowjob, cum, doujin\n'
            + 'feet, femdom, hentai, netorare, maid\n'
            + 'orgy, panties, pussy, uglybastard, uniform',
    },

    bc: {
        help: 'Nama group dengan kata-kata nya mana master\n'
            + '_Contoh: !bc :nama group:pesan_',
        success: `Pesan terkirim ${stringValues.ownerName}`,
        error: 'Kayakny ada yang salah nih'
            + '\nmungkin group-nya tidak ada'
    },

    groups: {
        result: `Ini list yang bergabung ${stringValues.ownerName}`
    },

    bcGroups: {
        help: 'Pesan-nya mana master\n'
            + '_Contoh: !bcgroups hai para master master_'
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

    clean: {
        success: 'Berhasil membersihkan temp-media'
    },

    leaveGroup: {
        help: 'Nama group nya mana master\n'
            + '_Contoh: !leavegroup para lelaki tamvan_',
        success: `Berhasil keluar group ${stringValues.ownerName}`,
        error: 'Kayakny ada yang salah nih'
            + '\nmungkin group-nya tidak ada'
    },

    creator: `${stringValues.ownerName} yang ada di salah satu grup\n`
        + 'Social media:\n'
        + 'Instagram: https://www.instagram.com/zukronalviandy11/\n'
        + 'Facebook: https://www.facebook.com/Z.Alviandy.R28/\n'
        + 'Github: https://github.com/zalviandyr',

    about: '❤❤ Inori Yuzuriha Bot ❤❤\n',

    commonSuccess: 'Neh master',

    commonWait: 'Tunggu yaa~\nLagi diproses nih',

    commonError: 'Kayakny ada yang salah nih',

    notFound: 'Command tidak ditemukan, ulangi lagi yaa~',

    onlyGroup: 'Command hanya digunakan di dalam group saja',

    onlyAdmin: 'Command hanya digunakan jika bot adalah admin',

    privateMessage: 'Berdua aja nih ? makasih, tidak terima curhat',

    lessParticipants: 'Cuman segini master ?\nminimal 10 dong, biar rame gtu',

    incomingCall: 'Maaf, aku tidak bisa diajak ginian\nblok yaaa~ ehe',
}

module.exports = messageResponse
