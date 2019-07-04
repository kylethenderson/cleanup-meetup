const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = express.Router();


router.get('/', rejectUnauthenticated, (req, res) => {
    pool.query(`SELECT * FROM
    "pins" FULL JOIN "meetups" ON "pins"."pin_id" = "meetups"."ref_pin_id"
    ORDER BY "pins"."pin_id";`)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            res.sendStatus(500);
            console.log('Error in getting pins', error);
        })
})

router.post('/', rejectUnauthenticated, (req, res) => {
    const queryText = `INSERT INTO "pins" ("longitude", "latitude", "description", "ref_created_by") VALUES
    ($1, $2, $3, $4);`
    pool.query(queryText, [req.body.longitude, req.body.latitude, '', 1])
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log('Error in posting to pins', error);
        })
})

module.exports = router;