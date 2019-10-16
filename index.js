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
  .use(express.json())
  .use(express.urlencoded({ extended: false }))

  .get('/', (req, res) => {
    var tokiQuery = `SELECT * FROM tokimon`;

    pool.query(tokiQuery, (error, result) => {
      if (error) {
        res.end(error);
      }
      var results = {'tokimon':result.rows};
      res.render('pages/information', results)
    })
  })
  .post('/', (req, res) => {
    var parameter = encodeURIComponent(req.body.parameter);
    var order = encodeURIComponent(req.body.order);
    res.redirect('/sorted?parameter=' + parameter + '&order=' + order);
  })

  .get('/sorted', (req, res) => {
    var parameter = req.query.parameter;
    var order = req.query.order;
    console.log(parameter);
    console.log(order);
    var tokiQuery = `SELECT * FROM tokimon ORDER BY ${parameter} ${order}`;
    console.log(tokiQuery);

    pool.query(tokiQuery, (error, result) => {
      if (error) {
        res.end(error);
      }
      var results = {'tokimon':result.rows};
      res.render('pages/information', results)
    })
  })

  // .get('/sorted', (req, res) => {
  //   var tokiQuery = `SELECT * FROM tokimon ORDER BY ${req.session.user.parameter} ${req.session.body.order}`;
  //   console.log(tokiQuery);
  //
  //   pool.query(tokiQuery, (error, result) => {
  //     if (error) {
  //       res.end(error);
  //     }
  //     var results = {'tokimon':result.rows};
  //     res.render('pages/information', results)
  //   })
  // })

  .get('/add', (req, res) => {
    res.render('pages/add');
  })
  .post('/add', (req, res) => {
    //console.log(req.body);

    var weight = parseFloat(req.body.weight);
    var height = parseFloat(req.body.height);
    var fly = parseInt(req.body.fly);
    var fight = parseInt(req.body.fight);
    var fire = parseInt(req.body.fire);
    var water = parseInt(req.body.water);
    var electric = parseInt(req.body.electric);
    var ice = parseInt(req.body.ice);

    var total = fly + fight + fire + water + electric + ice;

    var tokiQuery = `INSERT INTO tokimon VALUES (DEFAULT,
      '${req.body.tokiName}', ${weight}, ${height}, ${fly}, ${fight}, ${fire},
      ${water},  ${electric}, ${ice}, ${total}, '${req.body.trainer}')
      RETURNING id;`;

    pool.query(tokiQuery, (error, result) => {
      if (error) {
        res.end(error);
      }
      var results = result.rows[0];
      res.redirect(`/tokimon/${results.id}`)
    })
  })

  .get('/change/:id', (req, res) => {
    var tokiIDQuery = `SELECT * FROM tokimon WHERE id=${req.params.id};`;

    pool.query(tokiIDQuery, (error, result) => {
      if (error) {
        res.end(error);
      }
      var tokimon = {'tokimon':result.rows[0]};
      res.render('pages/change', tokimon)
    })
  })

  .post('/change/:id', (req, res) => {
    //console.log(req.body);

    var weight = parseFloat(req.body.weight);
    var height = parseFloat(req.body.height);
    var fly = parseInt(req.body.fly);
    var fight = parseInt(req.body.fight);
    var fire = parseInt(req.body.fire);
    var water = parseInt(req.body.water);
    var electric = parseInt(req.body.electric);
    var ice = parseInt(req.body.ice);

    var total = fly + fight + fire + water + electric + ice;

    var tokiQuery = `UPDATE tokimon SET
      name='${req.body.tokiName}', weight = ${weight}, height = ${height},
      fly = ${fly}, fight = ${fight}, fire = ${fire}, water = ${water},
      electric = ${electric}, ice = ${ice}, total = ${total},
      trainer = '${req.body.trainer}' WHERE id = ${req.params.id} RETURNING id;`;

    //console.log(tokiQuery);

    pool.query(tokiQuery, (error, result) => {
      if (error) {
        res.end(error);
      }
      var results = result.rows[0];
      res.redirect(`/tokimon/${results.id}`)
    })
  })

  .get('/tokimon/:id', (req, res) => {
    var tokiIDQuery = `SELECT * FROM tokimon WHERE id=${req.params.id};`;

    pool.query(tokiIDQuery, (error, result) => {
      if (error) {
        res.end(error);
      }
      var tokimon = {'tokimon':result.rows[0]};
      res.render('pages/tokimon', tokimon)
    })
  })

  .post('/delete/:id', (req, res) => {
    //console.log(req.params.id);
    var tokiIDQuery = `DELETE FROM tokimon WHERE id=${req.params.id};`;
    pool.query(tokiIDQuery, (error, result) => {
      if (error) {
        res.end(error);
      }
      res.redirect('/');
    })
  })

  .get('/display', (req, res) => {
    var tokiQuery = `Select * FROM tokimon`;

    pool.query(tokiQuery, (error, result) => {
      if (error) {
        res.end(error);
      }
      var results = {'tokimon':result.rows};
      res.render('pages/display', results)
    })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
