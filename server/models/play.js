const moment = require('moment');
const _ = require('lodash');
const logger = require('winston');

const app = require('../../server/server');

module.exports = (Play) => {
  Play.validatesPresenceOf('score');

  // Play.submit = async (data, cb) => {
  //   const Player = app.models.Player;
  //   const tx = await Play.beginTransaction({
  //     isolationLevel: Play.Transaction.READ_COMMITTED,
  //   });
  //   try {
  //     let player = await Player.findOne({
  //       where: {
  //         name: data.name,
  //       },
  //     });
  //     if (_.isNil(player)) {
  //       player = {
  //         name: data.name,
  //         playCount: 0,
  //         highestScore: 0,
  //       };
  //     }
  //     player.highestScore = (data.score > player.highestScore) ? data.score : player.highestScore;
  //     player.playCount += 1;
  //     player = await Player.upsert(player, {
  //       transaction: tx,
  //     });
  //     const playInput = {
  //       submitTime: moment().utc(),
  //       score: data.score,
  //     };
  //     const play = await player.plays.create(playInput, {
  //       transaction: tx,
  //     });
  //     await tx.commit();
  //     logger.info(`score persisted successfully = ${JSON.stringify(play)}`);
  //     cb(null, {
  //       play,
  //     });
  //   } catch (e) {
  //     await tx.rollback();
  //     throw e;
  //   }
  // };

  // This is for in-memory database
  Play.submit = async (data, cb) => {
    const Player = app.models.Player;
    try {
      let player = await Player.findOne({
        where: {
          name: data.name,
        },
      });
      if (_.isNil(player)) {
        player = {
          name: data.name,
          playCount: 0,
          highestScore: 0,
        };
      }
      player.highestScore = (data.score > player.highestScore) ? data.score : player.highestScore;
      player.playCount += 1;
      player = await Player.upsert(player);
      const playInput = {
        submitTime: moment().utc(),
        score: data.score,
      };
      const play = await player.plays.create(playInput);
      logger.info(`score persisted successfully = ${JSON.stringify(play)}`);
      cb(null, {
        play,
      });
    } catch (e) {
      throw e;
    }
  };
  const submit = {
    description: 'Submit the score to the system',
    accepts: [{
      arg: 'playDto',
      description: 'Model instance data',
      type: 'object',
      http: {
        source: 'body',
      },
      required: true,
      default: `
        {
          "name": "bank",
          "score": 40
        }
        `,
    }],
    http: {
      path: '/submit',
      verb: 'post',
    },
    returns: {
      arg: 'data',
      type: 'object',
    },
  };
  Play.remoteMethod('submit', submit);
};
