const electron = require("electron");
const ipc = electron.ipcRenderer;

document.addEventListener("click", () => {
  document.getElementById("scanner-input").focus();
});

document.getElementById("input-form").addEventListener("submit", (e) => {
  if(e.preventDefault) e.preventDefault();

  let scannedCode = document.getElementById("scanner-input").value;

  ipc.send("scanning", scannedCode);

  return false;
});

ipc.on("validationResponse", function(event, args){
  document.getElementById("response").innerText = args.msgtexto_aid;
});

ipc.on("reset", function(event, args){
  if(args === false){
    document.getElementById("response").innerText = "Code Expired";
  } else {
    console.log("Ooh, what happened?");
  }
});
