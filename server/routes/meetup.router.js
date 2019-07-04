const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = express.Router();


router.post('/add', rejectUnauthenticated, (req, res) => {
    const queryText = `INSERT INTO "meetups" ("ref_pin_id", "ref_organized_by", "date", "time", "supplies") VALUES
                        ($1, $2, $3, $4, $5) RETURNING "meetup_id";`
    pool.query(queryText, [req.body.pinId, req.user.id, req.body.date, req.body.time, req.body.supplies])
        .then(result => {
            const meetupId = result.rows[0].meetup_id;
            pool.query(`INSERT INTO "meetup_joins" ("ref_meetup_id", "ref_user_id") VALUES
            ($1, $2);`, [meetupId, req.user.id])
                .then( result => {
                    res.sendStatus(200);
                })
                .catch(error => {
                    console.log('Error inserting join from meetup', error);
                })
            
        })
        .catch(error => {
            console.log('Error in posting to meetup table', error);
            res.sendStatus(500);
        })
})


router.get('/', rejectUnauthenticated, (req, res) => {
    const queryText = `SELECT * FROM
    "meetups" JOIN "pins" ON "meetups"."ref_pin_id" = "pins"."pin_id"
    LEFT JOIN "meetup_joins" ON "meetups"."meetup_id" = "meetup_joins"."ref_meetup_id"
    WHERE "meetups"."ref_organized_by" = $1 OR "meetup_joins"."ref_user_id" = $1
    ORDER BY "date";`
    pool.query(queryText, [req.user.id])
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            res.sendStatus(500);
            console.log('Error in user meetups query', error);
        })
})

router.get('/joins', rejectUnauthenticated, (req, res) => {
    const queryText = `SELECT COUNT(*) FROM "meetups"
    LEFT JOIN "meetup_joins" ON "meetups"."meetup_id" = "meetup_joins"."ref_meetup_id"
    WHERE "meetups"."meetup_id" = $1;`
    pool.query(queryText, [req.query.id])
    .then(response => {
      res.send(response.rows[0].count);
    })
    .catch(error => {
        console.log('Error in getting meetup joins', error);
    })
})

module.exports = router;