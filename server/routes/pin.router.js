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

// get route to get a username by an id
router.get('/username/:id', (req, res) => {
    pool.query('SELECT username FROM "user" WHERE "id" = $1;', [req.params.id])
        .then(result => {
            res.send(result.rows[0].username);
        })
        .catch(error => {
            res.sendStatus(500);
            console.log('Error in getting single username', error);
        })
})

router.post('/', rejectUnauthenticated, (req, res) => {
    const queryText = `INSERT INTO "pins" ("longitude", "latitude", "description", "ref_pin_owner") VALUES
    ($1, $2, $3, $4);`
    pool.query(queryText, [req.body.longitude, req.body.latitude, req.body.description, req.user.id])
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log('Error in posting to pins', error);
        })
})

// delete a pin route - requires the id passed at the end of the url 
router.delete('/:id', rejectUnauthenticated, (req, res) => {
    // we need to delete the pin - req.params.id is the pin_id
    // we have to get ALL of the data from pins, meetups, and meetup_joins
    // because if a pin has a meetup, we have to delete the joins, then the meetup, 
    // and then we can delete the pin itself
    // first make sure that the current user either created the pin or is admin
    pool.query(`SELECT "ref_pin_owner" AS "id" from "pins" WHERE "pin_id" = $1;`, [req.params.id])
        .then(result => {
            if (result.rows[0].id === req.user.id || req.user.admin) {
                // if they created it or are admin, get all that data mentioned above
                pool.query(`SELECT * FROM "pins" LEFT JOIN
                "meetups" ON "pins"."pin_id" = "meetups"."ref_pin_id"
                LEFT JOIN "meetup_joins" ON "meetups"."meetup_id" = "meetup_joins"."ref_meetup_id"
                WHERE "pins"."pin_id" = $1;`, [req.params.id])
                    .then(result => {
                        // if there is a meetup on the pin, we have to delete the joins, then the meetup
                        const meetupId = result.rows[0].meetup_id;
                        if (meetupId) {
                            pool.query(`DELETE FROM "meetup_joins" WHERE "ref_meetup_id" = $1;`, [meetupId])
                                .then(result => {
                                    // with all the meetup_joins deleted, now delete the meetup
                                    pool.query(`DELETE FROM "meetups" WHERE "meetup_id" = $1;`, [meetupId])
                                        .then(result => {
                                            // now with all meetup_joins and the meetup deleted, we can delete the pin
                                            pool.query(`DELETE FROM "pins" WHERE "pin_id" = $1;`, [req.params.id])
                                                .then(result => {
                                                    res.sendStatus(200);
                                                })
                                                .catch(error => {
                                                    console.log('Error with delete query for pin', error)
                                                    res.sendStatus(500);
                                                })
                                        })
                                        .catch(error => {
                                            console.log('Error with DELETE meetup query in DELETE PIN', error);
                                            res.sendStatus(500)
                                        })
                                })
                                .catch(error => {
                                    console.log('Error in meetup_joins DELETE query', error)
                                    res.sendStatus(500);
                                })
                        } else {
                            pool.query(`DELETE FROM "pins" WHERE "pin_id" = $1`, [req.params.id])
                                .then(result => {
                                    res.sendStatus(200);
                                })
                                .catch(error => {
                                    console.log('Error with DELETE pin query', error);
                                    res.sendStatus(500);
                                })
                        }
                    })
                    .catch(error => {
                        console.log('Error with select from delete pins query', error)
                        res.sendStatus(500);
                    })

            }
        })
        .catch(error => {
            console.log('Error with DELETE pin query', error)
            res.sendStatus(500);
        })
})

module.exports = router;