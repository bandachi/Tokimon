const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const VIEWS = path.join(__dirname, 'views');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

express()
  .set('views', VIEWS)
  .set('view engine', 'ejs')
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => res.render('information'))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM tokimon');
      const results = { 'results': (result) ? result.rows : null};
      res.render('db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
