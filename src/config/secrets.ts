import dotenv from "dotenv";
import fs from "fs";
import { NODE_ENV, TEST, PRODUCTION } from "./settings";
import logger from "../util/logger";

if (!fs.existsSync(".env")) {
    logger.info("No .env file found, looking for variables in environment.");
}

if (NODE_ENV !== TEST) dotenv.config();

const requiredSecrets = [
    "SESSION_SECRET",

    "MONGO_DATABASE",
    "MONGO_HOST",
    "MONGO_PORT",

    "FACEBOOK_ID",
    "FACEBOOK_SECRET",

    "SENDGRID_USER",
    "SENDGRID_PASSWORD",

    "AWS_ACCESS_KEY_ID",
    "AWS_ACCESS_KEY_SECRET",

    "CORS_REGEX"
];

if (NODE_ENV === PRODUCTION) {
    requiredSecrets.push(...[
        "MONGO_USERNAME",
        "MONGO_PASSWORD"
    ]);
}

const missingSecrets = requiredSecrets.filter(s => !process.env[s]);
if (missingSecrets.length > 0) {
    missingSecrets.forEach((ms) => logger.error(`Env variable ${ms} is missing.`));
    process.exit(1);
}

const mongoURI = NODE_ENV === PRODUCTION
    ? `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`
    : `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGO_URI = mongoURI;
export const FACEBOOK_ID = process.env["FACEBOOK_ID"];
export const FACEBOOK_SECRET = process.env["FACEBOOK_SECRET"];
export const SENDGRID_USER = process.env["SENDGRID_USER"];
export const SENDGRID_PASSWORD = process.env["SENDGRID_PASSWORD"];
export const AWS_ACCESS_KEY_ID = process.env["AWS_ACCESS_KEY_ID"];
export const AWS_ACCESS_KEY_SECRET = process.env["AWS_ACCESS_KEY_SECRET"];
export const CORS_REGEX = process.env["CORS_REGEX"];