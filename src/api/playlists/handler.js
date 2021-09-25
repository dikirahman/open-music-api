const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
    constructor(playlistsService, validator) {
        this._service = playlistsService;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    }

    // post playlist
    async postPlaylistHandler(request, h) {
        try {
            // validate payload
            this._validator.validatePlaylistPayload(request.payload);

            // get user id from credentials
            const { id: credentialId } = request.auth.credentials;

            // get name from payload
            const { name } = request.payload;

            // add playlist
            const playlistId = await this._service.addPlaylist({
                name, owner: credentialId
            });

            const response = h.response({
                status: 'success',
                message: 'Playlist berhasil ditambahkan',
                data: {
                  playlistId,
                },
            });

            response.code(201);
            return response;
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

    // get notes by owner
    async getPlaylistsHandler(request) {
        // get user id from credential
        const { id: credentialId } = request.auth.credentials;
        // get note
        const playlists = await this._service.getplaylists(credentialId);

        // return a successful response
        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async deletePlaylistByIdHandler(request, h) {
        try {
            // get data from request parameter
            const { id } = request.params;
            // get user id from credential
            const { id: credentialId } = request.auth.credentials;

            // verify owner
            await this._service.verifyPlaylistOwner(id, credentialId);
            // delete playlist
            await this._service.deletePlaylistById(id);

            // return a successfull response
            return {
                status: 'success',
                message: 'Playlist berhasil dihapus',
            }
        // if it fails
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
}

module.exports = PlaylistsHandler;
