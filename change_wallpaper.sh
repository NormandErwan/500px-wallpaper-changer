#/bin/bash

# Configuration
WALLPAPERS_FOLDERS=~/Pictures/wallpapers
MODE="zoom"


# Functions
function get_random_wallpaper {
	find $WALLPAPERS_FOLDERS -type f | shuf -n 1
}

function change_gnome_shell_wallpaper {
	gsettings set org.gnome.desktop.background picture-uri file://$1
	gsettings set org.gnome.desktop.background picture-options $MODE
}


# Main
wallpaper=$(get_random_wallpaper)
if [[ -z "$wallpaper" ]]; then
	echo "Error: No wallpaper found at \"$WALLPAPERS_FOLDERS\". Exiting."
	exit 1
fi

change_gnome_shell_wallpaper $wallpaper