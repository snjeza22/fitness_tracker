const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  
    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(username, password) 
      VALUES($1, $2)
      RETURNING *;
    `, [username, password]);
    delete user.password
    return user;
  }


// async function getUser({ username, password }) {

// }

// async function getUserById(userId) {

// }

 async function getUserByUsername(userName) {
  const { rows: [ user ]} = await client.query(`
      SELECT username, password FROM users
      WHERE id = 3
  `)
  console.log(user, "THIS IS USER")
  return user
 }

module.exports = {
  createUser,
  //getUser,
  //getUserById,
  getUserByUsername,
}
