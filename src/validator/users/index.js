const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadSchema } = require('./schema');

// validation function
const UsersValidator = {
    // validation and evaluate whether the validation was successful or not
    validateUserPayload: (payload) => {
        const validationResult = UserPayloadSchema.validate(payload);

        // if validation error, not undefined
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = UsersValidator;
