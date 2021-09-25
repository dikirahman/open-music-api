/* eslint-disable no-restricted-globals */
const mapDBToModel = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    inserted_at,
    updated_at
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt: inserted_at,
    updatedAt: updated_at,
});

const mapPlaylist = ({
    id,
    name,
    username
}) => ({
    id,
    name,
    username
});

const mapSongs = ({
    id,
    title,
    performer
}) => ({
    id,
    title,
    performer
});

module.exports = { mapDBToModel, mapPlaylist, mapSongs };
