const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  const {
    rows: [activity],
  } = await client.query(
    `
      INSERT INTO activities (name, description) 
      VALUES($1, $2)
      RETURNING *;
    `,
    [name, description]
  );

  return activity;
}

async function getAllActivities() {
  const { rows } = await client.query(`
  SELECT *
  FROM activities;
  `);
  return rows;
  //   // select and return an array of all activities
}

async function getActivityById(id) {
  const {
    rows: [activity],
  } = await client.query(
    `
SELECT *
FROM activities
WHERE id= $1`,
    [id]
  );
  return activity;
}

async function getActivityByName(name) {
  const {
    rows: [activity],
  } = await client.query(
    `
  SELECT * FROM activities
  WHERE name= $1
  
`,
    [name]
  );
  return activity;
}

const attachActivitiesToRoutines = (routines) => {
  const routinesById = {};
  routines.forEach((routine) => {
    if (!routinesById[routine.id]) {
      routinesById[routine.id] = {
        id: routine.id,
        creatorId: routine.creatorId,
        isPublic: routine.isPublic,
        name: routine.name,
        goal: routine.goal,

        activities: [],
      };
    }
    const activity = {
      name: routine.activityName,
      id: routine.activityId,
      description: routine.description,
      count: routine.count,
      duration: routine.duration,
      routineActivityId: routine.routineActivityId,
    };

    routinesById[routine.id].activities.push(activity);
  });
  return routinesById;
};
async function updateActivity({ id, ...fields }) {
  console.log("oni su poslali fileds",id, fields)
  if(fields.name && fields.description){
    const result = await client.query(`
    UPDATE activities
    SET "name"='${fields.name}', "description"='${fields.description}'
    WHERE id=${id}
    RETURNING*
    `);
    return result.rows[0]
  }
  
  if(fields.name && !fields.description){
    const result = await client.query(`
    UPDATE activities
    SET "name" ='${fields.name}'
    WHERE id=${id}
    RETURNING*
    `);
    console.log(result)
    return result.rows[0]
  }
  if(!fields.name && fields.description){
    const result = await client.query(`
    UPDATE activities
    SET "description"='${fields.description}'
    WHERE id=${id}
    RETURNING*
    `);
    console.log(result)
    return result.rows[0]
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
