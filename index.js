const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const VIEWS = path.join(__dirname, 'views');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

express()
  .set('views', VIEWS)
  .set('view engine', 'html')
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => res.sendFile('calculator.html', { root : VIEWS }))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
