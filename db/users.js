const client = require("./client");

const errors = require("../errors");
// database functions

// user functions

async function createUser({ username, password }) {
  //console.log("pozvano je CreateUser")
  // step 00: check if password haas less than 8 characters
  if (password.length < 8) {
    //throw new Error ({message:"password must have at least 8 characters"})
    throw new Error(errors.PasswordTooShortError());
  }
  // step 0: check if user name exists
  const results = await getUserByUsername(username);

  if (results && results.username) {
    throw new Error(errors.UserTakenError(username));
  }
  // step 1: create user
  const {
    rows: [user],
  } = await client.query(
    `
      INSERT INTO users(username, password) 
      VALUES($1, $2)
      RETURNING *;
    `,
    [username, password]
  );
  delete user.password;
 
  return user;
}

async function getUser({ username, password }) {
  const sql = `SELECT id, username, password FROM users
      WHERE username = $1 and password = $2`;
  const {
    rows: [user],
  } = await client.query(sql, [username, password]);
  if (user) {
    delete user.password;
  }
  // console.log(user,"user++++++")
  // const token = await jwt.sign(
  //   { id: user.id, username: user.username },
  //   JWT_SECRET,
  //   { expiresIn: "1w" }
  // );

  // const obj = {
  //   token: token,
  //   // user: {
  //   //   //message: "you're logged in!",
  //   //   message: "You have succesfully registred",
  //   //   user: user,
  //   //   token: token,
  //   // },
  // };
  return user;
}

async function getUserById(userId) {
  const {
    rows: [user],
  } = await client.query(
    `
      SELECT id FROM users
      WHERE id = $1
  `,
    [userId]
  );
  return user;
}

async function getUserByUsername(userName) {
  
  const results = await client.query(
    `
      SELECT username FROM users
      WHERE username = $1
  `,
    [userName]
  );
  
  return results.rows[0];
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
