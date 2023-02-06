const client = require("./client");
//const { getUserByUsername } = require("./users");
const { attachActivitiesToRoutines} =require("./activities")

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
  SELECT routines.*, duration, count, activities.id AS "activityId", activities.name as "activityName", routine_activities.id AS “routineActivityId”, description, users.username as "creatorName"
  FROM routines
  JOIN routine_activities ON routines.id = routine_activities."routineId"
  JOIN activities ON activities.id = routine_activities."activityId"
  JOIN users ON "creatorId"= users.id
  
  `)
//Lex
// const routineLib = {};
// routines.forEach( (rout)=>{
// routineLib[rout.id] = rout;
// });
// const ids = Object.keys (routineLib);
// const newRoutines = [];

// ids.forEach(
//   (routId) =>{
//     newRoutines.push(routineLib[routId]);
//   }
// );
// newRoutines.forEchh((newRoutine) => {
//   const matchingindex = routines.filter ((r)=> {return r.id === newRoutine.id});
//   newRoutine.activities = [];

//   matchingindex.forEach(
//     (activity) => {
//       newRoutine.activities.push({
//         id: activity.activityId,
//     name: activity.activityName,
//     description: activity.description,
//     creatorName: activity.name,
//     count: activity.count,
//     duration: activity.duration,
//     activityId:activity.activityId,
//     rroutineId: activity.id,
//     routineActivityId: activity.routineActivityId
//       })
//     }
//   )
// });
// return newRoutines;
// }
//Snjeza
let routines = attachActivitiesToRoutines(rows);
  routines = Object.values (routines)
  return routines;
}
  //username, from users join, aliased as creatorName
  // skipped includes their activities
  // skipped includes duration and count on activities, from routine_activities join
  //skipped includes the routineId and routineActivityId on activities
  


async function getAllPublicRoutines() {
  const { rows: routines} = await client.query(`
  SELECT * FROM routines
  WHERE "isPublic"= true;`);
  return routines
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
