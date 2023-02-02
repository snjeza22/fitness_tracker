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
      WHERE id= ${ id }
    `);

    return routine;
}

async function getRoutinesWithoutActivities() {

  
const { rows: routine} = await client.query(`
  SELECT * FROM routines
  `);
  return routine
}

async function getAllRoutines() {

  const { rows: routine} = await client.query(`
  SELECT routines.*, duration, routine_activities.count, activities.id AS "activityId", activities.name, description, username as creatorName
  FROM routines
  JOIN routine_activities ON routines.id=routine_activities."routineId"
  JOIN activities ON routine_activities."activityId"=activities.id
  JOIN users ON users.id=routines."creatorId"
  WHERE "isPublic" IN (true, false)
  `);

  //username, from users join, aliased as creatorName
  // skipped includes their activities
  // skipped includes duration and count on activities, from routine_activities join
  //skipped includes the routineId and routineActivityId on activities
  return routine
}

async function getAllPublicRoutines() {
  const { rows: routine} = await client.query(`
SELECT * FROM routines
  WHERE "isPublic" = true
`);
return routine
}
// async function getAllRoutinesByUser({ username }) {}LEX

// async function getPublicRoutinesByUser({ username }) {}LEX

// async function getPublicRoutinesByActivity({ id }) {}SNJEZANA

// async function updateRoutine({ id, ...fields }) {}

// async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  // getAllRoutinesByUser,
  // getPublicRoutinesByUser,
  //getPublicRoutinesByActivity,
  createRoutine,
  //updateRoutine,
  //destroyRoutine,
};
