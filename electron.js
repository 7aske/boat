const {app, BrowserWindow, ipcMain, globalShortcut} = require("electron");
const argv = require("yargs").parse(process.argv.slice(1));

let mainWindow = null;
let urlWindow = null;

async function main() {
	mainWindow = new BrowserWindow({
		center: true,
		darkTheme: true,
		autoHideMenuBar: true,
		transparent: true,
		opacity: 0.5,
		title: "Boat",
		backgroundColor: "black",
		width: 1280,
		height: 720,
		webPreferences: {nodeIntegration: true},
	});

	globalShortcut.register("CmdOrCtrl+Alt+Up", () => {
		const opacity = mainWindow.getOpacity();
		const newOpacity = opacity + .05;
		if (newOpacity <= 1) {
			mainWindow && mainWindow.setOpacity(newOpacity);
		}
	});
	globalShortcut.register("CmdOrCtrl+Alt+Down", () => {
		const opacity = mainWindow.getOpacity();
		const newOpacity = opacity - .05;
		if (newOpacity >= 0) {
			mainWindow && mainWindow.setOpacity(newOpacity);
		}
	});
	globalShortcut.register("CmdOrCtrl+Shift+A", () => {
		mainWindow && mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop());
	});
	globalShortcut.register("CmdOrCtrl+Shift+I", () => {
		BrowserWindow.getFocusedWindow().webContents.openDevTools();
	});
	globalShortcut.register("F5", () => {
		mainWindow && mainWindow.webContents.reload();
	});
	globalShortcut.register("Alt+Left", () => {
		mainWindow && mainWindow.webContents.canGoBack() && mainWindow.webContents.goBack();
	});
	globalShortcut.register("Alt+Right", () => {
		mainWindow && mainWindow.webContents.canGoForward() && mainWindow.webContents.goForward();
	});
	globalShortcut.register("Escape", () => {
		urlWindow && urlWindow.close();
	});
	globalShortcut.register("CmdOrCtrl+L", () => {
		!urlWindow && openUrlWindow();
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
	mainWindow.setMenu(null);
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
	const bounds = mainWindow.getBounds();
	urlWindow = new BrowserWindow({
		height: 50,
		width: bounds.width,
		x: bounds.x,
		y: bounds.y,
		// resizable: false,
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
	if (link.search(/^http[s]?:\/\//) ===-1) {
		link = 'http://' + link;
	}
	return link;
}

app.on("ready", main);
app.on("window-all-closed", app.exit);
