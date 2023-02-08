const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const { rows: [addRoutine]   } = await client.query(`
  INSERT INTO routine_activities ("routineId", "activityId", count, duration)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`, [routineId, activityId, count, duration]);
return addRoutine;
}


async function getRoutineActivityById(id) {
  const { rows: [ addRoutine ] } = await client.query(`
  SELECT *
  FROM routine_activities
  WHERE id = ${ id }
`);

return addRoutine;
}//work in progress

// async function getRoutineActivitiesByRoutine({ id }) {}

// async function updateRoutineActivity({ id, ...fields }) {}

// async function destroyRoutineActivity(id) {}

// async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  // getRoutineActivitiesByRoutine,
  // updateRoutineActivity,
  // destroyRoutineActivity,
  // canEditRoutineActivity,
};
