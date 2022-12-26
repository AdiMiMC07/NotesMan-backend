// import db and connection to database
const connectionMongo = require('./db');
connectionMongo();
// express and other package imports
const express = require('express')
const cors = require('cors')
// app
const app = express()
const port = 8000

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/note', require('./routes/note'))

app.listen(port, () => {
  console.log(`notesman-backend listening on port http://localhost:${port}`)
})