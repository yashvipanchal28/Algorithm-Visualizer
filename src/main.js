const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron')
const path = require('path');
const fs = require('fs')
const { exec } = require('child_process')
const { nativeImage } = require('electron');

// Import Icon 
var image = nativeImage.createFromPath(__dirname + '/icon.png'); 

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: image, 
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      contextIsolation: false
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// Upon recieving c++ code snippet from Renderer Process
ipcMain.on('insert-compile-code', (event, arg) => {
  console.log('--------------------------------------------------------------------------------------')
  let text = arg
  var bottom
  var top
  text = text.replace(/\n/g, "\r\n");

  console.log('Reading top.cpp')
  fs.readFile('top.cpp', 'utf8', (error , data) => {
    if (error) {
      console.log('Could not read top.cpp')
      event.reply('code-not-compiled', 'File System Error')
      return 
    } 
    text = data + text
    console.log('Reading bottom.cpp')
    fs.readFile('bottom.cpp', 'utf8', (error , data) => {
      if (error) {
        console.log('Could not read bottom.cpp')
        event.reply('code-not-compiled', 'File System Error')
        return 
      } 
      text = text + data 
      // Write Contents to test.cpp
      console.log('Inserting code into test.cpp')
      fs.writeFile('test.cpp', text, (error) => { 
        if (error) {
          console.log('Could not insert code in test.cpp')
          event.reply('code-not-compiled', 'File System Error')
          return 
        } 
      })
    })
  })

  // Compile test.cpp and make executable
  console.log('Compiling test.cpp to test')
  exec('g++ test.cpp -o test', (error, stdout, stderr) => {
    if (error) {
      console.log('Could not run cmd: g++ test.cpp -o test')
      event.reply('code-not-compiled', 'Cannot Execute Command')
      return
    }

    // Execute test
    console.log('Executing compiled file test')
    exec('./test', (error, stdout, stderr) => {
      if (error) {
        console.log('Could not run: ./test')
        event.reply('code-not-compiled', 'Cannot Execute Command')
        return
      }
      
      // Send reply to Renderer
      console.log('Code compiled and executed')
      console.log('Sending stdout to Renderer process')
      event.reply('code-compiled', stdout)
    })
  })
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
