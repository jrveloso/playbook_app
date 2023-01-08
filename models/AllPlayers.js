const mongoose = require("mongoose");

const AllPlayersSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
  });

module.exports = mongoose.model("AllPlayers", AllPlayersSchema);