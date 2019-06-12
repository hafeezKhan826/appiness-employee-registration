var express = require('express');
var router = express.Router();

/* GET employees listing. */
router.get('/get-employees', function (req, res, next) {
    const collection = req.app.locals.db.collection('employee');
    collection.find({}).toArray((err, result) => {
        console.log(err, result);
        res.send('respond with a resource');
    });
});

router.post('/create', function (req, res, next) {
    const db = req.app.locals.db;
    const doc = req.body;
    const isAdmin = await getRole(doc.emailId, db);
    try {
        if (isAdmin === 'Forbidden') {
            res.status(503).send(isAdmin)
        }
        db.collection('employee').insertOne(doc, (err, cb) => {
            if (err) res.status(500).send(err);
            if (cb.insertedId) {
                const successReponse = {
                    message: 'registered successfully'
                }
                res.status(200).send(successReponse)
            }
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
});

router.post('/update', function (req, res, next) {
    const db = req.app.locals.db;
    const doc = req.body;

    const isAdmin = await getRole(doc.emailId, db);
    try {

        if (isAdmin === 'Forbidden') {
            res.status(503).send(isAdmin)
        }

        db.collection('employee').updateOne(doc, (err, cb) => {
            if (err) res.status(500).send(err);
            if (cb.insertedId) {
                const successReponse = {
                    message: 'Updated successfully'
                }
                res.status(200).send(successReponse)
            }
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
});

router.post('/delete-employee', async (req, res, next) => {
    const db = req.app.locals.db;
    const doc = req.body;
    const isAdmin = await getRole(doc.emailId, db);
    try {
        if (isAdmin === 'Forbidden') {
            res.status(503).send(isAdmin)
        } else {
            db.collection('employee').deleteOne({ emailId: doc.employeeId }, (err, cb) => {
                if (err) res.status(500).send(err);
                console.log(cb);
                if (cb.deletedCount === 0) {
                    const successReponse = {
                        message: 'Record not found'
                    }
                    res.status(200).send(successReponse)
                } else if (cb.deletedCount > 0) {
                    const successReponse = {
                        message: 'Deleted successfully'
                    }
                    res.status(200).send(successReponse)
                }
            });
        }
    }
    catch (e) {
        console.log('Error: ', e);
        res.status(500).send(e);
    }
});

function getRole(emailId, db) {
    return new Promise(function (resolve, reject) {
        db.collection('users').findOne({ emailId }, (err, userResult) => {

            if (err) reject(err);
            if (userResult && userResult.role.toLowerCase() == 'admin') {
                resolve(userResult)
            } else {
                resolve('Forbidden')
            }
        })

    })
}

module.exports = router;
