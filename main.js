/* 
 *  Some notes:
 *  document.querySelector("[customtag=bob]") can be called thousands of times per second, but is technically half as fast as document.getElementById().
 *
 *
 */


function writeLog(log) {
    var node = document.createElement("div");
    node.appendChild(document.createTextNode(log));
    document.getElementById("scrollLog").appendChild(node);
    document.getElementById("scrollLog").appendChild(document.createElement("br"));
}

var cores = {
    sky: {onComplete: null, corePower: 1, timeRemaining: null}
};

var idledots = ".";
var workSpin = "|";

function tick() {

    for (let [key, value] of Object.entries(cores)) {
        if(typeof value.timeRemaining === 'number') {
            value.timeRemaining -= value.corePower;
            if(value.timeRemaining <= 0) {
                value.onComplete.call();
                document.querySelector("[coreName=" + key + "]").innerHTML = "Core Idle <span class=\"idleDots\">" + idledots + "</span>";
                value.timeRemaining = null;
            }
        }
    }

    switch(idledots) {
        case ".":
            idledots = "..";
            break;
        case "..":
            idledots = "...";
            break;
        default:
            idledots = ".";
            break;
    }
    switch(workSpin) {
        case "|":
            workSpin = "/";
            break;
        case "/":
            workSpin = "-";
            break;
        case "-":
            workSpin = "\\";
            break;
        default:
            workSpin = "|";
    }
    for ( i = 0; i < document.getElementsByClassName("idleDots").length; i++) {
        var element = document.getElementsByClassName("idleDots")[i];
        element.innerText = idledots;
    }

    for ( i = 0; i < document.getElementsByClassName("workSpin").length; i++) {
        var element = document.getElementsByClassName("workSpin")[i];
        element.innerText = workSpin;
    }

    window.setTimeout(tick, 300);
}

function init() {
    window.setTimeout(tick, 300);
    writeLog("In the beginning... things were available to do");
    document.querySelector("[actionId=thing]").onclick = function () {
        document.querySelector("[coreName=sky]").innerHTML = "Doing a thing <span class=\"workSpin\">" + workSpin + "</span>";
        cores.sky.onComplete = function() {writeLog("A thing has indeed been done");};
        cores.sky.timeRemaining = 10;
    }
}

window.onload = init;
