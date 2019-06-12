var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', function (req, res, next) {
  const db = req.app.locals.db;
  const doc = req.body;
  db.collection('employee').insertOne(doc, (err, cb) => {
    if (err) res.status(500).send(err);
    if (cb.insertedId) {
      const opertaionSuccessReponse = {
        message: 'Successfully registered'
      }
      res.status(200).send(opertaionSuccessReponse)
    }
  });
});

module.exports = router;
