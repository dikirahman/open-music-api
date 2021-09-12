const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class NotesService {
    constructor() {
        this._pool = new Pool();
    }

    // add new song
    async addSong({ title, year, performer, genre, duration }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        // query insert data
        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: [id, title, year, performer, genre, duration, createdAt, updatedAt],
        };

        // run query
        const result = await this._pool.query(query);

        // if fail add notes
        if (!result.rows[0].id) {
            // return fail
            throw new InvariantError('Catatan gagal ditambahkan');
        }

        // return data
        return result.rows[0].id;
    }

    // get all songs
    async getSongs() {
        // run query get data
        const result = await this._pool.query('SELECT * FROM songs');
        // return data and mapping
        return result.rows.map(mapDBToModel);
    }

    // get song by id
    async getSongById(id) {
        // query get data by id
        const query = {
            text: 'SELECT * FROM Songs WHERE id = $1',
            values: [id],
        };
        // run query
        const result = await this._pool.query(query);

        // if note not found
        if (!result.rows.length) {
            // return fail
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        // return data and mapping
        return result.rows.map(mapDBToModel)[0];
    }

    // edit song by id
    async editSongById(id, { title, year, performer, genre, duration }) {
        const updatedAt = new Date().toISOString();

        // query update data
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
            values: [title, year, performer, genre, duration, updatedAt, id],
        };

        // run query
        const result = await this._pool.query(query);

        // if id not found
        if (!result.rows.length) {
            // return fail
            throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan');
        }
    }

    // delete song by id
    async deleteSongById(id) {
        // query delete data
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        // run query
        const result = await this._pool.query(query);

        // if id not found
        if (!result.rows.length) {
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = NotesService;
