const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
let database = null;
const initializeDbAndServer = async () => {
    try {
        database = await open({ filename: dbPath, driver: sqlite3.Database });
        app.listen(3001, () => {
            console.log("Server Is running on http://localhost:3001");
        });

    } catch (error) {
        console.log(`Data base Error is ${error}`);
        process.exit(1);
    }
};
initializeDbAndServer();

//API 1 - GET

const convertDbObject = (objectItem) => {
    return {
        playerId : objectItem.player_id,
        playerName : objectItem.player_name,
        jerseyNumber : objectItem.jersey_number,
        role : objectItem.role,
    };
};

app.get("/players/", async (request,response) => {
    const getPlayersQuery = `select * from cricket_team`;
    const getPlayersQueryResponse = await database.all(getPlayersQuery);
    response.send(
        getPlayersQueryResponse.map((eachPlayer) => convertDbObject(eachPlayer))
    );
});

//API 2 - POST

app.post("/players/", async (request,response) => {
    const { playerName,jerseyNumber, role} = request.body;
    const createPlayerQuery = `
    insert into create_team(player_name, jersey_number, role)
    values('${playerName}', ${jerseyNumber}, '${role}');
    `;
    await database.run(createPlayerQuery);
    response.send('Player Added to Team');
});

//API 3 - GET

app.get("/players/:playerId/", async (request, response) => {
    const { playerId } = request.params;
    const getPlayerDetailsQuery = `select * from cricket_team where player_id = ${playerId};`;
    const getPlayerDetailsQueryResponse = await database.get(
        getPlayerDetailsQuery
    );
    response.send(convertDbObject(getPlayerDetailsQueryResponse));
});

//API 4 - PUT

app.put("/players/:playerId", async (request, response) => {
    const { playerId } = request.params;
    const { playerName, jerseyNumber, role } = request.body;
    const updatePlayerDetailsQuery = `update cricket_team set player_name = '${playerName}',
    jersey_number = ${jerseyNumber} , role = '${role}'
    where player_id = ${playerId}; `;
    await database.run(updatePlayerDetailsQuery);
    response.send("Player Details Updated");
});

//API 5 - DELETE

app.delete("/players/:playerId/", async (request, response) => {
    const { playerId } = request.params;
    const deletePlayerQuery = `
    DELETE FROM 
    cricket_team
    WHERE
    player_id = ${playerId};
    `;
    await database.run(deletePlayerQuery);
    response.send("Player Removed");
});

module.exports = app;












