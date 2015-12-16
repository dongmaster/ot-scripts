// ==UserScript==
// @name        Oppaitime Tag Highlighter
// @namespace   oppaitime.tag.highlighter
// @description Makes preferred tags green
// @include     https://oppaiti.me/*
// @version     1
// @grant       none
// ==/UserScript==

// Edit these
var green_tags = ["yuri", "girls.only"];
var yellow_tags = ["ahegao"];
var red_tags = ["yaoi", "guys.only"];



var GREEN = "#5dc65a";
var YELLOW = "#e0e63a";
var RED = "#e74949";

var tags_containers = document.getElementsByClassName("tags");

for (var i = 0; i < tags_containers.length; i++) {
  var tags = tags_containers[i].getElementsByTagName("A");

  for (var j = 0; j < tags.length; j++) {
    var tag = tags[j];

    for (var k = 0; k < green_tags.length; k++) {
      if (tag.textContent === green_tags[k]) {
        tag.style.color = GREEN;
        tag.style.fontWeight = "bold"
      }
    }

    for (var kk = 0; kk < yellow_tags.length; kk++) {
      if (tag.textContent === yellow_tags[kk]) {
        tag.style.color = YELLOW;
        tag.style.fontWeight = "bold"
      }
    }

    for (var kkk = 0; kkk < red_tags.length; kkk++) {
      if (tag.textContent === red_tags[kkk]) {
        tag.style.color = RED;
        tag.style.fontWeight = "bold"
      }
    }
  }
}
