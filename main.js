const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const serialport = require("serialport").SerialPort;
const mongoose = require("mongoose");

const path = require('path');
const url = require('url');
const fs = require("fs");

let mainWindow;

let config = {
  "initialised": false,
  "cte_1_a_7": "",
  "port": "",
  "dbun": "",
  "dbpw": ""
};

app.on("ready", () => {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.setMenu(null);
  //mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function(){
    mainWindow = null;
  });

  setWindow("start");
  initialise();
});

app.on("window-all-closed", function(){
  app.quit();
});

ipc.on("start", (event, args) => {
  switch(args){
    case "configuration":
      setWindow("configuration");
      break;

    case "testing":
      setWindow("testing");
      break;

    case "start":
      setWindow("scanning");
      break;

    default:
      setWindow("start");
      break;
  }
});

ipc.on("configuration", (event, args) => {
  if(args === "back"){
    setWindow("start");
  } else {
    fs.writeFileSync("config.txt", JSON.stringify(args));
    setWindow("start");
    initialise();
  }
});

ipc.on("testing", (event, args) => {
  switch (args){
    case "back":
      setWindow("start");
      break;

    case "scan":
      setWindow("testScan");
      break;

    case "database":
      setWindow("testDatabase");
      break;

    case "relays":
      setWindow("testRelays");
      break;
  }
});

ipc.on("testScan", (event, args) => {
  if(args === "back"){
    setWindow("testing");
  } else {
    event.sender.send("scan-success", args);
  }
});

ipc.on("testDatabase", (event, args) => {
  if(args === "back"){
    setWindow("testing");
  } else {
    event.sender.send("scan-validated", validateCode(args));
  }
});

ipc.on("testRelays", (event, args) => {
  if(args === "back"){
    setWindow("testing");
  } else {
    console.log(args);
  }
});

function setWindow(windowName){
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "views/" + windowName + ".html"),
    protocol: 'file:',
    slashes: true
  }));
}

function initialise(){
  if(!config.initialised){
    if(fs.existsSync("config.txt")){
      let filedata = fs.readFileSync("config.txt", "utf8");
      filedata = JSON.parse(filedata);
      config.initialised = true;
      config.cte_1_a_7 = filedata.cte_1_a_7;
      config.port = filedata.port;
      config.dbun = filedata.dbun;
      config.dbpw = filedata.dbpw;
    } else {
      dialog.showMessageBox(mainWindow, {
        "type": "info",
        "buttons": ["OK", "Cancel"],
        "title": "No Configuration",
        "message": "Please reconfigure your software"
      }, (response) => {
        if(response === 0) setWindow("configuration");
      });
    }
  }

  if(config.initialised){
    mongoose.connect("mongodb://" + config.dbun + ":" + config.dbpw + "@ds133570.mlab.com:33570/qr-controller", (err, db) => {
      if(err){
        dialog.showMessageBox(mainWindow, {
          "type": "error",
          "buttons": ["OK"],
          "title": "Database Error",
          "message": "Unable to connect to the database\nPlease check your username and password"
        }, (response) => {
          if(response === 0) setWindow("configuration");
        });
      }
    });

    // Connect to Relay Card
    console.log("Connect to Relay Card");
  }
}

function validateCode(code){
  let codeData = {
    "valid": true,
    "msgtexto_aid": "",
    "channel": 0,
    "error": 0
  }

  if(!cte_1_a_7 || !cte_8_a_9){
    codeData.valid = false;
    codeData.msgtexto_aid = "No configuration data found";
    return codeData;
  }

  // err 1: Check DB

  // err 2: Between 15 and 100
  if(code.length < 15 || code.length > 100){
    codeData.valid = false;
    codeData.msgtexto_aid = "Invalid Length";
    codeData.error = 2;
    return codeData;
  }

  // err 3: 1 to 7 = "NLE0000" (cte_1_a_7)
  if(code.substring(0, 7) !== cte_1_a_7){
    codeData.valid = false;
    codeData.msgtexto_aid = "Invalid \'cte_1_a_7\'";
    codeData.error = 3;
    return codeData;
  }

  // err 4: 8 to 9 = "01" (cte_8_a_9)
  if(code.substring(7, 9) !== cte_8_a_9){
    codeData.valid = false;
    codeData.msgtexto_aid = "Invalid \'cte_8_a_9\'";
    codeData.error = 4;
    return codeData;
  }

  // err 5: 14 to 15 = Relay Channel (01 to 04)
  let channel = code.substring(13, 15);
  console.log(channel);
  if(channel !== "01" &&
     channel !== "02" &&
     channel !== "03" &&
     channel !== "04"){
       codeData.valid = false;
       codeData.msgtexto_aid = "Invalid Channel",
       codeData.error = 5;
       return codeData;
  }
}
