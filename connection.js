const mysql = require("mysql");

//Create connetion with database
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "kiranm@21",
    database:"fee_mgmt"
  });
  
  con.connect((err) => {
    if (err) {
      throw err;
    }
    console.log("Connected to databse");
  });
  

  module.exports=con;