const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {

  const { rows: [ routine ] } = await client.query(`
  INSERT INTO routines ("creatorId", "isPublic", name, goal) 
  VALUES($1, $2, $3, $4)
  RETURNING *;
`, [creatorId, isPublic, name, goal]);

return routine;
}

async function getRoutineById(id) {

  const { rows: [ routine ] } = await client.query(`
      SELECT "creatorId", "isPublic", name, goal
      FROM users
      WHERE id=${ id }
    `);

    return routine;
}

async function getRoutinesWithoutActivities() {

  
const { rows: routine} = await client.query(`
  SELECT * FROM routines
  `);
  return routine
}

// async function getAllRoutines() {

//   const { rows: routine} = await client.query(`
//   SELECT * FROM routines
//   `);
//   return routine
// }

// async function getAllPublicRoutines() {}

// async function getAllRoutinesByUser({ username }) {}

// async function getPublicRoutinesByUser({ username }) {}

// async function getPublicRoutinesByActivity({ id }) {}

// async function updateRoutine({ id, ...fields }) {}

// async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  //getAllRoutines,
  // getAllPublicRoutines,
  // getAllRoutinesByUser,
  // getPublicRoutinesByUser,
  //getPublicRoutinesByActivity,
  createRoutine,
  //updateRoutine,
  //destroyRoutine,
};
