const client = require("./client");
//const { getUserByUsername } = require("./users");


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
  

  
  return newRoutines
}
  //username, from users join, aliased as creatorName
  // skipped includes their activities
  // skipped includes duration and count on activities, from routine_activities join
  //skipped includes the routineId and routineActivityId on activities
  

async function getAllPublicRoutines() {
  const routinePbl = await getAllRoutines()
    const publicRoutines = routinePbl.filter((routine)=>{return routine.isPublic == true})
    return publicRoutines
  }


async function getAllRoutinesByUser({ username }) {
  const routinePbl = await getAllRoutines()

    return routinePbl
}

async function getPublicRoutinesByUser({ username }) {
  const routinePbl = await getAllPublicRoutines()
  

    return routinePbl
}

async function getPublicRoutinesByActivity({ id }) {
  const pblAct = await getAllPublicRoutines();
  const filteredRoutines = pblAct.filter((routine)=>{
    let include = false;
    routine.activities.forEach((act)=>{
      if(act.id === id){
        include = true
      }
    })
    return include;
  })
  return filteredRoutines;
}

async function updateRoutine({ id, ...fields }) {
    const keys = Object.keys(fields)
    
    let updateSQL = "UPDATE routines SET "
    for (let i = 0; i<keys.length; i++){
      let comma = ","
      if (i===keys.length-1){comma = ""}
      updateSQL = updateSQL + `"${keys[i]}"='${fields[keys[i]]}'${comma}`
      }
      updateSQL = updateSQL + " WHERE id=$1;"
    await client.query(updateSQL, [id]);
    const selectSQL = "SELECT * FROM routines WHERE id=$1"
    const { rows: routine} = await client.query(selectSQL,[id])
   return routine[0]
  
       
} 

async function destroyRoutine(id) {
  await client.query(`DELETE FROM routine_activities WHERE "routineId"=${id}`)
  await client.query(`DELETE FROM routines WHERE id= ${id}`)
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
