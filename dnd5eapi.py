#!/usr/bin/env python3

import requests
import json
import os
import functools
from pprint import pprint


BASE = "https://www.dnd5eapi.co"
CACHE = {}
JSON_CACHE = None


def enumerate_api():
    global CACHE
    global JSON_CACHE
    if os.path.isfile("API_CACHE"):
        with open("API_CACHE", "r") as f:
            CACHE = json.load(f)
        JSON_CACHE = json.dumps(CACHE)
        return

    categories = requests.get(BASE + "/api/").json()
    for k, v in categories.items():
        req = requests.get(BASE + v).json()
        for item in req.get("results", []):
            CACHE[item["name"]] = {
                "url": item["url"],
                "category": k
            }
    JSON_CACHE = json.dumps(CACHE)
    with open("API_CACHE", "w") as f:
        json.dump(CACHE, f)


@functools.lru_cache(maxsize=None)
def search(category, spec):
    print("querying api for ", category, spec)
    url = '/'.join((BASE, "api", category, spec))
    req = requests.get(url)
    if req.status_code == 200:
        return req.text
    return None


def get_json():
    if not JSON_CACHE:
        enumerate_api()
    return JSON_CACHE


if __name__ == '__main__':
    enumerate_api()
    pprint(CACHE)
