//DEPENDENCIES
const mysql = require("mysql2/promise");

// create connection pool
const pool =   mysql.createPool ({
    host:"localhost",
    user:"root",
    database:"bigman",
    password:"master",
    port:'3306',
    waitForConnections:true,
    connectionLimit:10,
    queueLimit: 0,
});

// export the pool object
module.exports = pool;