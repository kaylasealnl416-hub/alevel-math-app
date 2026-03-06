import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config({ path: '.env.local' })

export default defineConfig({
  schema: './src/db/schema.js',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
