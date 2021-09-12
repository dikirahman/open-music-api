const InvariantError = require('../../exceptions/InvariantError');
const { SongPayloadSchema } = require('./schema');

// validation function
const SongsValidator = {
    // validation and evaluate whether the validation was successful or not
    validateSongPayload: (payload) => {
        const validationResult = SongPayloadSchema.validate(payload);

        // if validation error, not undefined
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = SongsValidator;
