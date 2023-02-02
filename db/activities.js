const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  const { rows: [ activity ] } = await client.query(`
      INSERT INTO activities (name, description) 
      VALUES($1, $2)
      RETURNING *;
    `, [name, description]);

    return activity;
}

async function getAllActivities() {
 
  const {rows } = await client.query(`
  SELECT *
  FROM activities;
  `);
  return rows;
//   // select and return an array of all activities
 }

async function getActivityById(id) {
const {rows: [activity]}= await client.query(`
SELECT *
FROM activities
WHERE id= $1`, [id]);
return activity
}

async function getActivityByName(name) {
  const { rows: [ activity ]} = await client.query(`
  SELECT * FROM activities
  WHERE name= $1
  
`, [name])
return activity
}

// async function attachActivitiesToRoutines(routines) {
//   // select and return an array of all activities
// }

// async function updateActivity({ id, ...fields }) {
//   // don't try to update the id
//   // do update the name and description
//   // return the updated activity
// }

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  //attachActivitiesToRoutines,
  createActivity,
  //updateActivity,
};
