// this module contain several helpers functions

//DEPENDENCIES
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const cryptoRandonStr =  require("crypto-random-string");


// generate crypto random string
exports.generateStr = async function (length){
    let str = cryptoRandonStr({length:length});
    return str;
}


// //hash password
// exports.hash = async(password)=>{
//     try {
//         let hashedPass =  await bcrypt.hash(password, saltRounds);
//     }catch(err){
//         console.log(err)
//     }
//     return hashedPass;
// }