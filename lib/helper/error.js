class YoutubeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'YoutubeError'
    }
}
exports.YoutubeError = YoutubeError

class WordExtractorError extends Error {
    constructor(message) {
        super(message);
        this.name = 'WordExtractorError'
    }
}
exports.WordExtractorError = WordExtractorError
