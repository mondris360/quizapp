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
    totalPlayers Int(10) default 0,
    status varchar(15) default "active",
    PRIMARY KEY(quizID),
    FOREIGN KEY(userID) REFERENCES users(id)
)`;
	createTable(sql);
})();

(function questions(){
	let sql = `CREATE TABLE IF NOT EXISTS questions(
    questionID VARCHAR(20),
    quizID varchar(10),
    question varchar(50),
    option1 varChar(50),
    option2 varChar(50),
    option3 varChar(50),
    option4 varChar(50),
    correctAnswer varChar(50),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(questionID),
    FOREIGN KEY(quizID) REFERENCES quiz(quizID)

)`;
	createTable(sql);
})();

(function players(){
	let sql = `CREATE TABLE IF NOT EXISTS players(
    playerID VARCHAR(10),
    firstName varchar(30),
    lastName varChar(30),
    email varChar(50),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(playerID)
)`;
	createTable(sql);
})();

(function quizScores(){
	let sql = `CREATE TABLE IF NOT EXISTS quizScores(
    scoreID VARCHAR(10),
    quizID varchar(30),
    playerID varChar(30),
    playerscore INT(10) DEFAULT 0,
    quizScore INT(10) DEFAULT 0,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(scoreID),
    FOREIGN KEY(quizID) REFERENCES quiz(quizID),
    FOREIGN KEY(playerID) REFERENCES player(playerID)

)`;
	createTable(sql);
})();

(function playersAnswers(){
	let sql = `CREATE TABLE IF NOT EXISTS playersAnswers(
    answerID VARCHAR(10),
    quizID varchar(30),
    playerID VARCHAR(10),
    questionID VARCHAR(20),
    playerAnswer VARCHAR(20),
    correctAnswer VARCHAR(20),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(answerID),
    FOREIGN KEY(quizID) REFERENCES quiz(quizID),
    FOREIGN KEY(questionID) REFERENCES questions(questionID),
    FOREIGN KEY(playerID) REFERENCES players(playerID)

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
