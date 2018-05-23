const electron = require("electron");
const ipc = electron.ipcRenderer;

function back(){
  ipc.send("configuration", "back");
}

function saveConfig(){
  let cte17 = document.getElementById("cte_1_a_7").value;
  let cte89 = document.getElementById("cte_8_a_9").value;
  let port = document.getElementById("port").value;
  let dbun = document.getElementById("dbun").value;
  let dbpw = document.getElementById("dbpw").value;
  let config = {
    "cte_1_a_7": cte17,
    "cte_8_a_9": cte89,
    "port": port,
    "dbun": dbun,
    "dbpw": dbpw
  }

  ipc.send("configuration", config);
}
