const electron = require("electron");
const ipc = electron.ipcRenderer;

function back(){
  ipc.send("configuration", "back");
}

function saveConfig(){
  let cte = document.getElementById("cte_1_a_7").value;
  let port = document.getElementById("port").value;
  let dbun = document.getElementById("dbun").value;
  let dbpw = document.getElementById("dbpw").value;
  let config = {
    "cte_1_a_7": cte,
    "port": port,
    "dbun": dbun,
    "dbpw": dbpw
  }

  ipc.send("configuration", config);
}
