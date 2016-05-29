#!/usr/bin/env node

var request = require('request'),
	htmlparser = require('htmlparser2');

var downloader = module.exports;

downloader.updateWallpapers = function() {
	var feed = get500pxFeed('popular');

	request.get(feed.url, function(error, response, body) {
		if (handleRequestErrors(error, response) !== 0) {
			return 1;
		}

		feed.getWallpaperUrls(body, function(wallpaperUrls) {
			console.log(wallpaperUrls);
		});
	});

	return 0;
};

function handleRequestErrors(error, response) {
	if (error) {
		console.error('Error: failed to retrieve "' + error.host + '" (error code: ' + error.code + ')');
		return 1;
	}

	if (response.statusCode != 200) {
		console.error('Error: failed to retrieve "' + response.toJSON().request.headers.referer + '" (status code: ' + response.statusCode + ')');
		return 1;
	}

	return 0;
}

function get500pxFeed(type) {
	
	var feedUrl = 'http://500px.com/' + type + '.rss';

	var wallpaperPageUrls = [];

	var parserLastTag = '';
	var feedParser = new htmlparser.Parser({
		onopentag: function(name, attribs) {
			parserLastTag = name;
		},
		ontext: function(text) {
			if (parserLastTag === 'guid') {
				wallpaperPageUrls.push(text);
			}
		},
		onclosetag: function(name) {
			parserLastTag = '';
		}
	});

	function getWallpaperUrls(feedBody, callback) {
		feedParser.write(feedBody);
		feedParser.end();

		var wallpapersUrl = [];
		wallpaperPageUrls.forEach(function(wallpaperPageUrl) {
			request.get(wallpaperPageUrl, function(error, response, body) {
				if (handleRequestErrors(error, response) !== 0) {
					return 1;
				}

				var wallpaperUrlPattern = new RegExp('https:\\\/\\\/[a-zA-Z0-9.%_\\\/]+m%3D2000[a-z0-9\\\/]+');
				var wallpaperUrlMatch = body.match(wallpaperUrlPattern);

				if (wallpaperUrlMatch !== null) {
					wallpapersUrl.push(wallpaperUrlMatch[0]);
				}
			});
		});

		callback(wallpapersUrl);
	}

	return {
		url: feedUrl,
		getWallpaperUrls: getWallpaperUrls
	};
}
