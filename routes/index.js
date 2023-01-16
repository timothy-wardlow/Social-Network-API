const router = require('express').Router();
const apiRoutes = require ('./api' );

router.use( '/api', apiRoutes );

router.use(( req, res ) => {
   res.status(400).send('Uh oh, this is awkward... Wrong route!');
});

module.exports = router;