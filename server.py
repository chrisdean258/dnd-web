#!/usr/bin/env python3

from flask import Flask
from flask import Response
from flask import redirect
from flask import render_template
from flask import request
from flask import session
from flask import url_for
from game import Game
import dnd5eapi
import random
import string


app = Flask(__name__)
games = {}
dnd5eapi.enumerate_api()


def randId():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))


def error(msg):
    session["error"] = msg
    return redirect(url_for("index"))


def format_sse(data: str, event=None) -> str:
    msg = f'data: {data}\n\n'
    if event is not None:
        msg = f'event: {event}\n{msg}'
    return msg


def add_one_player(game, name, data=None):
    if game.try_add_player(name, data):
        game.commit()


@app.route("/", methods=["GET"])
def index():
    error = session.pop("error", None)
    return render_template("index.html", error=error)


@app.route("/new-game", methods=["POST"])
def new_game():
    gameId = request.form.get("gameId") or randId()
    if gameId in games:
        return error("gameId already in use")
    game = Game(gameId)
    games[gameId] = game
    add_one_player(game, "DM")
    session["name"] = "DM"
    return redirect(url_for("game", gameId=gameId))


@app.route("/game", methods=["POST"])
def join_game():
    if "gameId" not in request.form:
        return error("Must post with a gameId to this endpoint")
    if "name" in request.form:
        session["name"] = request.form["name"]
    return redirect(url_for("game", gameId=request.form["gameId"]))


@app.route("/game/<gameId>", methods=["GET", "POST"])
def game(gameId):
    if gameId not in games:
        return error(gameId + ": No such game")
    game = games[gameId]
    if request.method == "POST":
        if "name" in request.form:
            name = request.form["name"]
            session["name"] = name
        else:
            return error("Post request must provide name field")
    if "name" in session:
        name = session["name"]
        add_one_player(game, name)
        return render_template("game.html", game=game)
    else:
        return "Still working on this"


@app.route("/game-info/<gameId>", methods=["GET"])
def game_info(gameId):
    if gameId not in games:
        return "", 404
    game = games[gameId]
    queue = game.subscribe()
    name = session.get("name")

    def loop():
        while True:
            queue.get()
            yield format_sse(game.json())
    resp = Response(loop(), mimetype='text/event-stream')

    @resp.call_on_close
    def on_close():
        if name and game.remove_player(name):
            game.commit()

    return resp


@app.route("/leave/<gameId>", methods=["POST"])
def leave(gameId):
    name = session.get("name")
    game = games.get(gameId)
    if game and name and game.remove_player(name):
        game.commit()
    return redirect(url_for("index"))


@app.route("/api-explorer", methods=["GET"])
def api_explorer():
    return render_template("5eapisearch.html", urls=dnd5eapi.JSON_CACHE)


@app.route("/api/<path:path>")
def api(path):
    args = path.split('/')
    if len(args) != 2:
        return '', 404
    return dnd5eapi.search(*args) or ('', 404)


if __name__ == "__main__":
    app.secret_key = "Super secret"
    app.run(host='0.0.0.0')
