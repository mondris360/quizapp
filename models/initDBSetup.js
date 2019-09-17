//DEPENDENCIES
const mysql =  require('./database');

// create users table using a self excuting function
(function users(){
	let sql = `CREATE TABLE IF NOT EXISTS users(
	id VARCHAR(20) PRIMARY KEY,
    firstName varchar(30),
    lastName varchar(30),
    email varchar(30),
    password varchar(100),
    depost INT(20) DEFAULT 0,
    lastDeposit INT(20) DEFAULT 0
)`;
	createTable(sql);
})();

// create users table using a self excuting function
(function quiz(){
	let sql = `CREATE TABLE IF NOT EXISTS quiz(
	quizID VARCHAR(20),
    userID varchar(20),
    quizName varChar(30),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    questionID varchar(30),
    PRIMARY KEY(quizID),
    FOREIGN KEY(userID) REFERENCES users(id)
)`;
	createTable(sql);
})();

(function questions(){
	let sql = `CREATE TABLE IF NOT EXISTS questions(
    questionID VARCHAR(20),
    question varchar(50),
    option1 varChar(50),
    option2 varChar(50),
    option3 varChar(50),
    option4 varChar(50),
    correctAnswer varChar(50),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(questionID)
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
