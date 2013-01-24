"""
Flue is a simple application which mocks out the APIs used by Fireplace.
Pointing your instance of Fireplace using settings.js will allow you to
quickly get up and running without needing your own installation of Zamboni
or without needing to use -dev (offline mode).
"""

import json
from functools import wraps

from flask import Flask, make_response, render_template, request, url_for
app = Flask("Flue")

import defaults


# Monkeypatching for CORS and JSON.
ar = app.route
@wraps(ar)
def corsify(*args, **kwargs):
    def decorator(func):
        @wraps(func)
        def wrap(*args, **kwargs):
            resp = make_response(json.dumps(func(*args, **kwargs)), 200)
            resp.headers['Access-Control-Allow-Origin'] = '*'
            resp.headers['Access-Control-Allow-Methods'] = 'GET'
            return resp

        registered_func = ar(*args, **kwargs)(wrap)
        registered_func._orig = func
        return registered_func

    return decorator

app.route = corsify


@app.route('/featured')
def featured():
    return [defaults.app('feat', 'Featured App') for i in xrange(6)]


@app.route('/categories')
def categories():
    return [
        defaults.category('shopping', 'Shopping'),
        defaults.category('games', 'Games'),
        defaults.category('productivity', 'Productivity'),
        defaults.category('tools', 'Tools'),
        defaults.category('reference', 'Reference'),
    ]


@app.route('/homepage')
def homepage():
    return {
        'featured': featured._orig(),
        'categories': categories._orig(),
    }


if __name__ == "__main__":
    app.debug = True
    app.run()
