const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            // call validator
            this._validator.validateSongPayload(request.payload);
            // get data from request payload
            const { title, year, performer, genre, duration } = request.payload;

            // call method
            const songId = await this._service.addSong({ title, year, performer, genre, duration });

            // return a successful response
            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId,
                },
            });

            response.code(201);
            return response;

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

    // get all songs
    async getSongsHandler() {
        // call method
        const songs = await this._service.getSongs();

        // return a successful response
        return {
            status: 'success',
            data: {
                songs: songs.map((song) => ({
                    id: song.id,
                    title: song.title,
                    performer: song.performer
                })),
            },
        };
    }

    // get song by id
    async getSongByIdHandler(request, h) {
        try {
            // get data from request parameter
            const { id } = request.params;

            // call method
            const song = await this._service.getSongById(id);

            // return a successful response
            return {
              status: 'success',
              data: {
                song,
              },
            };

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

    // put note by id
    async putSongByIdHandler(request, h) {
        try {
            // call validator
            this._validator.validateSongPayload(request.payload);
            // get data from request parameter
            const { id } = request.params;

            // call method
            await this._service.editSongById(id, request.payload);

            // return a successful response
            return {
                status: 'success',
                message: 'Lagu berhasil diperbarui',
            };

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

    async deleteSongByIdHandler(request, h) {
        try {
            // get data from request parameter
            const { id } = request.params;

            // call method
            await this._service.deleteSongById(id);

            // return a successfull response
            return {
                status: 'success',
                message: 'Lagu berhasil dihapus',
            }

        // if it fails
        } catch (error) {
            // return a error response
            const response = h.response({
                status: 'fail',
                message: 'Lagu gagal dihapus. Id tidak ditemukan',
            });

            response.code(404);
            return response;
        }
    }
}

module.exports = SongsHandler;
