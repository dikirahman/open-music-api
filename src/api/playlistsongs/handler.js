const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
    constructor(playlistSongsService, playlistsService, validator) {
        this._service = playlistSongsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.addSongToPlaylistHandler = this.addSongToPlaylistHandler.bind(this);
        this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
        this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
    }

    // add song to playlist
    async addSongToPlaylistHandler(request, h) {
        try {
            // call validator
            this._validator.validatePlaylistSongPayload(request.payload);
            // get data from request parameter
            const { playlistId } = request.params;
            // get user id from creadential
            const { id: credentialId } = request.auth.credentials;
            const { songId } = request.payload;

            // verify playlists owner
            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

            // add song to playlist
            await this._service.addSongToPlaylist(playlistId, songId);

            // return a successful response

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan ke playlist',
            });

            response.code(201);
            return response;
        } catch (error) {
            // return a error response
            if (error instanceof ClientError) {
                const response = h.response({
                status: 'fail',
                message: error.message,
                });

                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });

            response.code(500);
            console.error(error);
            return response;
        }
    }

    // get songs from playlist
    async getSongsFromPlaylistHandler(request, h) {
        try {
            // get data from request parameter
            const { playlistId } = request.params;
            // get user id from credential
            const { id: credentialId } = request.auth.credentials;

            // verify playlist owner
            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

            // get songs
            const songs = await this._service.getSongsFromPlaylist(playlistId);

            return {
                status: 'success',
                data: {
                  songs,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });

                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });

            response.code(500);
            console.error(error);
            return response;
        }
    }

    // delete songs from playlist
    async deleteSongFromPlaylistHandler(request, h) {
        try {
            // get data from request parameter
            const { playlistId } = request.params;
            const { songId } = request.payload;
            // get user id from credential
            const { id: credentialId } = request.auth.credentials;

            // verify playlist owner
            await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

            // get songs
            const songs = await this._service.deleteSongFromPlaylist(songId, playlistId);

            // return a successfull response
            return {
                status: 'success',
                message: 'Lagu berhasil dihapus',
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });

                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });

            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = PlaylistSongsHandler;
