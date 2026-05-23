import 'dotenv/config'

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbName = process.env.DB_NAME

export {
  dbUser,
  dbPassword, 
  dbHost, 
  dbName
}