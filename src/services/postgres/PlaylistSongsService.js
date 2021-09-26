const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapSongs } = require('../../utils');

class playlistSongsService {
    constructor() {
        this._pool = new Pool();
    }

    // add song to playlist
    async addSongToPlaylist(playlistId, songId) {
        const id = `playlistsong-${nanoid(16)}`;

        // add song to table playlistsongs
        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1, $2, $3)',
            values: [id, playlistId, songId],
        };

        // run query
        const result = await this._pool.query(query);
    }

    // get song from playlist
    async getSongsFromPlaylist(playlistId) {
        // get data from table
        const query = {
            text: `SELECT * FROM playlistsongs 
            LEFT JOIN songs ON songs.id = playlistsongs.song_id 
            WHERE playlist_id = $1`,
            values: [playlistId],
        };

        // run query
        const result = await this._pool.query(query);

        return result.rows.map(mapSongs);
    }

    // delete songs
    async deleteSongFromPlaylist(songId, playlistId) {
        // delete data from table
        const query = {
            text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
            values: [songId, playlistId]
        };

        // run query
        const result = await this._pool.query(query);

        // if id not found
        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = playlistSongsService;
