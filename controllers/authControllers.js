const bcrypt = require("bcrypt");
const mysqlConnection = require("../connection");
const jwt = require('jsonwebtoken');
const pdf = require('html-pdf');
const fileSaver = require('file-saver');
const pdfTemplate =require('../documents/document.js');
const stripe = require('stripe')('sk_test_51HsAN1DWAYQVTPQ4xbjaH373UXUq59nyf1UsgoviyRdWLcgvdszqoRyoHM6QKPWSMRGZfjMz1jDRvdZTkDOdHbuH00LXYouZVB')
const path  =require('path'); 
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
                            let data2 = [
                                [studid]
                            ]
                            let stmt2 = `INSERT INTO academic_payment(stud_id) VALUE ?`;
                            mysqlConnection.query(stmt2, [data2], (err, result, field) => {

                                if (err) {
                                    console.log('eror in inserting intopayment table')
                                    throw err;

                                } else {
                                    console.log('inserted into payment table');

                                }

                            })
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

    const { user } = res.locals;
    const { stud_id } = user;
    let stmt = 'SELECT stud_id,stud_name,category,year ,tution_fee,university_fee,development_fee,fees_paid,fees_status FROM student NATURAL JOIN fee_structure NATURAL JOIN academic_payment WHERE stud_id=? ;'
    mysqlConnection.query(stmt, [stud_id], (err, result, field) => {
        if (err) {
            console.log('Error in fetching users info')
            throw err;

        } else {
            console.log('get_student_fee_payment');
            result[0].fileSaver=fileSaver;
            const user_info = result[0];
            console.log(user_info)
            res.render("payment", user_info);

        }
    })







}




module.exports.get_student_basic_details = (req, res) => {

   res.render("basic_info");
}

module.exports.post_student_basic_details = (req, res) => {

    let stmt = 'UPDATE student SET address=? ,category=?,year=? WHERE stud_id=?';
    const { user } = res.locals;
    const { stud_id } = user;
    mysqlConnection.query(stmt, [req.body.address, req.body.category, req.body.year, stud_id], (err, result, field) => {

        if (err) {
            console.log(err);
            const errors = { "success": 0 }
            res.json(errors);
        } else {

            res.json({
                stud_id
            });


        }


    })





}


module.exports.fee_pay_details = (req, res) => {



    console.log(req.body.price)
    const price = req.body.price;



    stripe.charges.create({
        amount: price,
        source: req.body.stripeTokenId,
        currency: 'inr'
    }).then(function() {
        const { user } = res.locals;
        const { stud_id } = user
        ;
        const database_price = price / 100;

        let stmt = 'UPDATE academic_payment SET fees_status=1,acad_pay_amount=?,transaction_date=NOW(),fees_paid=? WHERE stud_id=?'
        mysqlConnection.query(stmt, [database_price, database_price, stud_id], (err, result, field) => {

            if (err) {

                console.log('Error in making payment');
                console.log(err);
                console.log('Charge Fail')
                res.status(500).end()

            } else {

                res.json({ message: 'Successfully  paid fees' })





            }



        })
    }).catch(function() {
        console.log('Charge Fail')
        res.status(500).end()
    })


}

module.exports.download_fee_receipts =(req,res)=>{



    let stmt ='SELECT * FROM student NATURAL JOIN academic_payment';
    console.log('In download')
    mysqlConnection.query(stmt,(err,result,field)=>{
        if(err)
        {
                 console.log(err);
                 res.json({"message":"Failed to download receipt"})
        }
        else{
            console.log(result[0]);
           pdf.create(pdfTemplate(result[0]), {}).toFile(`/${result[0].stud_name}.pdf`, (err,file) => {
            if(err) {
                console.log(err);
        }
        else{

        // res.send(Promise.resolve());
        console.log(file);
         res.sendFile(`/${__dirname}/${result[0].stud_name}.pdf`);
      
        }
  
    });

        }

    })

}