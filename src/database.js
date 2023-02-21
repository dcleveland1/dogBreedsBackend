const { promisify } = require('util')
const mysql = require('mysql') // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

require('dotenv').config()

const formatEnvironmentVariable = (env) => {
  console.log(env)
  env = "'" + env + "'"
  return env
}
const pool = mysql.createPool(
  {
    connectionLimit: 10,
    host: 'localhost',
    user: formatEnvironmentVariable(process.env.MYSQL_USER),
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB_NAME
  })

pool.getConnection((err, connection) => {
  if (err) {
    console.log('ERROR', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused')
    }
  }

  if (connection) {
    connection.release()
    console.log('DB is Connected')
  }
})

// Promisify Pool Querys
pool.query = promisify(pool.query)
module.exports = pool
