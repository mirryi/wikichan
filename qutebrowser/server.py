import sqlite3
from datetime import datetime, timezone, timedelta
from flask import Flask, g, request, jsonify
from flask_cors import CORS
from argparse import ArgumentParser
from typing import Optional

DB = 'db.sqlite'

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

tz = timezone.utc


@app.route('/storage/set', methods=['POST'])
def storage_set():
    data = request.get_json()
    duration = data['duration']
    if duration is not None:
        duration = int(duration)
    db_set(data['key'], data['value'], duration)
    return jsonify({'status': 'success'})


@app.route('/storage/get/<key>', methods=['POST'])
def storage_get(key):
    result = db_get(key)
    return jsonify({'value': result})


def db_set(key: str, value: str, duration: Optional[int]):
    expires: Optional[float] = None
    if duration is not None:
        expires = (datetime.now(tz) +
                   timedelta(seconds=duration)).timestamp()

    modify_db('REPLACE INTO storage (key, value, expires) '
              'VALUES (?, ?, ?)',
              (key, value, expires))


def db_get(key: str) -> Optional[str]:
    result = query_db(
        'SELECT value, expires FROM storage WHERE key=?', (key,), True)
    if result is None:
        return None

    expires = result['expires']
    if expires is not None:
        if datetime.fromtimestamp(expires, tz=tz) <= datetime.now(tz):
            modify_db('DELETE FROM storage WHERE key=?', (key,))
            return None
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


def modify_db(query: str, args=()):
    db = get_db()
    cur = db.cursor()
    cur.execute(query, args)
    db.commit()


if __name__ == '__main__':
    cli = ArgumentParser()
    cli.add_argument('--init', action='store_true')
    args = cli.parse_args()

    if args.init:
        init_db()
    app.run()
