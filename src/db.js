import { createPool } from 'mysql2/promise'
import { DB_HOST, DB_USER, DB_PASSWORD, DB_LOCAL_PORT, DB_DATABASE } from './config.js' //que no se olvide el .js

export const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_LOCAL_PORT,
    database: DB_DATABASE
})