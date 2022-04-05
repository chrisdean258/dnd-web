#!/usr/bin/env python3

import json
import queue


class Game:
    def __init__(self, gameId):
        self.gameId = gameId
        self.players = {}
        self.version = 0
        self.queues = []

    def try_add_player(self, name, data=None):
        if name in self.players:
            return False
        self.add_player(name, data)
        return True

    def add_player(self, name, data=None):
        self.players[name] = data

    def remove_player(self, name):
        if name in self.players:
            del self.players[name]
            return True
        return False

    def __repr__(self):
        return f"{self.__class__.__qualname__}(gameId={self.gameId})"

    def json(self):
        return json.dumps({
            "version": self.version,
            "gameId": self.gameId,
            "players": list(self.players)
        })

    def subscribe(self):
        q = queue.Queue()
        self.queues.append(q)
        return q

    def commit(self):
        self.version += 1
        for q in self.queues:
            q.put(None)
