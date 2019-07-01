const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/data', (req, res) => {
    pool.query(`SELECT * FROM
    "pins" FULL JOIN "meetups" ON "pins"."pin_id" = "meetups"."ref_pin_id"
    ORDER BY "pins"."pin_id";`)
        .then(result => {
            res.send(result.rows);
        })
        .catch( error => {
            res.sendStatus(500);
            console.log('Error in getting pins', error);
        })
  })
  
  router.post('/add-meetup', (req, res) => {
    const queryText = `INSERT INTO "meetups" ("ref_pin_id", "organized_by", "date", "time", "supplies") VALUES
                        ($1, $2, $3, $4, $5);`
    pool.query(queryText, [req.body.pinId, req.body.userId, '7-6-2019', '10:00', 'trash bags, drinks, rubber gloves'])
        .then( result => {
            res.sendStatus(200)
        })
        .catch( error => {
            console.log('Error in posting to meetup table', error);
            res.sendStatus(500);
        })
  })
  
  router.post('/pins', (req, res) => {
    const queryText = `INSERT INTO "pins" ("longitude", "latitude", "description", "ref_created_by") VALUES
    ($1, $2, $3, $4);`
    pool.query(queryText, [req.body.longitude, req.body.latitude, '', 1])
        .then( result => {
            res.sendStatus(200);
        })
        .catch( error => {
            console.log('Error in posting to pins', error);
        })
  })

module.exports = router;