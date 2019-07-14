const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = express.Router();

// import modules for twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

router.post('/add', rejectUnauthenticated, (req, res) => {
    const queryText = `INSERT INTO "meetups" ("ref_pin_id", "ref_organized_by", "date", "time", "supplies") VALUES
                        ($1, $2, $3, $4, $5) RETURNING "meetup_id";`
    pool.query(queryText, [req.body.pinId, req.user.id, req.body.date, req.body.time, req.body.supplies])
        .then(result => {
            const meetupId = result.rows[0].meetup_id;
            // after the meetup is added to the db, notify the owner of the pin
            // get the phone number of the og owner of the pin to send twilio text
            pool.query(`SELECT "user"."id", "user"."phone" FROM
            "pins" JOIN "user" ON "pins"."ref_pin_owner" = "user"."id" 
            WHERE "pins"."pin_id" = $1;`, [req.body.pinId])
                .then(result => {
                    const userPhone = result.rows[0].phone
                    // only send a msg if the pin owner has a phone number listed AND is NOT the current user
                    if (userPhone && result.rows[0].id !== req.user.id) {
                        console.log('sending sms message');
                        client.messages
                            .create({
                                body: 'A MeetUp has been organized on one of your pins.',
                                from: '+18065471942',
                                to: `+1${userPhone}`
                            })
                            .then(message => console.log(message.sid));
                    }
                    pool.query(`UPDATE "pins" SET "ref_pin_owner" = $1 WHERE "pin_id" = $2;`, [req.user.id, req.body.pinId])
                        .then(result => {
                            pool.query(`INSERT INTO "meetup_joins" ("ref_meetup_id", "ref_user_id") VALUES
                            ($1, $2);`, [meetupId, req.user.id])
                                .then(result => {
                                    res.sendStatus(200);
                                })
                                .catch(error => {
                                    console.log('Error inserting join from meetup', error);
                                })
                        })
                        .catch(error => {
                            res.sendStatus(500)
                            console.log('Error in updating pin ownership', error)
                        })
                })

        })
        .catch(error => {
            console.log('Error in posting to meetup table', error);
            res.sendStatus(500);
        })
})


router.get('/user', rejectUnauthenticated, (req, res) => {
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

router.get('/all', rejectUnauthenticated, (req, res) => {
    pool.query(`SELECT * FROM "meetups" ORDER BY "meetup_id";`)
        .then(result => {
            res.send(result.rows)
        })
        .catch(error => {
            console.log('Error in meetup SELECT query', error)
            res.sendStatus(500);
        })
})

router.get('/single/:id', rejectUnauthenticated, (req, res) => {
    pool.query(`SELECT * FROM "meetups" JOIN 
    "pins" ON "meetups"."ref_pin_id" = "pins"."pin_id"
    WHERE "meetup_id" = $1 LIMIT 1;`, [req.params.id])
        .then(result => {
            res.send(result.rows[0]);
        })
        .catch(error => {
            console.log('Error in SELECT single query', error);
            res.sendStatus(500);
        })
})

router.get('/joins', rejectUnauthenticated, (req, res) => {
    const queryText = `SELECT * FROM "meetups"
    LEFT JOIN "meetup_joins" ON "meetups"."meetup_id" = "meetup_joins"."ref_meetup_id"
    WHERE "meetups"."meetup_id" = $1;`
    pool.query(queryText, [req.query.id])
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log('Error in getting meetup joins', error);
        })
})

router.delete('/:id', rejectUnauthenticated, (req, res) => {
    pool.query(`SELECT "ref_organized_by" AS "id" FROM "meetups" WHERE "meetup_id" = $1;`, [req.params.id])
        .then(result => {
            if (result.rows[0].id === req.user.id || req.user.admin) {
                pool.query(`DELETE FROM "meetup_joins" WHERE "ref_meetup_id" = $1;`, [req.params.id])
                    .then(result => {
                        pool.query(`DELETE FROM "meetups" WHERE "meetup_id" = $1`, [req.params.id])
                            .then(result => {
                                res.sendStatus(200)
                            })
                            .catch(error => {
                                console.log('Error with DELETE from meetups query', error);
                                res.sendStatus(500)
                            })
                    })
                    .catch(error => {
                        console.log('Error with DELETE from meetup_joins query', error);
                        res.sendStatus(500)
                    })
            } else {
                res.sendStatus(401)
            }
        })
        .catch(error => {
            console.log('Error SELECTING meetup organizer id', error);
        })
})

router.put('/', rejectUnauthenticated, (req, res) => {
    const updateText = `UPDATE "meetups" SET
                        "date" = $1,
                        "time" = $2,
                        "supplies" = $3
                        WHERE "meetup_id" = $4;`
    pool.query(updateText, [req.body.date, req.body.time, req.body.supplies, req.body.meetupId])
        .then(result => {
            pool.query(`UPDATE "pins" SET "description" = $1 WHERE "pin_id" = $2;`, [req.body.description, req.body.pinId])
                .then(result => {
                    res.sendStatus(200)
                })
                .catch(error => {
                    console.log('Error with UPDATE meetup query', error)
                    res.sendStatus(500);
                })
        })
        .catch(error => {
            console.log('Error with UPDATE meetup query', error)
            res.sendStatus(500)
        })
})

router.post('/join', rejectUnauthenticated, (req, res) => {
    pool.query(`INSERT INTO "meetup_joins" ("ref_meetup_id", "ref_user_id")
                VALUES ($1, $2);`, [req.body.meetupId, req.user.id])
        .then(result => {
            res.sendStatus(200)
        })
        .catch(error => {
            res.sendStatus(500);
            console.log('Error INSERT into meetup_joins', error);
        })
})

router.delete('/join/:id', (req, res) => {
    pool.query(`DELETE FROM "meetup_joins" WHERE "ref_meetup_id" = $1 AND "ref_user_id" = $2`, [req.params.id, req.user.id])
        .then(response => {
            res.sendStatus(200)
        })
        .catch(error => {
            res.sendStatus(500);
            console.log('Error with DELETE join query', error)
        })
})

module.exports = router;