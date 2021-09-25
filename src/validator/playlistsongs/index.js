const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistSongPayloadSchema } = require('./schema');

// validation function
const PlaylistSongsValidator = {
    // validation and evaluate whether the validation was successful or not
    validatePlaylistSongPayload: (payload) => {
        const validationResult = PlaylistSongPayloadSchema.validate(payload);

        // if validation error, not undefined
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistSongsValidator;
