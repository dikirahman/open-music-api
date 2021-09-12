const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    constructor() {
        this._songs = [];
    }

    // add new songs
    addSong({ title, year, performer, genre, duration }) {
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const newSong = {
            title, year, performer, genre, duration, id, insertedAt, updatedAt,
        };

        this._songs.push(newSong);

        const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

        if (!isSuccess) {
           throw new InvariantError('Lagu gagal ditambahkan');
        }

        return id;
    }

    // get all songs
    getSongs() {
        return this._songs;
    }

    // get song by id
    getSongById(id) {
        const song = this._songs.filter((n) => n.id === id)[0];

        if (!song) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }
        return song;
    }

    // edit song by id
    editSongById(id, { title, year, performer, genre, duration }) {
        const index = this._songs.findIndex((song) => song.id === id);

        if (index === -1) {
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }

        const updatedAt = new Date().toISOString();

        this._songs[index] = {
            ...this._songs[index],
            title,
            year,
            performer,
            genre,
            duration,
            updatedAt,
        };
    }

    // delete song by id
    deleteSongById(id) {
        const index = this._songs.findIndex((song) => song.id === id);

        if (index === -1) {
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
        }
        this._songs.splice(index, 1);
    }
}

module.exports = SongsService;
