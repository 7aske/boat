# Boat 

<img alt="logo" src="assets/icon.png" width="300" height="300" />

## Description

Small `electron` based borderless floating browser inspired by [pennywise](https://github.com/kamranahmedse/pennywise).

Why is it named boat? Well boats float... Most of the time at least.

## Usage 

`$ boat`

Opens `Google`

`$ boat --url=https://youtube.com/tv` 

Opens `https://youtube.com/tv` with address bar

`$ boat --no-frame --url=https://youtube.com/tv` 

Opens `https://youtube.com/tv` in a borderless window


| **Shortcut**                        | **Description**                  |
|-------------------------------------|----------------------------------|
| <kbd>F5</kbd>                       | Refresh page                     |
| <kbd>F11</kbd>                      | Toggle fullscreen                |
| <kbd>Cmd/Ctrl + L</kbd>             | Open address bar                 |
| <kbd>Cmd/Ctrl + Alt + Up</kbd>      | Increase opacity                 |
| <kbd>Cmd/Ctrl + Alt + Down</kbd>    | Decrease opacity                 |
| <kbd>Cmd/Ctrl + Shift + I</kbd>     | Show Developer Tools             |
| <kbd>Cmd/Ctrl + Shift + A</kbd>     | Toggle always on top             |
| <kbd>Alt + Left</kbd>               | Go back                          |
| <kbd>Alt + Right</kbd>              | Go forwards                      |
| <kbd>Cmd/Ctrl + Shift + Arrows</kbd>| Move window                      |
<sub>Note: On linux moving the window with title bar on results in incorrect positioning. Use your WM's preferred way of moving windows.</sub>

There is not much to it. It just offers a convenient sleek window for multitasking.

## Installation

You can always download pre-built packages in the [releases](https://github.com/7aske/boat/releases) section.

Adding the root folder to PATH variable will make it available to use from command line.


### Running from source

After cloning the repository run `npm install` to install dependencies. You then run the application with `npm start`

## Build

Scripts for building from source are available.

Windows:

`npm run build-windows`

Linux:

`npm run build-linux`
