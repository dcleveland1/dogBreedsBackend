import express from 'express'
import bcrypt from "bcrypt";
const pool = require('../database');
import jwt from 'jsonwebtoken';
export const loginRouter = express.Router()
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import



dotenv.config()

loginRouter.get('/', (_req, res) => {
  res.send('THE LOGIN')
})

loginRouter.post('/', async (request, response) => {
  const { body } = request
  const { email, password } = body
  const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

  let user;

  user = rows[0]
  if (user){

    const passwordCorrect = await bcrypt.compare(password, user.password)
    if(!passwordCorrect) {
      console.log("Error password incorrect")
      return response.status(403).json({
        error: 'invalid user or password',
        status: 403,
        data: ''
      })
    }else{
      console.log(user);
      const userForToken = {
        id: user.id,
        email: user.email
      }
      console.log(userForToken, "----------2---");
      const sec = process.env.SECRET_q
      const token = jwt.sign(
        userForToken,
        sec!,
        {
          expiresIn: 60 * 60 * 24 * 7
        }
      )
      console.log(userForToken)
  
      return response.status(200).json({
        error: '',
        status: 200,
        data: {
          user: {
            name: user.name,
            email: user.email,
            token

          }
        }
      })

    }
    
  }else{
    console.log("user not found")
    return response.status(403).json({
      error: 'invalid user or password',
      status: 403,
      data: ''
    })
  }
})