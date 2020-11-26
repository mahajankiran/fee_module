const jwt = require('jsonwebtoken');
const mysqlConnection = require("../connection");


const authRequire = (req, res, next) => {

    const token = req.cookies.jwt;

    if (token) {


        jwt.verify(token, 'secretkey', (err, decodedToken) => {

            if (err) {
                console.log(err.message);
                res.redirect('/');

            } else {
                // console.log(decodedToken);
                next();
            }

        })
    } else {
        res.redirect('/');


    }

}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {

        jwt.verify(token, 'secretkey', (err, decodedToken) => {

            if (err) {
                console.log(err);
                res.locals.user = null;

                next();
            } else {
                let stmt = 'SELECT * FROM student WHERE stud_id=?'

                mysqlConnection.query(stmt, [decodedToken.id], (err, result, field) => {

                    if (err) {
                        console.log('Student not found')
                        res.locals.user = null;
                        next();

                    } else {
                        console.log('In check')
                        res.locals.user = result[0].stud_id;
                        console.log(res.locals);
                        next();
                    }

                })

            }

        })

    } else {

    }
}


const UpdateUserInfo = (req, res, next) => {

}




module.exports = {
    authRequire,
    checkUser
};