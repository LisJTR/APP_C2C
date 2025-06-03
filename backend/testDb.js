// testDb.js
import { pool } from './db.js'

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()')
    console.log('🟢 Conexión exitosa:', res.rows[0])
  } catch (err) {
    console.error('🔴 Error conectando a la base de datos:', err)
  } finally {
    await pool.end()
  }
}

testConnection()
