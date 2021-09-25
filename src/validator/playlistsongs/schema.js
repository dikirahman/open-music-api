const Joi = require('joi');

// objek schema
const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistSongPayloadSchema };
