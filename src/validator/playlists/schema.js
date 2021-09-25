const Joi = require('joi');

// objek schema
const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { PlaylistPayloadSchema };
