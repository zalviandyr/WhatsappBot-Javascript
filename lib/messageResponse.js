const {stringValues} = require('./helper/strings')

const messageResponse = {
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
        + '*!leavegroup* [groupName]\n'
        + '*!status*',

    help:
        '🤖 Inori Yuzuriha Bot 🤖\n'
        + 'Can i help you ?\n'
        + 'There is a list of command:\n'
        + '*=========================*\n'
        + '*---------Intro---------*\n'
        + '*!about*\n'
        + '*!creator*\n'
        + '*!donasi*\n'
        + '*!help*\n'
        + '*!request* [message]\n'
        + '*!report* [message]\n'
        + '*!tutorial*\n'
        + '\n*-------IG FB YT TT-------*\n'
        + '*!ig* [url]\n'
        + '*!igstalk* [username]\n'
        + '*!fbvideo* [url]\n'
        + '*!tiktok* [url]\n'
        + '*!ytaudio* [url]\n'
        + '*!ytsearch* [keyword]\n'
        + '*!ytplay* [keyword]\n'
        + '*!ytvideo* [url]\n'
        + '\n*---------Indonesia---------*\n'
        + '*!covid*\n'
        + '*!cuaca* [kabupatenkota]\n'
        + '*!infogempa*\n'
        + '*!jadwalshalat* {lokasi}\n'
        + '*!kabupatenkota* [provinsi]\n'
        + '\n*---------Kitab---------*\n'
        + '*!quran*\n'
        + '*!surat* [no surat] {no ayat}\n'
        + '*!alkitab* [nama] [chapter:number]\n'
        + '\n*---------Anime---------*\n'
        + '*!inori*\n'
        + '*!husbu*\n'
        + '*!waifu*\n'
        + '*!waifu2*\n'
        + '*!waifu3*\n'
        + '*!wallpaper*\n'
        + '*!whatanime*\n'
        + '*!kusonime* [keyword]\n'
        + '*!neonime* [keyword]\n'
        + '\n*---------Korea---------*\n'
        + '*!drakorasia* [keyword]\n'
        + '\n*---------Ramalan---------*\n'
        + '*!artinama* [nama]\n'
        + '*!pasangan* [:nama anda:nama doi]\n'
        + '*!penyakit* [tanggal]\n'
        + '*!pekerjaan* [tanggal]\n'
        + '\n*---------Hiburan---------*\n'
        + '*!lirik* [keyword]\n'
        + '*!meme*\n'
        + '*!manga* [keyword]\n'
        + '*!movie* [keyword]\n'
        + '*!movie2* [keyword]\n'
        + '*!speech* [lang] [kata]\n'
        + '*!suit* [pilihan]\n'
        + '\n*---------Group---------*\n'
        + '*!add* [number]\n'
        + '*!admin* [mention]\n'
        + '*!adminall*\n'
        + '*!user* [mention]\n'
        + '*!userall*\n'
        + '*!kick* [mention]\n'
        + '*!linkgroup*\n'
        + '*!mentionall*\n'
        + '\n*---------Study---------*\n'
        + '*!tugas* [command] [desc]\n'
        + '*!wiki* [keyword]\n'
        + '\n*---------Other---------*\n'
        + '*!sticker* {url}\n'
        + '*!stickergif*\n'
        + '*!quotemaker* [:quotes:author]\n'
        + '*!bosan*\n'
        + '*!quote*\n'
        + '*!quote2*\n'
        + '*!kanyequote*\n'
        + '\n*---------Tools---------*\n'
        + '*!shortlink* [url]\n'
        + '*!translate* [word]\n'
        + '\n*------Kerang Ajaib------*\n'
        + '*!apakah* [pertanyaan]\n'
        + '*!kapankah* [pertanyaan]\n'
        + '*!siapakah* [pertanyaan]\n'
        + '\n*---------NSFW---------*\n'
        + '*!lewd* [genre]\n'
        + '*!lewd2*\n'
        + '*!nekopoi*\n'
        + '\n*---------Option---------*\n'
        + '*!nsfw* [on|off]\n'
        + '\n*---------Utility---------*\n'
        + '*!delete*\n'
        + '\n*---------Legend---------*\n'
        + '[ ] = argumen mesti diisi\n' // jika tidak diisi hanya response help
        + '{ } = argumen opsional', // jika tidak diisi response help dan nilai

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
        help: 'Tolong yang dikirim gambar atau ditambahkan url dong!!\n'
            + 'bisa juga dengan reply pesan gambar master',
    },

    stickerGif: {
        help: 'Tolong yang dikirim gif atau video dong!!\n'
            + 'bisa juga dengan reply pesan gif atau video master\n\n'
            + '*Note:* kalau sticker-nya tidak muncul cba ulangi lagi',
        error: 'Kayaknya ada yang salah nih master\n'
            + 'file gif atau video tidak boleh lebih 1MB'
    },

    delete: {
        help:
            'Tolong di reply dong pesan yang mau di delete master\n'
            + '*Note:* Whatsapp Mod tidak bisa menggunakan fitur ini'
    },

    quoteMaker: {
        help:
            'Author sama quote nya mana master\n'
            + '_Contoh: !quotemaker :Contoh:Editor berkelas_',
    },

    ig: {
        help:
            'Url-nya mana master master\n'
            + '_Contoh: !ig https://www.instagram.com/p/CIgX4ayj2-U_',
    },

    igStalk: {
        help:
            'Tambahkan usernamenya tanpa @ master\n'
            + '_Contoh: !igstalk zukronalviandy11_',
    },

    fbVideo: {
        help: 'URL-nya mana master',
        error:
            'Kayakny ada yang salah nih master. Url salah atau di private group',
    },

    tiktok: {
        help:
            'URL-nya mana master\n'
            + '_Contoh: !tiktok https://www.tiktok.com_',
    },

    ytAudio: {
        help: 'URL-nya mana master',
        error: 'Gk sanggup master\nkelebihan beban maks. 50MB',
    },

    ytSearch: {
        help: 'Keyword mana master\n'
            + '_Contoh: !ytsearch mitis moments_',
    },

    ytPlay: {
        help: 'Keyword mana master\n'
            + '_Contoh: !ytplay mitis moments_',
        wait: 'Tunggu sebentar master, lagi proses nyanyi nih',
        error: 'Gk sanggup master\nkelebihan beban maks. 10MB',
    },

    ytVideo: {
        help: 'URL-nya mana master',
        error: 'Gk sanggup master\nkelebihan beban maks. 50MB',
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
            + '_Contoh: !cuaca kab bungo_\n\n'
            + 'kabupaten kota bisa diambil dari fitur *!kabupatenkota*',
        error:
            'Kayakny ada yang salah nih master\n'
            + 'kabupaten atau kota tidak ditemukan\n'
            + 'mungkin typo di kabupaten atau kota\n\n'
            + 'kabupaten kota bisa diambil dari fitur *!kabupatenkota*',
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
            + '_Contoh: !speech en something weird_\n\n'
            + '*Note:* Kalimat di sesuai dengan bahasa nya master biar nyambung\n'
            + '_Contoh: !speech jp おはよう_',
    },

    kusonime: {
        help:
            'Keyword-nya mana master\n'
            + '_Contoh: !kusonime dr stone_'
    },

    nenonime: {
        help:
            'Keyword-nya mana master\n'
            + '_Contoh: !neonime shingeki no kyojin_'
    },

    drakorasia: {
        help:
            'Keyword-nya mana master\n'
            + '_Contoh: !drakorasia tale_',
    },

    lirik: {
        help:
            'Keyword-nya mana master\n'
            + '_Contoh: !lirik mitis moments_',
    },

    artiNama: {
        help:
            'Namanya mana master\n'
            + '_Contoh: !artinama otong surotong_'
    },

    pasangan: {
        help:
            'Nama anda sama nama doi mana master\n'
            + '_Contoh: !pasangan :otong surotong:anya geraldine_'
    },

    penyakit: {
        help:
            'Tanggal lahir nya mana master (DD-MM-YYYY)\n'
            + '_Contoh: !penyakit 30-12-2020_'
    },

    pekerjaan: {
        help:
            'Tanggal lahir nya mana master (DD-MM-YYYY)\n'
            + '_Contoh: !pekerjaan 30-12-2020_'
    },

    whatAnime: {
        help:
            'Tolong yang dikirim gambar atau ditambahkan url dong!!\n'
            + 'dengan reply message juga bisa master\n'
            + '_Contoh: !whatanime http://example.com_',
        lowSimilarity:
            'Antara yakin gk yakin sih master\n'
            + 'kurang jelas sih gambar nya\n'
            + 'yang penting dapat hasilnya~',
        highSimilarity:
            'Pede kalau hasil yang ini master\n'
            + 'kalau salah berarti master yang goblok kirim gambar'
    },

    shortLink: {
        help: 'Url ny mana master\n'
            + '_Contoh: !shortlink http://example.com_'
    },

    suit: {
        help: 'Pilihan batu, gunting atau kertas-nya mana master\n'
            + '_Contoh: !suit batu_',
        win: '*Inori win*\nHah.. punya jari buat suit master ?',
        lose: '*Inori lose*\nDih... menang dengan bot bangga',
        tie: '*Tie*\nBoleh juga tu jari diliat-liat'
    },

    ///////////////////////////////////// STUDY ///////////////////////////////////////
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

    wiki: {
        help:
            'Keyword-nya mana master\n'
            + '_Contoh: !wiki linux_',
    },

    manga: {
        help:
            'Keyword-nya mana master\n'
            + '_Contoh: !manga dr stone_'
    },

    movie: {
        help:
            'Keyword-nya mana master\n'
            + '_Contoh: !movie spiderman_'
    },

    movie2: {
        help:
            'Keyword-nya mana master\n'
            + '_Contoh: !movie2 spongebob_'
    },

    ///////////////////////////////////// KITAB ///////////////////////////////////////
    surat: {
        help:
            'Tolong no surat-nya master, kalau mau lengkap bisa ditambah no ayat\n'
            + '_Contoh: !surat 1_\n'
            + '_Contoh: !surat 1 3_'
    },

    alkitab: {
        help:
            'Tolong nama, chapter, number nya diisi dong master\n'
            + '_Contoh: !alkitab yohanes 1:1_\n\n'
            + '*Note:* jika tidak menemukan apa yang dicari coba disingkat\n'
            + '_Contoh: !alkitab tim 5:23_'
    },

    ///////////////////////////////////// KERANG ///////////////////////////////////////
    apakah: {
        help:
            'Tolong pertanyaan dong master\n'
            + '_Contoh: !apakah saya idiot ?_'
    },
    kapankah: {
        help:
            'Tolong pertanyaan dong master\n'
            + '_Contoh: !kapankah saya kaya ?_'
    },
    siapakah: {
        help:
            'Tolong pertanyaan dong master\n'
            + '_Contoh: !siapakah yang paling ganteng ?_'
    },

    ///////////////////////////////////// GROUP ///////////////////////////////////////
    admin: {
        help:
            'Promote user jadi admin via tag master\n'
            + '_Contoh: !admin @otong_',
        success: 'Selamat jadi admin master'
    },

    adminAll: {
        success: 'Selamat jadi admin semua'
    },

    user: {
        help:
            'Demote admin jadi user via tag master\n'
            + '_Contoh: !user @otong_',
        success: 'Yaah.. kasian ilang jabatan'
    },

    userAll: {
        success: 'Yaah.. kasian ilang jabatan semua'
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

    ///////////////////////////////////// LEWD ///////////////////////////////////////
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
            + 'Genre:\n'
            + 'ass, bdsm, blowjob, cum, '
            + 'doujin, feet, femdom, glasses, hentai, loli, '
            + 'netorare, maid, masturbation, orgy, panties, '
            + 'pussy, school, tentacles, thighs, uglybastard, '
            + 'uniform, yaoi, yuri, wallpaper'
    },

    ///////////////////////////////////// Function Owner ///////////////////////////////////////
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

    leaveGroup: {
        help: 'Nama group nya mana master\n'
            + '_Contoh: !leavegroup para lelaki tamvan_',
        success: `Berhasil keluar group ${stringValues.ownerName}`,
        error: 'Kayakny ada yang salah nih'
            + '\nmungkin group-nya tidak ada'
    },
    //////////////////////////////////////////////////////////////////////////////////////////

    creator: `${stringValues.ownerName} yang ada di salah satu grup\n`
        + 'Social media:\n'
        + 'Github: https://github.com/zalviandyr\n'
        + 'Facebook: https://www.facebook.com/Z.Alviandy.R28/\n\n'
        + '*Zerachiuw ❤❤*',

    about: '❤❤ Inori Yuzuriha Bot ❤❤\n',

    commonSuccess: 'Neh master',

    commonWait: 'Tunggu yaa~\nLagi diproses nih',

    commonWaitTime:
        'Tunggu yaa~\n'
        + 'Lagi diproses nih\n\n'
        + '*Note:* Jika selama 5 menit belum ada response mohon diulang kembali',

    commonError: 'Kayakny ada yang salah nih',

    notFound: 'Command tidak ditemukan, ulangi lagi yaa~',

    notFoundSearchResult: 'Hasil tidak ada, ulangi lagi yaa~',

    onlyGroup: 'Command hanya digunakan di dalam group saja',

    onlyAdmin: 'Command hanya digunakan jika bot adalah admin',

    privateMessage: 'Berdua aja nih ? makasih, tidak terima curhat',

    lessParticipants: 'Cuman segini master ?\nminimal 10 dong, biar rame gtu',

    incomingCall: 'Maaf, aku tidak bisa diajak ginian\nblok yaaa~ ehe',
}

module.exports = messageResponse
