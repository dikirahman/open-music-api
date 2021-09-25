const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapPlaylist } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
    constructor(collaborationService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }

    // add playlist
    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;

         // insert playlists to table
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        // run query
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    // get playlists by owner
    async getplaylists(owner) {
        // get data from table
        const query = {
            text: `SELECT playlists.*, users.username, collaborations.playlist_id, collaborations.user_id
            FROM playlists
            LEFT join collaborations ON collaborations.playlist_id = playlists.id
            LEFT join users ON users.id = playlists.owner WHERE playlists.owner = $1
            OR collaborations.user_id = $1`,
            values: [owner],
        }
        // run query
        const result = await this._pool.query(query);

        return result.rows.map(mapPlaylist);
    }

    // delete playlist by id
    async deletePlaylistById(id) {
        // query delete data
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        // run query
        const result = await this._pool.query(query);

        // if id not found
        if (!result.rows.length) {
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
        }
    }

    // verification playlist owner
    async verifyPlaylistOwner(id, owner) {
        // query get notes by id
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        // run query
        const result = await this._pool.query(query);

        // if playlist not found
        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        // if playlist found
        const playlist = result.rows[0];

        // if playlist is not hers
        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }

            try {
                await this._collaborationService.verifyCollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }
}

module.exports = PlaylistsService;
