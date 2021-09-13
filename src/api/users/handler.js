const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;

      this.postUserHandler = this.postUserHandler.bind(this);
    }

    // post user
    async postUserHandler(request, h) {
        try {
            // run validator
            this._validator.validateUserPayload(request.payload);

            const { username, password, fullname } = request.payload;

            // run method addUser
            const userId = await this._service.addUser({ username, password, fullname });

            const response = h.response({
                status: 'success',
                message: 'User berhasil ditambahkan',
                data: {
                  userId,
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
        }

        const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
        });

        response.code(500);
        console.error(error);
        return response;
    }
}

module.exports = UsersHandler;
