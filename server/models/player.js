module.exports = (Player) => {
  Player.validatesPresenceOf('name');
  Player.validatesLengthOf('name', {
    max: 20,
    message: {
      max: 'Your name is too long',
    },
  });
};
