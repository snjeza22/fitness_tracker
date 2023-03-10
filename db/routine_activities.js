const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const {
    rows: [addRoutine],
  } = await client.query(
    `
  INSERT INTO routine_activities ("routineId", "activityId", count, duration)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`,
    [routineId, activityId, count, duration]
  );
  return addRoutine;
}

async function getRoutineActivityById(id) {
  const {
    rows: [addRoutine],
  } = await client.query(`
  SELECT *
  FROM routine_activities
  WHERE id = ${id}
`);

  return addRoutine;
} //work in progress

async function getRoutineActivitiesByRoutine({ id }) {
  const { rows } = await client.query(`
  SELECT *
  FROM routine_activities
  WHERE "routineId" = ${id}
`);

  return rows;
}

async function updateRoutineActivity({ id, ...fields }) {
  const keys = Object.keys(fields);

  let updateSQL = "UPDATE routine_activities SET ";
  for (let i = 0; i < keys.length; i++) {
    let comma = ",";
    if (i === keys.length - 1) {
      comma = "";
    }
    updateSQL = updateSQL + `"${keys[i]}"='${fields[keys[i]]}'${comma}`;
  }
  updateSQL = updateSQL + " WHERE id=$1;";
  await client.query(updateSQL, [id]);
  const selectSQL = "SELECT * FROM routine_activities WHERE id=$1";
  const { rows: routine } = await client.query(selectSQL, [id]);
  return routine[0];
}

async function destroyRoutineActivity(id) {
  const p = await client.query(
    `DELETE FROM routine_activities WHERE "routineId"= ${id} RETURNING * `
  );
  
  //return p.rows[0]
  if (p.rows[0] && p.rows[0].id) {
    return p.rows[0];
  }
  //console.log("id",id)
}

async function canEditRoutineActivity(routineActivityId, userId) {
  if (routineActivityId === userId) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
