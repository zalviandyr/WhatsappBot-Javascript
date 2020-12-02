const filePath = {
    json: {
        base: './storage/json',
        nsfw: './storage/json/nsfw.json',
        request: './storage/json/request.json',
        report: './storage/json/report.json',
        tugas: './storage/json/tugas.json',
    },
    log: {
        base: './storage/log',
        logText: './storage/log/log.txt'
    },
    media: {
        base: './storage/media',
        about: './storage/media/about.jpg',
        inori: './storage/media/inori.jpg'
    }
}
exports.filePath = filePath

const stringValues = {
    switch: {
        list: ['on', 'off'],
        on: 'on'
    },

    kerangAjaibResponse: {
        apakah: ['Ya', 'Tidak', 'Coba ulangi'],
        kapankah: [
            '1 Hari lagi', '2 Hari lagi', '4 Hari lagi', '6 Hari lagi',
            '1 Minggu lagi', '2 Minggu lagi', '3 Minggu lagi',
            '1 Bulan lagi', '2 Bulan lagi', '4 Bulan lagi', '6 Bulan lagi', '8 Bulan lagi', '10 Bulan lagi',
            'Tidak pernah', 'Mungkin lain waktu', 'Mungkin di waktu dimensi lain', 'Mungkin tunggu diazab',
        ],
        // # akan diganti dengan nomor dari participants
        siapakah: [
            'Yang pasti #', 'Yang pasti bukan #', 'Mungkin #', 'Siapa lagi selain #',
            'Antara # dengan #', 'Tidak ada',
        ]
    },

    userAgent: 'WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
    ownerNumber: '628xxxxxx@c.us',
    ownerName: '*Grandmaster*',
    apiServer: 'http://zerachiuw.my.id/api',
}
exports.stringValues = stringValues