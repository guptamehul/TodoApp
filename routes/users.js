var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({status:"/api endpoints"})
});


router.get('/api/users', function(req, res, next) {
  res.json({status:"/api/users endpoints"})
});

module.exports = router;
