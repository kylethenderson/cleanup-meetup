CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
	"first_name" VARCHAR(128),
	"last_name" VARCHAR(128),
	"email" VARCHAR(256),
	"phone" VARCHAR(16),
	"admin" BOOLEAN
);
	
CREATE TABLE "pins" (
	"pin_id" SERIAL PRIMARY KEY,
	"longitude" VARCHAR(64),
	"latitude" VARCHAR(64),
	"description" VARCHAR(512),
	"ref_created_by" INT REFERENCES "user"
);

CREATE TABLE "meetups" (
	"meetup_id" SERIAL PRIMARY KEY,
	"ref_pin_id" INT REFERENCES "pins",
	"ref_organized_by" INT REFERENCES "user",
	"date" DATE,
	"time" TIME,
	"supplies" VARCHAR(1024)
);

CREATE TABLE "meetup_joins" (
	"join_id" SERIAL PRIMARY KEY,
	"ref_meetup_id" INT REFERENCES "meetups",
	"ref_user_id" INT REFERENCES "user"
);

