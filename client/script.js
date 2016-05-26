// Get data from main process
const ipc = require("electron-safe-ipc/guest");

var facePos;
var faceDomObj;

ipc.on("faceData", function (data) {
  //ipc.send("fromRenderer", a, b);
  //console.log(data)
  setFacePos(data)
});

function setFacePos(pos) {
  facePos = pos;
  updateFaceDomObj(pos)
}

function updateFaceDomObj(pos) {
  if (!faceDomObj) {
    faceDomObj = document.getElementById('face')
  }
  var size = getObjSize(faceDomObj);
  faceDomObj.style.width = pos.w + "px"
  faceDomObj.style.height = pos.h + "px"
  faceDomObj.style.top = pos.y*window.innerHeight - pos.h/2 + "px"
  faceDomObj.style.left =window.innerWidth - (pos.x*window.innerWidth + pos.w/2) + "px"
}

function getObjSize(obj) {
  var rect = obj.getBoundingClientRect();
  return {
           x: rect.left,
           y: rect.top,
           width: obj.innerWidth ,
           height: obj.innerHeight
         }
}
