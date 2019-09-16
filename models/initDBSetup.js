//DEPENDENCIES
const mysql =  require('./database');

// create users table using a self excuting function
(function users(){
	let sql = `CREATE TABLE IF NOT EXISTS users(
	id VARCHAR(20) PRIMARY KEY,
    firstName varchar(30),
    lastName varchar(30),
    email varchar(30),
    password varchar(100)
)`;
	createTable(sql);
})();



// function to execute create table queries
async  function createTable(sql){
    try {
        await mysql.query(sql);
    } catch (err){
        console.log(err);
    }

}
