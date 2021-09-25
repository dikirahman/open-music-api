/* eslint-disable max-len */
const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    // post collaboration
    async postCollaborationHandler(request, h) {
        try {
            // validate payload
            this._validator.validateCollaborationPayload(request.payload);

            // get user id from creadentials
            const { id: credentialId } = request.auth.credentials;

            // get note id and user id from payload
            const { playlistId, userId } = request.payload;

            // verify note owner
            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

            // add collaboration
            const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

            const response = h.response({
                status: 'success',
                message: 'Kolaborasi berhasil ditambahkan',
                data: {
                  collaborationId,
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

    // delete collaboration
    async deleteCollaborationHandler(request, h) {
        try {
          // validate payload
          this._validator.validateCollaborationPayload(request.payload);

          // get user id from credentials
          const { id: credentialId } = request.auth.credentials;

          // get note id and user id from payload
          const { playlistId, userId } = request.payload;

          // verify note owner
          await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

          // delete collaboration
          await this._collaborationsService.deleteCollaboration(playlistId, userId);

          return {
            status: 'success',
            message: 'Kolaborasi berhasil dihapus',
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
}

module.exports = CollaborationsHandler;
