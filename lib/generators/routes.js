var router = require('voyager').router;

router.get('/', 'home#index');

exports = module.exports = router.routes;