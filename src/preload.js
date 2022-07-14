// Import ipcRenderer from Electron
console.log("Running Preload Script")
const { ipcRenderer } = require('electron');

//Assign ipcRenderer to window.ipcRenderer
console.log("Assigning ipcRenderer")
window.ipcRenderer = ipcRenderer
