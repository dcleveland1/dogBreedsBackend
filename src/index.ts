import { loginRouter } from './routes/loginRoutes';
import { userRouter } from './routes/userRoutes';
import { dogBreedsRouter } from './routes/dogBreedsRoutes';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express'
import cors from 'cors'

dotenv.config()


const app = express()

//const whitelist = [' http://localhost:5173/']
//app.use(cors({ origin: whitelist }))
app.use(cors())
app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const PORT = 3000

app.get('/ping', (_req, res) => {
  console.log('someone pinged here!!2!')
  res.send('pong')
})

app.use('/api/login', loginRouter)

app.use('/api/user', userRouter)

app.use('/api/dog/breeds', dogBreedsRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})