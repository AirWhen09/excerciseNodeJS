const mysql = require('mysql2');

const db = mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    port : process.env.DATABASE_PORT,
    database : process.env.DATABASE
});


exports.login = (req, res) => {
    const {email, password} = req.body;
    db.query("SELECT * from user where email = ?", email, 
    (err, result)=>{
        if(err) console.log(err.message);
        else{
            if(result.length < 1 || password !== result[0].password){
                res.render('index', {message : 'Email or Password is Incorrect'});
            }else{
                let courses;
                db.query("SELECT * from courses", (err, course)=>{
                    if(err) console.log(err.message);
                    else{
                        courses = course;
                    }
                });
                db.query("SELECT * from students join courses on students.course_id = courses.id",
                (err, results)=>{
                    if(err) console.log(err.message);
                    else{

                        res.render('studentList', {student : results, courses : courses, status : 'warning', number : 0});
                    }
                });
                
            }
        }
    });

}

exports.addStudent = (req, res) => {
    const {firstName, lastName, email, course} = req.body;

    db.query("SELECT email from students where email = ?", email, (err, result) => {
        if(err) console.log(err.message);
        else{
            if(result.length > 0){
                let courses;
                db.query("SELECT * from courses", (err, course)=>{
                    if(err) console.log(err.message);
                    else{
                        courses = course;
                    }
                });
                db.query("SELECT * from students join courses on students.course_id = courses.id",
                (err, results)=>{
                    if(err) console.log(err.message);
                    else{

                        res.render('studentList', {student : results, 
                                                   courses : courses, 
                                                   message : 'Email already registered', 
                                                   status : 'danger',
                                                });
                    }
                });

            }else{
                db.query("INSERT INTO students set ?", 
                {first_name : firstName, last_name : lastName, email : email, course_id : course},
                (err) => {
                    if(err) console.log(err.message);
                    else{
                        let courses;
                        db.query("SELECT * from courses", (err, course)=>{
                            if(err) console.log(err.message);
                            else{
                                courses = course;
                            }
                        });
                        db.query("SELECT * from students join courses on students.course_id = courses.id",
                        (err, results)=>{
                            if(err) console.log(err.message);
                            else{

                                res.render('studentList', {student : results, 
                                                        courses : courses, 
                                                        message : 'Student Successfully Added', 
                                                        status : 'success',
                                                        });
                            }
                        });
                    }
                });
            }
        }
    });

}

exports.delete = (req, res) => {
    const email = req.params.email;
    db.query("DELETE from students where email = ?", email,
    (err) => {
        if(err) console.log(err.message);
        else{
            let courses;
            db.query("SELECT * from courses", (err, course)=>{
                if(err) console.log(err.message);
                else{
                    courses = course;
                }
            });
            db.query("SELECT * from students join courses on students.course_id = courses.id",
            (err, results)=>{
                if(err) console.log(err.message);
                else{
                    res.status(400).render('studentList', {student : results, 
                                            courses : courses, 
                                            message : 'Student Successfully Deleted', 
                                            status : 'success',
                                            });
                }
            });
        }
    });
}

exports.update = (req, res) => {
    const email = req.params.email;

    db.query("SELECT * from students where email = ?", email,
    (err, results) => {
        if(err) console.log(err.message);
        else{
            res.render("updateStudent", { student : results[0]});
        }
    });
}

exports.updateStudent = (req, res) => {
    const {firstName, lastName, email} = req.body;

    db.query("UPDATE students set first_name = ?, last_name = ? where email = ?", [firstName, lastName, email],
    (err, results) => {
        if(err) console.log(err.message);
        else{
            let courses;
            db.query("SELECT * from courses", (err, course)=>{
                if(err) console.log(err.message);
                else{
                    courses = course;
                }
            });
            db.query("SELECT * from students join courses on students.course_id = courses.id",
            (err, results)=>{
                if(err) console.log(err.message);
                else{
                    res.status(400).render('studentList', {student : results, 
                                            courses : courses, 
                                            message : 'Student Update Successfully', 
                                            status : 'success',
                                            });
                }
            });
        }
    });
}