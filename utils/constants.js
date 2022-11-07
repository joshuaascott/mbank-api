exports.en = {
  CONFIG: {
    MAX_AMOUNT: 5000,
    MBANK_ID: 1,
    MBANK_USERNAME: 'mbank',
    MBANK_EMAIL: 'mbank@mbank.joshux.website',
    GAME_STATE: ['STARTING', 'STARTED', 'STOPPED'],
  },
  ERROR_MSG: {
    AMOUNT_INVALID: (val) => `The amount must be between $1 and $${val}`,
    EMAIL_EXIST: (val) => `The email ${val} is already registered`,
    EMAIL_FORMAT: 'The email format must be correct',
    EMAIL_OR_USER_FORMAT:
      'The username or email must be between 4 and 20 characters',
    GAME_ALIAS_FORMAT: 'The alias must be between 4 and 25 characters',
    GAME_MAX_PLAYERS: 'The game has reached the player max',
    GAME_MIN_PLAYERS: (val) =>
      `The game ${val} needs more players before starting`,
    GAME_EXIST: (val) => `The game ${val} already exist`,
    GAME_ID_FORMAT: 'The game id must be valid',
    GAME_NOT_FOUND: 'The game was not found',
    GAME_PLAYER_START: 'The game must be started by one of the players',
    GAME_PWD_INCORRECT: 'The game password is incorrect',
    GAME_STATUS: (game, status) => `The game ${game} is currently ${status}`,
    ID_IS_NAN: 'The id must be valid. Update your request and retry',
    MBANK_NO_LOGIN: 'The username mbank is not permitted remote login',
    PASSWORD_FORMAT:
      'The password must be 8 - 20 characters (a-z, A-Z, 0-9, special characters)',
    PLAYER_ID_FORMAT: 'The player id must be valid',
    PLAYER_GAME_CREATE: 'The player must be valid to create a game',
    PLAYER_LOCKED_OUT: (val) => `The player ${val} is currently locked out`,
    PLAYER_NOT_IN_GAME: 'You may only send money if you are in the game',
    PLAYER_NOT_FOUND: 'The player was not found',
    PLAYER_RANGE: 'The max players must be between 2 to 10',
    PLAYER_ZERO_BALANCE: 'The sender has no money left in the account',
    RECEIVER_SENDER_SAME: 'The sender and receiver must be different',
    RECEIVER_NOT_FOUND: 'The receiver was not found',
    SENDER_NOT_FOUND: 'The sender was not found',
    TRANS_NOT_FOUND: 'The transaction was not found',
    TRANS_ONLY_FROM:
      'The transaction must be from the bank or player sending money',
    TRANS_ONLY_TO: 'The transaction must be to the bank or another player',
    TOKEN_NOT_CREATED: 'The token was not created',
    USERNAME_EXIST: (val) => `The username ${val} is already registered`,
    USERNAME_FORMAT: 'The username only allows characters a-z and 0-9',
    USER_OR_PWD_INCORRECT: 'The username or password provide is incorrect.',
  },
  MESSAGE: {
    MONEY_SENT: (amount, receiver) => `You sent $${amount} to ${receiver}`,
    YOU_LOSE: 'Sorry, you lost the game',
  },
};
