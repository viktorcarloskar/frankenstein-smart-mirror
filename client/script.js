// Get data from main process
const ipc = require("electron-safe-ipc/guest");

var facePos;
var humanDomObj;
var middleDomObj;
var leftDomObj;
var rightDomObj;
var topDomObj;
var todayDomObj;
var tomorrowDomObj;
var dayAfterDomObj;

ElementQueries.listen();
initDates();

ipc.on("faceData", function (data) {
  //ipc.send("fromRenderer", a, b);
  //console.log(data)
  setFacePos(data)
});

function setFacePos(pos) {
  facePos = pos;
  updatehumanDomObj(pos)
}

function initDates() {
  if (!todayDomObj) {
    todayDomObj = document.getElementById('today-date')
  }
  if (!tomorrowDomObj) {
    tomorrowDomObj = document.getElementById('tomorrow-date')
  }
  if (!dayAfterDomObj) {
    dayAfterDomObj = document.getElementById('day-after-date')
  }


  var today = moment();
  var tomorrow = moment().add(1, 'days');
  var dayAfter = moment().add(2, 'days');

  todayDomObj.innerText = today.format("ddd DD MMM");
  tomorrowDomObj.innerText = tomorrow.format("ddd DD MMM");
  dayAfterDomObj.innerText = dayAfter.format("ddd DD MMM");
}

function updatehumanDomObj(pos) {
  if (!humanDomObj) {
    humanDomObj = document.getElementById('human')
  }
  if (!middleDomObj) {
    middleDomObj = document.getElementById('middle')
  }
  if (!leftDomObj) {
    leftDomObj = document.getElementById('left')
  }
  if (!topDomObj) {
    topDomObj = document.getElementById('top')
  }
  if (!rightDomObj) {
    rightDomObj = document.getElementById('right')
  }
  var size = getObjSize(humanDomObj);
  middleDomObj.style.width = pos.w + 200 + "px"
  humanDomObj.style.height = "calc(100% - " + pos.h + "px)"
  topDomObj.style.height = Math.round(pos.y*window.innerHeight - pos.h/2) + "px"
  leftDomObj.style.width = Math.round(window.innerWidth - (pos.x*window.innerWidth + pos.w/2)) + "px"
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
function attachDivResizeEvent(obj) {

}
function divSize(obj) {

}
