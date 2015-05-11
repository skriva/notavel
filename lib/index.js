var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

if (process.env.DEBUG === 'enabled') {
  app.commandLine.appendSwitch('remote-debugging-port', '8315');
  app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1');
  console.log('Visit http://localhost:8315 to start debugging.\n');
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') { app.quit(); }
});

// This method will be called when electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1100, height: 700});

  // and load the index.html of the app.
  /* eslint no-path-concat:0 */
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.webContents.executeJavaScript([
    'require("../vendor/bootstrap-jsx");',
    'require("babel/polyfill.js"); ',
    'require("./ui/app.jsx");'
  ].join('\n'));

  mainWindow.on('enter-full-screen', function (event) {
    mainWindow.webContents.send('enter-full-screen', event);
  });

  mainWindow.on('leave-full-screen', function (event) {
    mainWindow.webContents.send('leave-full-screen', event);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
