#!/usr/bin/env node

var changer = require('./changer');

var r = changer.changeWallpaper();
if (r != 0) {
	process.exit(1);
}