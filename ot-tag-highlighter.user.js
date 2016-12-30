// ==UserScript==
// @name        Oppaitime Tag Highlighter
// @namespace   oppaitime.tag.highlighter
// @description Highlights tags with colours
// @include     https://oppaiti.me/*
// @version     3
// @grant       none
// ==/UserScript==

// Edit these
var green_tags = ["yuri", "girls.only", "ahegao"];
var yellow_tags = ["blowjob", "daughter"];
var red_tags = ["shotacon", "yaoi", "guys.only"];

/* If you prefer color over colour, that's fine. You can use both when definining colours below.
** So you can use
**      "color": "#5dc65a",
** instead of
**      "colour": "#5dc65a",
**
** Also, the colour_name key is optional. It's just a reminder for you so that
** you know what colour it is that you're working with.
**
** If you are completely puzzled on how to edit the big block below, read this
** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
*/

var colour_settings = [
    {
        "array": green_tags,
        "colour": "#5dc65a",
        "colour_name": "Green",
    },
    {
        "array": yellow_tags,
        "colour": "#e0e63a",
        "colour_name": "Yellow",
    },
    {
        "array": red_tags,
        "colour": "#e74949",
        "colour_name": "Red",
    }
]

// I would suggest not editing anything below here unless you know JavaScript.
var tags = document.querySelectorAll(".tags a");

if (tags.length === 0) {
    var tags = document.querySelectorAll(".stats a");
}

var colour_map = {};

colour_settings.forEach(function(def) { def.array.forEach(function(tag) {
	colour_map[tag] = def.colour || def.color;
}); });

Array.prototype.forEach.call(tags, function(link) {
    var c = colour_map[link.textContent];
    if (!c) {
        return; // unmapped
    }
    link.style.textShadow = c + " 0 0 8px";// + c + " 0 0 20px";
    link.style.fontWeight = "bold";
});
