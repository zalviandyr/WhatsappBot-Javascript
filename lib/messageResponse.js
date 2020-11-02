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
        + '*---------Downloader---------*\n'
        + '*!igstalk* [username]\n'
        + '*!igstories* [username] [position]\n'
        + '*!ig* [url]\n'
        + '*!fbvideo* [url]\n'
        + '*!ytaudio* [url]\n'
        + '*!ytvideo* [url]\n'
        + '*---------Other---------*\n'
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
        + '_(dev api)_*!lirik*\n' // todo add this feature
        + '_(dev scrap)_*!brainly*\n' // todo add this feature
        + '*!bosan*\n'
        + '*!speech* [kata]\n'
        + '*!kanyequote*\n'
        + '*---------Study---------*\n'
        + '*!tugas* [command] [desc]\n'
        + '*---------Group---------*\n'
        + '*!kick* [mention]\n'
        + '*!add* [number]\n'
        + '*!mentionall*\n'
        + '*!linkgroup*\n'
        + '*---------NSFW---------*\n'
        + '_(dev)_*nsfw* [on|off]\n'
        + '_(dev)_*lewd* [genre]\n'
        + '_(dev)_*wallpaper*',

    helpOwner:
        '🤖 Inori Yuzuriha Bot 🤖\n'
        + 'Hai owner, can i help you ?\n'
        + 'Your a special person for me ❤\n'
        + 'There is a list of command:\n'
        + '*=========================*\n'
        + '*---------Owner---------*\n'
        + '*!groups*\n'
        + '*!requests*\n'
        + '_(dev)_*!leavegroup [groupid]*', // TODO add this function

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
        error: 'Kayakny ada yang salah nih master',
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
            + 'Bahasa: en, kr, jp, es, fr, br, cn, nl, ar, it, de\n'
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
            'Fitur ini hanya bisa diaktifkan oleh admin'
    },

    creator: 'Orang itu yang telah menaungi salah satu grup',

    about:
        '❤❤ Inori Yuzuriha Bot ❤❤\n'
        + 'Karena bot bukan di-cloud server\n'
        + 'Maka kalau download sesuatu harap bersabar\n',

    notFound: 'Command tidak ditemukan, ulangi lagi yaa~',

    onlyGroup: 'Command hanya digunakan di dalam group saja',

    onlyAdmin: 'Command hanya digunakan jika bot adalah admin',
}

module.exports = messageResponse
