import { loginRouter } from './routes/loginRoutes';
import { userRouter } from './routes/userRoutes';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from 'express'

dotenv.config()

const app = express()
app.use(express.json())

const PORT = 3000

app.get('/ping', (_req, res) => {
  console.log('someone pinged here!!2!')
  res.send('pong')
})

app.use('/api/login', loginRouter)

app.use('/api/user', userRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})