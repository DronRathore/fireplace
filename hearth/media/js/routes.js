(function() {

var dependencies;
// This `dtrace` tells r.js that the list of dependencies can't be determined
// statically.
/* dtrace */

// Don't remove the single quotes around the keys in this array!
// Space Heater uses this array to populate its routes table.
var routes = [
    {'pattern': '^/$', 'view_name': 'homepage'},
    {'pattern': '^/index.html$', 'view_name': 'homepage'},
    {'pattern': '^/app/([^/<>"\']+)/ratings/add$', 'view_name': 'app/ratings/add'},
    {'pattern': '^/app/([^/<>"\']+)/ratings/edit$', 'view_name': 'app/ratings/edit'},
    {'pattern': '^/app/([^/<>"\']+)/ratings$', 'view_name': 'app/ratings'},
    {'pattern': '^/app/([^/<>"\']+)/abuse$', 'view_name': 'app/abuse'},
    {'pattern': '^/app/([^/<>"\']+)/privacy$', 'view_name': 'app/privacy'},
    {'pattern': '^/user/([^/<>"\']+)/abuse', 'view_name': 'user/abuse'},
    {'pattern': '^/app/([^/<>"\']+)$', 'view_name': 'app'},
    {'pattern': '^/search$', 'view_name': 'search'},
    {'pattern': '^/category/([^/<>"\']+)$', 'view_name': 'category'},
    {'pattern': '^/category/([^/<>"\']+)/featured$', 'view_name': 'featured'},
    {'pattern': '^/settings$', 'view_name': 'settings'},
    {'pattern': '^/purchases$', 'view_name': 'purchases'},
    {'pattern': '^/abuse$', 'view_name': 'abuse'},
    {'pattern': '^/featured$', 'view_name': 'featured'},

    {'pattern': '^/privacy-policy$', 'view_name': 'privacy'},
    {'pattern': '^/terms-of-use$', 'view_name': 'terms'},

    {'pattern': '^/tests$', 'view_name': 'tests'},
    {'pattern': '^/debug$', 'view_name': 'debug'}
];

dependencies = routes.map(function(i) {return 'views/' + i.view_name;});
/* /dtrace */
// End the dtrace

window.routes = routes;

define(
    'routes',
    // dynamically import all the view modules form the routes
    dependencies,
    function() {
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var view = require('views/' + route.view_name);
            route.view = view;
        }
        return routes;
    }
);

<<<<<<< HEAD
})()
=======
})();
>>>>>>> Add basic dtrace for JS compilation
