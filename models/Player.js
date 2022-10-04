const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
  },
  playerName: {
    type: String,
    required: true,
  },
  playerPosition: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Player", PlayerSchema);