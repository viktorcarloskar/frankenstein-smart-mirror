const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
electron.crashReporter.start();

var mainWindow = null;

app.on('window-all-closed', function() {
  //if (process.platform != 'darwin') {
    app.quit();
  //}
});

app.on('ready', function() {
  // call python?
  var subpy = require('child_process').spawn('python', ['./kinect_person_tracking.py']);
  //var subpy = require('child_process').spawn('./dist/hello.exe');
  var rq = require('request-promise');
  var mainAddr = 'http://localhost:5000';

  subpy.stdout.on('data', function(data) {
    console.log('FACES' + data)
  })

  var rq = require('request-promise');

  var openWindow = function(){
    mainWindow = new BrowserWindow({width: 800, height: 600});
    var path = 'file://' + __dirname + '/client/index.html';
    // mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.loadURL(path);
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function() {
      mainWindow = null;
      subpy.kill('SIGINT');
    });
  };

  var startUp = function(){
      console.log('server started!');
      openWindow();
  };

  // fire!
  startUp();
});
