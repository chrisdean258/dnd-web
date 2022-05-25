"use strict";

function dump(json) { return element("pre", JSON.stringify(json, null, 4)) };

function render_ability_scores(json) {
	const div = element("div");
	element("h3", json.full_name, div);
	parajoin(json.desc, div)
	element("h4", "Skills", div);
	let ul = element("ul", null, div);
	for(let skill of json.skills) {
		const li = clickable("li", "", skill.name, ul);
	}
	return div;
}

function clicklist(label, items, _parent) {
	const div = element("div", "", _parent);
	if (items.length == 0) return div;
	if (label) element("h4", label, div);
	let ul = element("ul", null, div);
	for(let item of items) {
		clickable("li", "", item, ul)
	}
	return div
}

function name_desc_render(json) {
	const div = element("div");
	element("h3", json.name, div);
	parajoin(json.desc, div);
	return div;
}

const render_alignment = name_desc_render;
const render_backgrounds = name_desc_render;
const render_conditions = name_desc_render;
const render_damage_types = name_desc_render;

function render_classes(json) { return dump(json); };

function render_equipment(json) {
	const div = element("div");
	element("h3", json.name, div);
	clickable("h5", "Equipment Category: ", json.equipment_category.name, div);
	clickable("h5", "Gear Category: ", json.gear_category.name, div);
	element("h4", "Cost: " + json.cost.quantity + " " + json.cost.unit, div);
	element("h4", "Weight: " + json.weight + " lbs", div);
	parajoin(json.desc, div)
	if (json.contents.length > 0) {
		element("h4", "Contents: ", div);
		parajoin(json.contents, div)
	}
	if (json.contents.length > 0) {
		element("h4", "Properties: ", div);
		parajoin(json.properties, div)
	}

	return div;
}

function render_equipment_categories(json) {
	const div = element("div");
	element("h3", json.name, div);
	clicklist(null, json.equipment.map((i) => i.name), div);
	return div;
}

function render_prerequisites(prereqs, _parent) {
	const div = element("div", null, _parent);
	if (prereqs.length == 0) return div;
	element("h4", "Prerequisites: ", div);
	const ul = element("ul", null, div);
	for(let prereq of json.prerequisites) {
		if (prereq.ability_score) {
			const li = element("li", "Minimum " + prereq.ability_score.name + " score of " + prereq.minimum_score, ul);
			li.onclick = () => selectme(prereq.ability_score.name);
		} else {
			const eh = dump(prereq);
			const li = element("li", null, ul);
			li.append(eh);
		}
	}
}

function render_feats(json) {
	const div = element("div");
	element("h3", json.name, div);
	parajoin(json.desc, div);
	render_prerequisites(json.prerequisites, div);
	clickable("h4", "Class: ", json.class.name, ul);
	return div;
}

function render_features(json) {
	const div = element("div");
	element("h3", json.name, div);
	clickable("h4", "Class: ", json.class.name, div);
	element("h4", "Level: " + json.level, div);
	render_prerequisites(json.prerequisites, div);
	parajoin(json.desc, div);
	return div;
}

function render_languages(json) {
	const div = element("div");
	element("h3", json.name, div);
	parajoin(json.desc, div);
	element("h5", "Type: " + json.type, div);
	clicklist("Typical Speakers", json.typical_speakers, div);
	return div;
}
function render_magic_items(json) {
	const div = element("div");
	element("h3", json.name, div);
	element("h5", "Rarity: " + json.rarity.name, div);
	parajoin(json.desc, div);
	return div;
}
function render_magic_schools(json) {
	const div = element("div");
	element("h3", json.name, div);
	parajoin(json.desc, div);
	return div;
}
function render_monsters(json) { return dump(json); }
function render_races(json) { return dump(json); }

function render_rule_sections(json) {
	const div = element("div");
	element("h3", json.name, div);
	parajoin(json.desc, div);
	return div;
}

function render_rules(json) { return dump(json); }

function render_skills(json) {
	const div = element("div")
	element("h3", json.name, div);
	parajoin(json.desc, div)
	clickable("h4", "Ability Score: ", json.ability_score.name, div)
	return div;
}

function render_spells(json) { return dump(json); }
function render_subclasses(json) { return dump(json); }
function render_subraces(json) { return dump(json); }

function render_traits(json) {
	const div = element("div")
	element("h3", json.name, div);
	parajoin(json.desc, div)
	clicklist("Races:", json.races.map((i) => i.name), div);
	clicklist("Subraces:", json.subraces, div);
	clicklist("Proficiencies:", json.proficiencies, div);
	return div
}

function render_weapon_properties(json) { return dump(json); }
