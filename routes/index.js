var express = require('express');
var router = express.Router();
var built = require("built.io");
var request = require('request');
var nodemailer = require("nodemailer");
var App = built.App('blt5218200bfee8ebc9');
var task = App.Class('task');
var user = App.User();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.cookies.authtoken) {
        res.redirect('/task');
    } else {
        // console.log("index page=================");
        res.render('index', { title: 'Todo App' });
    }
});


router.post('/signup', function(req, res, next) {
    console.log("Register");
    user.register(req.body.email, req.body.pwd, req.body.cpwd, {
            username: req.body.uname
        })
        .then(function(user) {
            res.json(user);
        });
});

router.get('/task', function(req, res, next) {

    var query = App.Class('built_io_application_user').Query();
    query = query.where('uid', req.cookies.uid);
    query.toJSON().exec()
        .then(function(loggedInuser) {
            if (req.cookies.authtoken) {
                res.render('task', { username1: loggedInuser[0].username });
                console.log(req.cookies.authtoken);
            } else {
                res.redirect('/')
            }
        })
})

router.post('/signin', function(req, res, next) {

    console.log("Login");
    user.login(req.body.email, req.body.pwd)
        .then(function(signin_user) {
            console.log('redirecting');
            // console.log(signin_user)

            res.cookie('authtoken', signin_user.data.authtoken)
            res.cookie('uid', signin_user.data.uid)
                // req.session.authtoken = sign_data.data.authtoken            

            res.json({ data: signin_user })
        }, function(error) {
            res.json({ err: error });
        });

})

router.post('/getTask', function(req, res, next) {

    console.log('----------------------------------------')
        // console.log(req.cookies.uid);
        // var uid = req.cookies.uid
    var query = task.Query();
    // var q1 = query.where('app_user_object_uid', uid);
    // var q2 = query.containedIn('share_user', uid);
    // var qarray = [q1, q2];
    // var orQuerry = query.or(qarray);
    query = query.includeOwner();
    query
        .toJSON()
        .setHeader('authtoken', req.cookies.authtoken)
        .exec()
        .then(function(d) {
            res.json(d)
        }, function(err) {
            res.json({ status: err })
        })
});

router.post('/addTask', function(req, res, next) {

    var row = task.Object;

    var objectRow = row({
        task_name: req.body.task_name,
        description: req.body.description,
        status: req.body.status
    });
    objectRow
        .setHeader('authtoken', req.cookies.authtoken)
        .save()
        .then(function(object) {
            res.json(object);
        })
});

router.post('/statusUpdate', function(req, res, next) {
    var row = task.Object;

    var objectRow = row({
        uid: req.body.uid,
        status: req.body.status
    });
    objectRow
        .setHeader('authtoken', req.cookies.authtoken)
        .save()
        .then(function(object) {
            res.json(object);
        })
});


router.post('/taskEdit', function(req, res, next) {

    var row = task.Object;

    var objectField = row({
        uid: req.body.uid,
        task_name: req.body.task_name,
        description: req.body.description,
        status: req.body.status
    });
    objectField
        .setHeader('authtoken', req.cookies.authtoken)
        .save()
        .then(function(object) {
            res.json(object);
        })
});

router.post('/taskDelete', function(req, res, next) {
    console.log(req.body.uid1);

    var row = task.Object(req.body.uid1);
    row
        .setHeader('authtoken', req.cookies.authtoken)
        .delete()
        .then(function() {
            res.json({ success: true })
        });

});

router.get('/logout', function(req, res, next) {
    console.log("in logout")
    res.clearCookie('authtoken');
    res.clearCookie('uid');
    res.send("success")
        // res.redirect('/');
});

router.post('/shareTask', function(req, res, next) {
    console.log("in share");

    var getUserquery = App.Class('built_io_application_user').Query();
    getUserquery
        .notContainedIn('uid', [req.cookies.uid])
        .toJSON()
        .exec()
        .then(function(app_user) {
            res.json(app_user);
        });

})

router.post('/shareTaskToUser', function(req, res, next) {

    var taskshareid = req.body.taskshareuid;
    console.log(taskshareid);
    var shared_user_id = req.body.shared_user_id;

    var row = task.Object;

    var acl = built.ACL();
    acl = acl.setUserReadAccess(shared_user_id, true).setUserUpdateAccess(shared_user_id, true);


    var objectField = row({
        uid: taskshareid,
        share_user: shared_user_id
    });

    objectField
        .setHeader('authtoken', req.cookies.authtoken)
        .setACL(acl)
        .save()
        .then(function(object) {
            res.json(object);
        });
})
router.get('/forgotpassword', function(req, res, next) {
    res.render('forgotpassword');
})
router.get('/resetpassword/:token', function(req, res, next) {
    res.render('resetpassword');
})

router.post('/reset', function(req, res, next) {
    user.resetPassword(req.body.pwd, req.body.cpwd, req.body.token)
        .then(function() {
            res.json({'done':true})
    });
})

router.post('/sendVerification', function(req, res, next) {
    console.log("In Verification");
    var email = req.body.email1;
    user.fetchUserUidByEmail(email)
        .then(function(user) {

            console.log(user.data.uid);
            var userUID = user.data.uid;
            var options = {
                url: 'https://api.built.io/v1/application/users/' + userUID + '/token',
                headers: {
                    application_api_key: 'blt5218200bfee8ebc9',
                    master_key: 'blt0ef68182e82855d1'
                }
            };

            request(options, function(err, res, body) {
                if (err) {
                    res.send(400, err)
                } else {
                    var token = JSON.parse(body);
                    sendMail(email, token.token);
                }
            })

        });
});

var sendMail = function(email, token) {
    var transporter = nodemailer.createTransport('smtps://nobitabean%40gmail.com:nobita123@smtp.gmail.com');
    var mailOptions = {
        from: 'nobitabean@gmail.com', // sender address 
        to: email, // list of receivers 
        subject: 'Reset Your Password', // Subject line 
        html: 'Reset Your Password <br> click on the link <a rel="nofollow" href="http://172.16.0.216:4040/resetpassword/' + token + '">Reset Password</a>' // html body 
    }

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent');
    });
}

module.exports = router;
