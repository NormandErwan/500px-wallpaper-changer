#!/usr/bin/env node

var request = require('request'),
	htmlparser = require('htmlparser2');

var downloader = module.exports;

downloader.updateWallpapers = function() {

	var feed = getFeed500px('popular');

	request.get(feed.url, function(error, response, body) {
		if (error) {
			console.error('Error: failed to retrieve "' + feed.url + '" (error code: ' + error.code + ')');
			return 1;
		}

		if (response.statusCode != 200) {
			console.error('Error: failed to retrieve "' + feed.url + '" (status code: ' + response.statusCode + ')');
			return 1;
		}

		feed.parser.write(body);
		feed.parser.end();

		//console.log(feed.wallpaperUrls);
	});

	return 0;
};

function getFeed500px(type) {
	
	var url = 'http://500px.com/' + type + '.rss';

	var wallpaperUrls = [];

	var parserLastTag = '';
	var parser = new htmlparser.Parser({
		onopentag: function(name, attribs) {
			parserLastTag = name;
		},
		ontext: function(text) {
			if (parserLastTag == 'guid') {
				wallpaperUrls.push(text);
			}
		},
		onclosetag: function(name) {
			parserLastTag = '';
		}
	});

	return {
		url: url,
		parser: parser,
		wallpaperUrls: wallpaperUrls
	};
}
