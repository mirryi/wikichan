import sqlite3
from flask import Flask, g, request, jsonify
from argparse import ArgumentParser

DB = 'db.sqlite'

app = Flask(__name__)


@app.route('/storage/set', methods=['POST'])
def storage_set():
    data = request.get_json()
    db_set(data['key'], data['value'])


@app.route('/storage/get/<key>')
def storage_get(key):
    result = db_get(key)
    return jsonify({'value': result})


def db_set(key: str, value: str):
    query_db('INSERT INTO storage (key, value) VALUES (?, ?)',
             [key, value])


def db_get(key: str) -> str:
    result = query_db('SELECT (value) FROM storage WHERE key = ?', key)
    return result['value']


def get_db() -> sqlite3.Connection:
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DB)
        db.row_factory = sqlite3.Row
    return db


@app.teardown_appcontext
def close_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


def query_db(query: str, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


if __name__ == '__main__':
    cli = ArgumentParser()
    cli.add_argument('--init', action='store_true')
    args = cli.parse_args()

    if args.init:
        init_db()
    app.run()
