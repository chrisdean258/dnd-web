"use strict";

function Get(url, callback) {
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	}
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

function JSONFormat(str) {
	let json = JSON.parse(str);
	return JSON.stringify(json, null, 4);
}
