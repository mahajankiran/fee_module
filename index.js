const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejsLint = require('ejs-lint');



app.use(bodyParser.json()) // for parsing application/json and converting it into javascript object
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))


//Set static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));


// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Routes
app.use("/", require("./routes/index"));
app.use("/student", require("./routes/student"));
app.use("/admin", require("./routes/admin"));

app.listen(5000, () => {
    console.log("Server started..");
});