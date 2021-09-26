exports.up = (pgm) => {
  // memberikan constraint foreign key pada song_id terhadap kolom id dari tabel songs
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    // menghapus constraint fk_playlistsong.song_id_songs.id pada tabel playlist
    pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.song_id_songs.id');
};
