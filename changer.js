#!/usr/bin/env node

var fs = require('fs'),
	path = require('path'),
	chalk = require('chalk'),
	shell = require('shelljs'),
	configuration = require('./configuration');

function getWallpapers() {
	var files = fs.readdirSync(configuration.WALLPAPERS_FOLDERS);

	var wallpapers = files.filter(function(file) {
		if (['.jpg', '.jpeg', '.png'].indexOf(path.extname(file)) > -1) {
			return true;
		}
	});

	return wallpapers;
}

function changeGnomeShellWallpaper(wallpaper) {
	shell.exec('gsettings set org.gnome.desktop.background picture-uri file://' + wallpaper);
	shell.exec('gsettings set org.gnome.desktop.background picture-options ' + configuration.MODE);
}

module.exports = {
	changeWallpaper: function() {
		var wallpapers = getWallpapers();
		if (wallpapers.length < 1) {
			console.error(chalk.red('Error: No wallpaper found at "' + configuration.WALLPAPERS_FOLDERS + 
				'". Exiting.'));
			return 1;
		}

		var randomWallpaper = configuration.WALLPAPERS_FOLDERS 
			+ wallpapers[Math.floor(Math.random()*wallpapers.length)];
		changeGnomeShellWallpaper(randomWallpaper);

		return 0;
	}
};
