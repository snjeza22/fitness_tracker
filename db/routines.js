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

async function getAllRoutines() {

  const { rows: routines} = await client.query(`
  SELECT routines.*, duration, count, activities.id  as "activityId", activities.name as activityName, description, username as "creatorName", routine_activities.id as "routineActivityId"
  FROM routines 
  JOIN routine_activities ON routines.id = routine_activities."routineId"
  JOIN activities ON activities.id = routine_activities."activityId"
  JOIN users ON "creatorId" = users.id
  `);
  
  const routineLib = {};
  
  routines.forEach( (rout) => {
    routineLib[rout.id] = rout;  
  } )
  
  const ids = Object.keys(routineLib);
  
  const newRoutines = [];

  ids.forEach(
    (routId) => {
      newRoutines.push(routineLib[routId]);
    } 
  );
  

  
  newRoutines.forEach( (newRoutine) => {
    const matchingIndexes = routines.filter( (r) => {return r.id === newRoutine.id  } );

    newRoutine.activities = [];
    
    matchingIndexes.forEach(
      (activity) => {
        newRoutine.activities.push({
          id: activity.activityId,
          name: activity.activityname,
          description: activity.description,
          creatorName: activity.name,
          count: activity.count,
          duration: activity.duration,
          activityId: activity.activityId,
          routineId: activity.id,
          routineActivityId: activity.routineActivityId
        })
      }
      )
    

  }  );
  
  console.log('NEW ROUTINES', newRoutines);
  
  return newRoutines
}

async function getAllPublicRoutines() {
  const { rows: routine } = await client.query(`
  SELECT routines.*, duration, count, activities.id  as "activityId", activities.name, description, username as "creatorName"
  FROM routines 
  JOIN routine_activities ON routines.id = routine_activities."routineId"
  JOIN activities ON activities.id = routine_activities."activityId"
  JOIN users ON "creatorId" = users.id
  WHERE "isPublic" = true
  `);
  
  return routine
}

// async function getAllRoutinesByUser({ username }) {}

// async function getPublicRoutinesByUser({ username }) {}

// async function getPublicRoutinesByActivity({ id }) {}

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
