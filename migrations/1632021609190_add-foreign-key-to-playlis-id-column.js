/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // memberikan constraint foreign key pada playlist_id terhadap kolom id dari tabel playlists
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    // menghapus constraint fk_playlistsongs.playlist_id_playlists.id pada tabel playlistsongs
    pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.playlist_id_playlists.id');
};
