require('dotenv').config({ path: './.env'});
const mysql = require('Mysql');

const connection = mysql.createConnection(process.env.DATABASE_URI);

