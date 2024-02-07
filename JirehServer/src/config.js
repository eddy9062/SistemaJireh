import { config } from 'dotenv'

config()

export const PORT = process.env.NODE_LOCAL_PORT || 3000
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_LOCAL_PORT = process.env.DB_LOCAL_PORT || 3306
export const DB_USER = process.env.DB_USER || 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'Admin123*'
export const DB_DATABASE = process.env.DB_DATABASE || 'jirehdb'
export const SECRET = process.env.SECRET || 'secretkeyjireh'

//console.log(process.env.PORT)