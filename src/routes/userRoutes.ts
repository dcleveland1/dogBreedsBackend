import express from 'express'
import { encryptPassword} from "../lib/helper";
const pool = require('../database')
const jwt = require('jsonwebtoken')
export const userRouter = express.Router()

interface UserType {
  id?: number;
  fullname: string;
  email: string;
  password: string;
}

userRouter.get('/', (_req, res) => {
  res.send('THE LOGIN')
})

userRouter.post('/', async (request, response) => {
  const { body } = request
  const { email, password, fullname } = body
  console.log(body)
  try{
    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0]

    if (user) {
      response.status(401).send({
        error: 'email already in use'
      });
    }
    
    console.log("ANTES1");
    let newUser : UserType = {
      fullname,
      email,
      password
    };
    newUser.password = await encryptPassword(password)
    const result = await pool.query('INSERT INTO users SET ? ', newUser) ;
    console.log("ANTES");
    newUser.id = result.insertId;
    

    const userForToken = {    
      id: newUser.id,
      email: newUser.email
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

    response.status(200).send({
      fullname: newUser.fullname,
      email: newUser.email,
      token
    })
  }catch(error){
    console.log(error.name)
  }
})