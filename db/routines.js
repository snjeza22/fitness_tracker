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

  const { rows } = await client.query(`
  SELECT routines.*, duration, count, activities.id AS "activityId", activities.name as "activityName", description, username as "creatorName"
  FROM routines
  JOIN routine_activities ON routines.id = routine_activities."routineId"
  JOIN activities ON activities.id = routine_activities."activityId"
  JOIN users ON "creatorId"= users.id
  
  `)
let routines = attachedActivitiesToRoutines(rows);
  routines = Object.values (routines)
  return routines
}
  //username, from users join, aliased as creatorName
  // skipped includes their activities
  // skipped includes duration and count on activities, from routine_activities join
  //skipped includes the routineId and routineActivityId on activities
  
const attachedActivitiesToRoutines = (routines) => {
  const routinesById = {};
  routines.forEach((routine) => {
    if (!routinesById[routine.id]){
      routinesById[routine.id] = {
        id: routine.id,
        creatorId: routine.creatorId,
        isPublic: routine.isPublic,
        name: routine.name,
        goal: routine.goal,
        activities: [],
      }
    }
    const activity = {
      name: routine.activityName,
      id: routine.activityId,
      description: routine.description,
      count: routine.count,
      duration: routine.duration,
    }
    routinesById[routine.id].activities.push(activity);
  });
  return routinesById;
}
//async function getAllPublicRoutines() {

//}
// async function getAllRoutinesByUser({ username }) {}LEX

// async function getPublicRoutinesByUser({ username }) {}LEX

// async function getPublicRoutinesByActivity({ id }) {}SNJEZANA

// async function updateRoutine({ id, ...fields }) {}

// async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  //getAllPublicRoutines,
  // getAllRoutinesByUser,
  // getPublicRoutinesByUser,
  //getPublicRoutinesByActivity,
  createRoutine,
  //updateRoutine,
  //destroyRoutine,
};
