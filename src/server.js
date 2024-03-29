// import dotenv and run the configuration
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// playlistsongs
const playlistsongs = require('./api/playlistsongs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongsValidator = require('./validator/playlistsongs');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const init = async () => {
    // create collaborationService instance from CollaborationsService
    const collaborationsService = new CollaborationsService();
    // notesService instance
    const songsService = new SongsService();
    // usersService instance
    const usersService = new UsersService();
    // authenticationsService instance
    const authenticationsService = new AuthenticationsService();
    // playlistsService instantance
    const playlistsService = new PlaylistsService(collaborationsService);
    // playlistSongsService instance
    const playlistSongsService = new PlaylistSongsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // register plugin external
    await server.register([
        {
            plugin: Jwt,
        },
    ]);

    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });
    // register songs plugin with options.service
    await server.register([
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: users,
            options: {
              service: usersService,
              validator: UsersValidator,
            },
        },
        {
            plugin: authentications,
            options: {
              authenticationsService,
              usersService,
              tokenManager: TokenManager,
              validator: AuthenticationsValidator,
            },
        },
        {
            plugin: playlists,
            options: {
              service: playlistsService,
              validator: PlaylistsValidator,
            },
        },
        {
            plugin: playlistsongs,
            options: {
              playlistSongsService,
              playlistsService,
              validator: PlaylistSongsValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
              collaborationsService,
              playlistsService,
              validator: CollaborationsValidator,
            },
        },
    ]);
    await server.start();

    console.log(`Server berjalan pada ${server.info.uri}`);
    };

init();
