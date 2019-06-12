var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function (req, res, next) {
  const db = req.app.locals.db;

});

router.post('/signup', function (req, res, next) {
  const db = req.app.locals.db;
  const doc = req.body;
  db.collection('users').insertOne(doc, (err, cb) => {
    if (err) res.status(500).send(err);
    if (cb.insertedId) {
      const opertaionSuccessReponse = {
        message: 'Signup Successful'
      }
      res.status(200).send(opertaionSuccessReponse)
    }
  });
});




module.exports = router;
