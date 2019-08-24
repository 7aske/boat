const {app, BrowserWindow, ipcMain, Menu} = require("electron");
const path = require("path");
const argv = require("yargs")(process.argv.slice(1))
	.default("url", "google.com")
	.alias("url", "u")
	.options("frame", {
		default: true,
		alias: "f",
	})
	.argv;
console.log(process.argv.slice(1));


const template = [
	{
		label: "File",
		submenu: [
			{role: "quit"},
		],
	},
	{
		label: "Browser",
		submenu: [
			{
				label: "Enter URL",
				accelerator: "CommandOrControl+L",
				click: () => openUrlWindow(),
			}, {
				label: "Close URL",
				visible: false,
				accelerator: "Esc",
				click: () => urlWindow && urlWindow.close(),
			},
			{
				label: "Reload",
				accelerator: "F5",
				click: () => {
					mainWindow && mainWindow.webContents.reload();
				},
			},
			{
				label: "Back",
				accelerator: "Alt+Left",
				click: () => {
					mainWindow && mainWindow.webContents.canGoBack() && mainWindow.webContents.goBack();
				},
			},
			{
				label: "Forward",
				accelerator: "Alt+Right",
				click: () => {
					mainWindow && mainWindow.webContents.canGoForward() && mainWindow.webContents.goForward();
				},
			},


		],
	},
	{
		label: "View",
		submenu: [
			{role: "reload"},
			{role: "forcereload"},
			{role: "toggledevtools"},
			{type: "separator"},
			{role: "resetzoom"},
			{role: "zoomin"},
			{role: "zoomout"},
			{type: "separator"},
			{role: "togglefullscreen"},
		],
	},
	{
		label: "Window",
		submenu: [
			{
				label: "Move right",
				accelerator: "CommandOrControl+Shift+Right",
				click: () => {
					mainWindow && mainWindow.setPosition(mainWindow.getPosition()[0] + 5, mainWindow.getPosition()[1]);
				},
			},

			{
				label: "Move left",
				accelerator: "CmdOrCtrl+Shift+Left",
				click: () => {
					mainWindow && mainWindow.setPosition(mainWindow.getPosition()[0] - 5, mainWindow.getPosition()[1]);
				},
			},

			{
				label: "Move up",
				accelerator: "CmdOrCtrl+Shift+Up",
				click: () => {
					mainWindow && mainWindow.setPosition(mainWindow.getPosition()[0], mainWindow.getPosition()[1] - 5);
				},
			},
			{
				label: "Move down",
				accelerator: "CmdOrCtrl+Shift+Down",
				click: () => {
					mainWindow && mainWindow.setPosition(mainWindow.getPosition()[0], mainWindow.getPosition()[1] + 5);
				},
			},
			{
				label: "Opacity +",
				accelerator: "CmdOrCtrl+Alt+Up",
				click: () => {
					const opacity = mainWindow.getOpacity();
					const newOpacity = opacity + .05;
					if (newOpacity <= 1) {
						mainWindow && mainWindow.setOpacity(newOpacity);
					}
				},
			},
			{
				label: "Opacity -",
				accelerator: "CmdOrCtrl+Alt+Down",
				click: () => {
					const opacity = mainWindow.getOpacity();
					const newOpacity = opacity - .05;
					if (newOpacity >= 0) {
						mainWindow && mainWindow.setOpacity(newOpacity);
					}
				},
			},
			{
				label: "Toggle AlwaysOnTop",
				accelerator: "CmdOrCtrl+Shift+A",
				click: () => {
					mainWindow && mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop());
				},
			},
			{role: "minimize"},
			{role: "zoom"},
			{role: "close"},
		],
	},
	{
		role: "help",
		submenu: [
			{
				label: "Learn More",
				click: async () => {
					const {shell} = require("electron");
					await shell.openExternal("https://github.com/7aske/boat");
				},
			},
		],
	},
];

const menu = Menu.buildFromTemplate(template);

let mainWindow = null;
let urlWindow = null;

async function main() {
	mainWindow = new BrowserWindow({
		center: true,
		darkTheme: true,
		autoHideMenuBar: true,
		transparent: true,
		opacity: 1,
		title: "Boat",
		icon: path.join(__dirname, "assets/icon.png"),
		frame: argv["frame"],
		backgroundColor: "black",
		disableAutoHideCursor: false,
		width: 1280,
		height: 720,
		webPreferences: {nodeIntegration: true},
	});

	mainWindow.on("move", () => {
		if (urlWindow) {
			urlWindow.setPosition(mainWindow.getBounds().x, mainWindow.getBounds().y);
			urlWindow.focus();
		}
	});
	mainWindow.on("resize", () => {
		if (urlWindow) {
			urlWindow.setSize(mainWindow.getBounds().width, 50);
		}
	});
	mainWindow.on("closed", app.exit);
	console.log(argv, process.argv);
	console.log(argv.url, argv._[0]);

	const openUrl = addProtocol(argv.url || argv._[0] || "google.com");
	try {
		await mainWindow.loadURL(openUrl);
	} catch (e) {
		mainWindow && await openUrlWindow();
	}
	mainWindow.show();
	mainWindow.setMenu(menu);
}

ipcMain.on("page-ctl", (event, args) => {
	if (mainWindow) {
		switch (args.action) {
			case "backward":
				mainWindow.webContents.canGoBack() && mainWindow.webContents.goBack();
				break;
			case "forward":
				mainWindow.webContents.canGoForward() && mainWindow.webContents.goForward();
				break;
			case "reload":
				mainWindow.webContents.reload();
				break;
		}
	}
});


ipcMain.on("url-open", async (event, args) => {
	if (mainWindow) {
		const openUrl = addProtocol(args.url);
		console.log("opening: ", openUrl);
		await mainWindow.loadURL(addProtocol(openUrl));
		urlWindow && urlWindow.close();
	}
});

async function openUrlWindow() {
	if (urlWindow) {
		return;
	}
	const bounds = mainWindow.getBounds();
	urlWindow = new BrowserWindow({
		height: 50,
		width: bounds.width,
		x: bounds.x,
		y: bounds.y,
		movable: false,
		alwaysOnTop: true,
		autoHideMenuBar: true,
		titleBarStyle: "hidden",
		frame: false,
		webPreferences: {nodeIntegration: true},
	});
	await urlWindow.loadFile("views/urlWindow.html");
	urlWindow.on("ready-to-show", urlWindow.show);
	urlWindow.on("closed", () => urlWindow = null);
	urlWindow.on("blur", () => {
		urlWindow.close();
		urlWindow = null;
	});
}

function addProtocol(link) {
	if (link.search(/^http[s]?:\/\//) === -1) {
		link = "http://" + link;
	}
	return link;
}

app.on("ready", main);
app.on("window-all-closed", app.exit);
