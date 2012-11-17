
function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars)
}
function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "")
}
function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "")
}
function toHex8(b) {
	return (b < 16 ? "0" : "") + b.toString(16)
}
function hexEncodeU32(b) {
	var c = toHex8(b >>> 24);
	c += toHex8(b >>> 16 & 255);
	c += toHex8(b >>> 8 & 255);
	return c + toHex8(b & 255)
}
function awesomeHash(b) {
	for (var c = 16909125, d = 0; d < b.length; d++) {
		var HASH_SEED_ = "Mining PageRank is AGAINST GOOGLE'S TERMS OF SERVICE. Yes, I'm talking to you, scammer.";
		c ^= HASH_SEED_.charCodeAt(d % HASH_SEED_.length) ^ b.charCodeAt(d);
		c = c >>> 23 | c << 9
	}
	return hexEncodeU32(c)
}
function getPageRank(url) {
	var hash = awesomeHash(url.split("#")[0].split("//")[1]);
	var query = "http://toolbarqueries.google.com/tbr?client=navclient-auto&ch=8" + hash + "&features=Rank&q=info:" + url.split("//")[1];
	var xhr = new XMLHttpRequest();
	xhr.open("GET", query, false);
	xhr.send();
	var pageRank = "N/A";
	if (xhr.responseText.length < 15) {
		pageRank = xhr.responseText.split(":")[2].split("\n")[0]
	} else {
		pageRank = "0"
	}
	return trim(pageRank)
}
function setBadge(msg, tabId) {
	chrome.browserAction.setBadgeText({
		'text': msg,
		'tabId': tabId
	})
}
function setIcon(path, tabId) {
	console.log(path);
	chrome.browserAction.setIcon({
		'path': path,
		'tabId': tabId
	})
}
var previous_url = "";
var current_url = "";
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	var pr = getPageRank(tab.url);
	setBadge(pr, tab.id);
	setIcon("images/" + pr + ".png", tab.id)
});

