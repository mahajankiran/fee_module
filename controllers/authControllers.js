const bcrypt = require("bcrypt");
const mysqlConnection = require("../connection");
const jwt = require('jsonwebtoken');

const maxAge = 2 * 24 * 60 * 60;

const createToken = (id) => {

    return jwt.sign({ id }, 'secretkey', {
        expiresIn: maxAge
    });

}


module.exports.admin_login_get = (req, res) => {
    res.render("admin");

}

module.exports.admin_login_post = (req, res) => {
    res.json({
        "Posted ": "true"
    });

}

module.exports.register_get = (req, res) => {
    res.render("register");

}


module.exports.register_post = (req, res) => {


    const errors = {
        id_error: " ",
        pass_error: " ",
    }


    const { studid, name, email, password } = req.body;




    bcrypt.genSalt(10, function(err, salt) {

        if (err) {
            console.log('Error in creating salt');
            throw err;
        } else {
            bcrypt.hash(password, salt, (err, hash) => {


                if (err) {
                    console.log("Password hashing failed");
                    throw err;
                } else {
                    let data = [
                        [name, email, hash, studid]
                    ];


                    let stmt = `INSERT INTO student(stud_name,email,password,stud_id) VALUES ?`;
                    mysqlConnection.query(stmt, [data], (err, result, field) => {
                        if (err) {

                            if (err.errno === 1062)
                                errors.id_error = "Student alreday exists in database";
                            errors.pass_error = ""
                            res.json({ "success": 0, errors });




                        } else {
                            const token = createToken(studid);
                            console.log("User saved in database " + result);
                            res.cookie('jwt', token, {
                                httpOnly: true,
                                maxAge: maxAge * 1000
                            })
                            res.json({ studid })

                        }
                    });
                }
            });
        }
    });


}

module.exports.login_get = (req, res) => {
    res.render("login");

}


module.exports.login_post = async(req, res) => {

    let id = req.body.studid;
    let password = req.body.password;

    let stmt = 'SELECT stud_id,password FROM student WHERE stud_id=?';
    mysqlConnection.query(stmt, [id], async(err, result, field) => {

        if (result.length == 0) {


            res.status(400).json({ "success": 0, "message": "Student with this ID  has not  registeted" });



        } else {
            try {
                const correct = await bcrypt.compare(password, result[0].password);
                if (correct) {
                    const user = result[0];
                    const token = createToken(user.stud_id);
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
                    res.status(200).json({
                        user
                    });


                } else {

                    res.status(400).json({
                        "success": 0,
                        "message": "Inavlid Password"
                    })

                }
            } catch (err) {

                throw err;

            }





        }

    });




}


module.exports.get_student_dashboard = (req, res) => {
    res.render("student_dashboard");

}

module.exports.get_student_logout = (req, res) => {


    res.cookie('jwt', '', {
        maxAge: 1
    })
    res.redirect('/');

}


module.exports.get_student_fee_payment = (req, res) => {


    res.render("payment");






}




module.exports.get_student_basic_details = (req, res) => {


    res.render("basic_info");






}
module.exports.post_student_basic_details = (req, res) => {

    let stmt = 'UPDATE student SET address=? WHERE stud_id=?';


    // const { user } = res.locals;
    const { user } = res.locals;


    mysqlConnection.query(stmt, [req.body.address, user], (err, result, field) => {

        if (err) {
            console.log(err);
            const errors = { "success": 0 }
        } else {


            res.json(
                user)


        }


    })





}