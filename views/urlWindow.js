const {ipcRenderer} = require("electron");
const urlInp = document.querySelector("#url-inp");
window.addEventListener("keypress", (ev) => {
	switch (ev.key) {
		case "Enter":
			urlInp.value = ipcRenderer.sendSync("url-open", {url: urlInp.value});
			break;
		case "Escape":
			ipcRenderer.send("url_win-hide");
			break;
	}
});
const btnBck = document.querySelector("#btn-bck");
const btnFwd = document.querySelector("#btn-fwd");
const btnRel = document.querySelector("#btn-rel");
const btnClose = document.querySelector("#btn-close");
btnBck.addEventListener("click", () => {
	ipcRenderer.send("page-ctl", {action: "backward"});
});
btnFwd.addEventListener("click", () => {
	ipcRenderer.send("page-ctl", {action: "forward"});
});
btnRel.addEventListener("click", () => {
	ipcRenderer.send("page-ctl", {action: "reload"});
});
btnClose.addEventListener("click", () => {
	ipcRenderer.send("page-ctl", {action: "close"});
});

window.onload = () => {
	const args = ipcRenderer.sendSync("url-get");
	urlInp.value = args.url;
};
