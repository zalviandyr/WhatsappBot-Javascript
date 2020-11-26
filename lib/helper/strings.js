const filePath = {
    json: {
        base: './storage/json',
        nsfw: './storage/json/nsfw.json',
        request: './storage/json/request.json',
        report: './storage/json/report.json',
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

    kerangAjaibResponse: {
        apakah: ['Ya', 'Tidak', 'Coba ulangi'],
        kapankah: [
            '1 Hari lagi', '2 Hari lagi', '3 Hari lagi', '4 Hari lagi', '5 Hari lagi', '6 Hari lagi',
            '1 Hari lalu', '2 Hari lalu', '3 Hari lalu', '4 Hari lalu', '5 Hari lalu', '6 Hari lalu',
            '1 Minggu lagi', '2 Minggu lagi', '3 Minggu lagi',
            '1 Minggu lalu', '2 Minggu lalu', '3 Minggu lalu',
            '1 Bulan lagi', '2 Bulan lagi', '3 Bulan lagi', '4 Bulan lagi', '6 Bulan lagi', '8 Bulan lagi', '10 Bulan lagi',
            '1 Bulan lalu', '2 Bulan lalu', '3 Bulan lalu', '4 Bulan lalu', '6 Bulan lalu', '8 Bulan lalu', '10 Bulan lalu',
            'Coba ulangi'
        ],
        // @ akan diganti dengan nomor dari participants
        siapakah: [
            'Yang pasti @', 'Yang pasti bukan @', 'Mungkin @', 'Siapa lagi selain @',
            'Antara @ dengan @'
        ]
    },

    userAgent: 'WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
    ownerNumber: '628xxxxxx@c.us',
    ownerName: '*Grandmaster*',
    apiServer: 'http://zerachiuw.my.id/api',
}
exports.stringValues = stringValues