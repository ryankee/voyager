var router = require('../../../voyager').router;

router.get('/', 'test#index');

exports = module.exports = router.routes;