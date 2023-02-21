import express from 'express'
import { encryptPassword} from "../lib/helper";
const pool = require('../database')
const jwt = require('jsonwebtoken')
export const userRouter = express.Router()

interface UserType {
  id?: number;
  fullname: string;
  username: string;
  password: string;
}

userRouter.get('/', (_req, res) => {
  res.send('THE LOGIN')
})

userRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, password, fullname } = body
  console.log(body)
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  const user = rows[0]

  if (user) {
    return response.status(401).json({
      error: 'Username already in use'
    });
  }
  
  console.log("ANTES1");
  let newUser : UserType = {
    fullname,
    username,
    password
  };
  newUser.password = await encryptPassword(password)

  const result = await pool.query('INSERT INTO users SET ? ', newUser) ;
  console.log("ANTES");
  newUser.id = result.insertId;
  

  const userForToken = {    
    id: newUser.id,
    username: newUser.username
  }
  console.log(userForToken);
  const token = jwt.sign(
    userForToken,
    process.env.SECRET_q,
    {
      expiresIn: 60 * 60 * 24 * 7
    }
  )
  console.log(token)

  return response.status(200).json({
    fullname: newUser.fullname,
    username: newUser.username,
    token
  })
})