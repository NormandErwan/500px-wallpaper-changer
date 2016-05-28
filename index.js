#!/usr/bin/env node

var downloader = require('./downloader'),
	changer = require('./changer');

var r1 = downloader.updateWallpapers();
if (r1 != 0) {
	process.exit(r1);
}

var r2 = changer.changeWallpaper();
if (r2 != 0) {
	process.exit(r2);
}