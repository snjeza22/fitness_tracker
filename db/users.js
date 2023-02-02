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


async function getUser({ username, password }) {
    const sql = `SELECT username, password FROM users
      WHERE username = $1 and password = $2`
    const { rows: [ user ]} = await client.query(sql,[username,password])
    if (user){
  delete user.password
      }
  return user
 }

 async function getUserById(userId) {
  const { rows: [ user ]} = await client.query(`
      SELECT id FROM users
      WHERE id = $1
  `, [userId])
  return user
 }
 

 async function getUserByUsername(userName) {
  const { rows: [ user ]} = await client.query(`
      SELECT username, password FROM users
      WHERE username = $1
  `, [userName])
  return user
 }

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
