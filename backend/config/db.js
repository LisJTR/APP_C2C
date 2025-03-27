import pkg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

console.log('DATABASE_URL:', process.env.DATABASE_URL) //  Agregado para ver si se lee

const { Pool } = pkg

 const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
export default pool;