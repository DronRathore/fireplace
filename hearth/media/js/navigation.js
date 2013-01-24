var nav = (function() {
    var stack = [
        {
            path: '/',
            type: 'root'
        }
    ];
    var param_whitelist = ['q', 'sort', 'cat'];

    function extract_nav_url(url) {
        // This function returns the URL that we should use for navigation.
        // It filters and orders the parameters to make sure that they pass
        // equality tests down the road.

        // If there's no URL params, return the original URL.
        if (url.indexOf('?') < 0) {
            return url;
        }

        var url_parts = url.split('?');
        // If there's nothing after the `?`, return the original URL.
        if (!url_parts[1]) {
            return url;
        }

        var used_params = _.pick(z.getVars(url_parts[1]), param_whitelist);
        // If there are no query params after we filter, just return the path.
        if (!_.keys(used_params).length) {  // If there are no elements in the object...
            return url_parts[0];  // ...just return the path.
        }

        var param_pairs = _.sortBy(_.pairs(used_params), function(x) {return x[0];});
        return url_parts[0] + '?' + _.map(
            param_pairs,
            function(pair) {
                if (typeof pair[1] === 'undefined')
                    return encodeURIComponent(pair[1]);
                else
                    return encodeURIComponent(pair[0]) + '=' +
                           encodeURIComponent(pair[1]);
            }
        ).join('&');
    }

    z.page.on('fragmentloaded', function(event, href, popped, state) {

        if (!state) return;

        // Clean the path's parameters.
        // /foo/bar?foo=bar&q=blah -> /foo/bar?q=blah
        state.path = extract_nav_url(state.path);

        // Truncate any closed navigational loops.
        for (var i=0; i<stack.length; i++) {
            if (stack[i].path === state.path) {
                stack = stack.slice(i+1);
                break;
            }
        }

        // Are we home? clear any history.
        if (state.type == 'root') {
            stack = [state];

            // Also clear any search queries living in the search box.
            // Bug 790009
            $('#search-q').val('');
        } else {
            // handle the back and forward buttons.
            if (popped && stack[0].path === state.path) {
                stack.shift();
            } else {
                stack.unshift(state);
            }

            // Does the page have a parent? If so, handle the parent logic.
            if (z.context.parent) {
                var parent = _.indexOf(_.pluck(stack, 'path'), z.context.parent);

                if (parent > 1) {
                    // The parent is in the stack and it's not immediately
                    // behind the current page in the stack.
                    stack.splice(1, parent - 1);
                    console.log('Closing navigation loop to parent (1 to ' + (parent - 1) + ')');
                } else if (parent == -1) {
                    // The parent isn't in the stack. Splice it in just below
                    // where the value we just pushed in is.
                    stack.splice(1, 0, {path: z.context.parent});
                    console.log('Injecting parent into nav stack at 1');
                }
                console.log('New stack size: ' + stack.length);
            }
        }

        setClass();
        setTitle();
        setCSRF();
        setType();
    });

    var $body = $('body');

    var oldClass = '';
    function setClass() {
        // We so classy.
        var page = $('#page');
        var newClass = page.data('context').bodyclass;
        $body.removeClass(oldClass).addClass(newClass);
        oldClass = newClass;
    }

    function setType() {
        // We so type-y.
        var page = $('#page');
        var type = page.data('context').type;
        $body.attr('data-page-type', type || 'leaf');
    }

    function setTitle() {
        // Something something title joke.
        var $h1 = $('#site-header h1.page');
        var title = $('#page').data('context').headertitle || '';
        $h1.text(title);
    }

    function setCSRF() {
        // We CSRFing USA.
        var csrf = $('#page').data('context').csrf;
        if (csrf) {
            $('meta[name=csrf]').val(csrf);
        }
    }

    function back() {
        // Something something back joke.
        if (stack.length > 1) {
            stack.shift();
            z.win.trigger('loadfragment', stack[0].path);
        } else {
            console.log('attempted nav.back at root!');
        }
    }

    var builder = require('builder');
    var views = require('views');

    var last_bobj = null;
    function navigate(url, params) {
        if (!url) return;

        // Terminate any outstanding requests.
        if (last_bobj) {
            last_bobj.terminate();
        }

        // If we're navigating from a hash, just pretend it's a plain old URL.
        if (url.substr(0, 2) == '#!') {
            url = url.substr(2);
        }

        console.log('Navigating', url);
        var view = views.match(url);

        var bobj = last_bobj = builder.getBuilder();
        z.page.html(view[0](bobj, view[1], params));

    }

    $('#nav-back').on('click', _pd(back));

    return {
        stack: function() {
            return stack;
        },
        back: back,
        oldClass: function() {
            return oldClass;
        },
        navigate: navigate
    };

})();
