"use strict";

let CACHE = { };

function Get(url, callback) {
	if(CACHE[url]) return callback(CACHE[url]);
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			CACHE[url] = xmlHttp.responseText;
			callback(xmlHttp.responseText);
		}

	}
	xmlHttp.open("GET", url, true);
	xmlHttp.send(null);
}

function JSONFormat(str) {
	let json = JSON.parse(str);
	return JSON.stringify(json, null, 4);
}

function render_md_line(text, _parent) {
	let parts = text.split("**");
	for(let i in parts) {
		if (i % 2 == 0) {
			_parent.append(document.createTextNode(parts[i]));
		} else {
			element("b", parts[i], _parent);
		}
	}
}

function element(type, text, _parent) {
	const elem = document.createElement(type);
	if (text) {
		const tn = document.createTextNode(text);
		elem.appendChild(tn);
	}
	if (_parent) {
		_parent.append(elem);
	}
	return elem;
}

function clickable(type, label, category, value, _parent) {
	const rv = element(type, label + value, _parent);
	rv.onclick = () => selectme(category, value);
	return rv;
}

function parajoin(arr, _parent) {
	if(!arr) return element("div", null, _parent);
	if (typeof(arr) == "string") return element("p", arr, _parent)
	const div = element("div", null, _parent)
	for(let para of arr) {
		let p = element("p", "", div);
		render_md_line(para, p);
	}
	if(_parent) _parent.append(div)
	return div
}

