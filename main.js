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
  const ipc = require("electron-safe-ipc/host");
  var subpy = require('child_process').spawn('python', ['./kinect_person_tracking.py']);
  //var subpy = require('child_process').spawn('./dist/hello.exe');
  var rq = require('request-promise');
  var mainAddr = 'http://localhost:5000';

  subpy.stdout.on('data', function(data) {
    var strData = "" + data;
    console.log(strData);
    var arrayData = strData.split("[[");
    arrayData = arrayData[1].split("]]");
    arrayData = arrayData[0].split(" ");

    // Start JSON string
    strData = "{";

    var inserted = 0;
    for (var i = 0; i < arrayData.length; i++) {
      // Test if number
      var number = parseInt(arrayData[i]);
      if (!isNaN(number)) {
        switch (inserted) {
          case 0:
            strData += "\"x\":" + arrayData[i] + ","
            break;
          case 1:
            strData += "\"y\":" + arrayData[i] + ","
            break;
          case 2:
            strData += "\"w\":" + arrayData[i] + ","
            break;
          case 3:
            strData += "\"h\":" + arrayData[i] + ","
            break;
          case 4:
            strData += "\"d\":" + arrayData[i]
            break;
          default:
           break;
        }
        inserted++;
      }
    }
    // End JSON string
    strData += "}"
    //console.log(strData)

    //console.log(strData)
    //strData = "{" + "\"w\":" + arrayData[0].substring(2, arrayData[0].length - 1) + "}"
    var jsonData = JSON.parse(strData)
    //console.log(jsonData)
    ipc.send("faceData", jsonData);
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
