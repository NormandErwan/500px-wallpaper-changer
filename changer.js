#!/usr/bin/env node

var fs = require('fs'),
	path = require('path'),
	chalk = require('chalk'),
	shell = require('shelljs'),
	configuration = require('./configuration');

var changer = module.exports;

changer.changeWallpaper = function() {
	var wallpapers = getWallpapers();
	if (wallpapers.length < 1) {
		console.error(chalk.red('Error: No wallpaper found at "' + configuration.WALLPAPERS_FOLDERS + '". Exiting.'));
		return 1;
	}

	var r = getNewRandomWallpaper(wallpapers, function (err, randomWallpaperFile) {
		if (err) {
			console.error(chalk.red('Error: No new wallpaper available at "' + configuration.WALLPAPERS_FOLDERS + 
			'". Exiting.'));
			return 1;
		}

		changeGnomeShellWallpaper(randomWallpaperFile);

		return 0;
	});
	return r;
}

function getWallpapers() {
	var files = fs.readdirSync(configuration.WALLPAPERS_FOLDERS);

	var wallpapers = files.filter(function(file) {
		if (['.jpg', '.jpeg', '.png'].indexOf(path.extname(file)) > -1) {
			return true;
		}
	});

	return wallpapers;
}

function getNewRandomWallpaper(wallpapers, callback) {
	var randomWallpaper = '';
	var currentWallpaper = getGnomeShellWallpaper();

	do {
		randomWallpaper = wallpapers[Math.floor(Math.random()*wallpapers.length)];
	} while (currentWallpaper == randomWallpaper || wallpapers.length < 2);

	if (currentWallpaper == randomWallpaper && wallpapers.length < 2) {
		return callback('No new wallpaper', randomWallpaperFile);
	};
	
	var randomWallpaperFile = configuration.WALLPAPERS_FOLDERS + randomWallpaper;
	return callback(null, randomWallpaperFile);
}

function getGnomeShellWallpaper() {
	var path = shell.exec('gsettings get org.gnome.desktop.background picture-uri', {silent:true}).stdout;
	var wallpaper = path.substring(path.lastIndexOf('/')+1, path.lastIndexOf('\''));
	return wallpaper;
}

function changeGnomeShellWallpaper(wallpaperFile) {
	shell.exec('gsettings set org.gnome.desktop.background picture-uri file://' + wallpaperFile);
	shell.exec('gsettings set org.gnome.desktop.background picture-options ' + configuration.MODE);
}
