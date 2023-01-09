const mongoose = require("mongoose");
const AllPlayers = require("../models/AllPlayers")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });


    // const result = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
    // const players =  await result.json()
    // const currentPlayerList = players.league.standard
    
    // await AllPlayers.insertMany(currentPlayerList)
    // console.log('all players added')
    // const result = await fetch("https://api.sportradar.com/nba/trial/v7/en/league/free_agents.json?api_key=nvw29fxe8j7t27fhcu2n7sj5")
    // const players =  await result.json()
    // const currentPlayerList = players.free_agents
    
    // await AllPlayers.insertMany(currentPlayerList)
    // console.log('all players added')

    // await AllPlayers.deleteMany({})
    // console.log(conn.collection('allplayers'))
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
