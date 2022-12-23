const connectionMongo = require('./db');
connectionMongo();

const express = require('express')
const app = express()
const port = 8000

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/note', require('./routes/note'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})