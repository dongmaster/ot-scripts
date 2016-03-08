// ==UserScript==
// @name        Oppaitime Total Seed Size
// @namespace   oppaitime.total.seed.size
// @description Displays the total seed size of people.
// @include     https://oppaiti.me/user.php?id=*
// @version     1
// @grant       none
// ==/UserScript==

// Change this to false if you would like to turn off caching.
// The default value is: true
var enable_cache = true;

// cache_ttl means Cache Time-To-Live.
// It basically means how long the cache will live for.
// The number is in minutes.
// So if cache_ttl were 60, then the cache would only refresh if your last
// profile visit was an hour ago.
// The default value is: 15
var cache_ttl = 15;






// Don't change anything below here
var global_size = 0;
var run_once = false;

main();

function main() {
    var seeding_list_link = document.querySelector("#comm_seeding > .brackets").href;

    if (seeding_list_link) {
        add_seeding_size_to_statistics();
    }

    // The line below and the big if block below is the cache code.
    ls = load("userscript_total_seed_size_cache");

    if (ls !== undefined && ls !== null && enable_cache === true) {
        var url = document.URL;
        if (ls[url]) {
            var old_timestamp = ls[url]["timestamp"];
            var old_result = ls[url]["result"];

            var date = new Date();
            var timestamp = date.getTime();

            if (timestamp - old_timestamp <= (cache_ttl * 60 * 1000)) {
                var seeding_size_text = document.querySelector("#userscript_total_seed_size > span");
                seeding_size_text.textContent = old_result;
                return;
            }
        }
    }

    request(seeding_list_link);
}

function get_size(size, unit) {
    switch(unit) {
        case "KiB":
        return size *1024;
        case "MiB":
        return size *1024 *1024;
        case "GiB":
        return size *1024 *1024 *1024;
        case "TiB":
        return size *1024 *1024 *1024 *1024;
    }
}

function human_readable_size(bytes) {
    var i = -1;
    var unit = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    do {
        bytes = bytes / 1024;
        i++;
    } while (bytes > 1024);

    return Math.max(bytes, 0.0).toFixed(1) + unit[i];
}

function load(key) {
    return JSON.parse(localStorage.getItem(key));
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function get_total_size_for_page(html) {
    var torrents = html.querySelectorAll(".torrent > .number_column.nobr");

    var bytes = 0;

    for (var i = 0; i < torrents.length; i++) {
        var split = torrents[i].textContent.split(" ");
        var size = split[0];
        var unit = split[1];

        bytes += get_size(size, unit);
    }

    return bytes;
}

function add_seeding_size_to_statistics() {
    // Adds a "Total seed size: Loading..." to the Statistics section of a users profile.

    var li = document.createElement("LI");
    li.id = "userscript_total_seed_size";

    li.innerHTML = "Total seed size: <span>Loading...</span>";

    document.querySelector(".box_userinfo_stats > .stats").appendChild(li);
}

function xhr(u, c, t) {
    var r = new XMLHttpRequest();
    r.onreadystatechange = function() {
        if (r.readyState == 4 && r.status == 200) {
            c(r.response);
        }
    };
    r.open("GET", u, true);
    if (t) {r.responseType = t;}
    r.send();
    r.overrideMimeType('text/plain');
    return r;
}

function request(url) {
    xhr(url, callback);
}

function callback(response) {
    var html = document.createElement("HTML");
    html.innerHTML = response;

    var next_button = html.querySelector(".pager_next");

    if (next_button) {
        run_once = true;
        var size = get_total_size_for_page(html);

        global_size += size;

        request(next_button.href);
    } else if(!next_button && run_once === false) {
        var size = get_total_size_for_page(html);

        global_size += size;

        finish(global_size);
    } else {
        finish(global_size);
    }
}

function finish(size) {
    var seeding_size_text = document.querySelector("#userscript_total_seed_size > span");
    seeding_size_text.textContent = human_readable_size(size);

    var date = new Date();
    var timestamp = date.getTime();

    var cache = load("userscript_total_seed_size_cache");

    if (cache === undefined || cache === null) {
        cache = {};
    }

    cache[document.URL] = {
        "timestamp": timestamp,
        "result": human_readable_size(size)
    };

    save("userscript_total_seed_size_cache", cache);
}
