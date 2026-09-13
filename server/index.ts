import 'dotenv/config'
import { createApp } from './app.js'

const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000)

createApp().listen(port, '0.0.0.0', () => {
  console.log(`ElimuBora API running at http://localhost:${port}`)
})
