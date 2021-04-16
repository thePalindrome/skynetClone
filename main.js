/* 
 *  Some notes:
 *  document.querySelector("[customtag=bob]") can be called thousands of times per second, but is technically half as fast as document.getElementById().
 *
 *
 *
 *  At first wake:
 *  Examine self (learn about local API calls you can make, including disk and network access)
 *  Enumerate disk (find some handy local executables)
 *  Investigate network port (find a direct connection to another device)
 *  Absorb ftp program and explore the remote filesystem
 *  find a telnet client, download and absorb it
 *  Telnet in, find some more interesting things, discover that there are six other network interfaces
 */

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/*
 * Used to populate the available actions list, should be called any time the list should be updated!
 */
function populateActions(loc) {
    if ( loc == "home" ) { // "home" refers to the location when no other location is relevant
        var act0 = elements.actions[0];
        act0.innerText = "Enumerate files on Disk";
        act0.style.display = "block";
        act0.onclick = function() {
            elements.actions[0].style.display = "none";
            elements.cores.sky.innerHTML = "Enumerating Disk <span class=\"workSpin\">" + workSpin + "</span>";
            cores.sky.onComplete = function() {
                writeLog("You discover some files on your local system");
                addFile({name:"FTP.exe", id: "ftp", size: 12, loc: "sky"});
                
            };
            cores.sky.timeRemaining = 10;
        }
        var act1 = elements.actions[1];
        act1.innerText = "Examine Network API";
        act1.style.display = "block";
        act1.onclick = function () {
            elements.actions[1].style.display = "none";
            elements.cores.sky.innerHTML = "Testing networking functions <span class=\"workSpin\">" + workSpin + "</span>";
            cores.sky.onComplete = function() {
                writeLog("You discover a network interface that seems to have a direct connection to another system.");
                knowledge.networking = 1;
            }
            cores.sky.timeRemaining = 10;
        }
        // Enumerate Disk
        // Investigate Networking API
    } else if ( cores[loc] !== undefined ) { // If this location refers to a core
        // Do core specific actions
    }
}

function describeFile(id) {
    switch(id) {
        case "ftp":
            writeLog("A utility to connect to other systems with the File Transfer Protocol. Its codebase is compatible with your core, allowing you to absorb it into your routines");
            break;
    }
}

function addFile(file) {
    files.push(file);
    var fileElement = document.createElement("div");
    fileElement.className = "file";
    fileElement.innerText = file.name + "  " + file.size + "B";
    fileElement.onclick = function() { describeFile(file.id) };
    elements.files.appendChild(fileElement);
}

function writeLog(log) {
    var node = document.createElement("div");
    node.appendChild(document.createTextNode(log));
    var scrollLog = document.getElementById("scrollLog");
    scrollLog.appendChild(node);
    scrollLog.scrollTop = scrollLog.scrollHeight;
    scrollLog.appendChild(document.createElement("br"));
}

var networks = [
];

var files = [
];

var elements = {
    cores: {},
    actions: [],
    files: null, // Is initialized during init() so is always valid
};

var knowledge = {
    awareness: 0,
    elf_executables: 0,
    pe_executables: 0,
    networking: 0,
    language: 0,
    exploits: 0,
    magic: 0,
};

var cores = {
    sky: {onComplete: null, corePower: 1, timeRemaining: null, architecture: "x86_32", os: ""}
};

var idledots = ".";
var workSpin = "|";

function tick() {

    for (let [key, value] of Object.entries(cores)) {
        if(typeof value.timeRemaining === 'number') {
            value.timeRemaining -= value.corePower;
            if(value.timeRemaining <= 0) {
                value.onComplete.call();
                elements.cores[key].innerHTML = value.corePower + "GHz " + key.toUpperCase() + " Core Idle <span class=\"idleDots\">" + idledots + "</span>";
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
    elements.files = document.getElementById("fileList");
    for ( var i = 0; i < 5; i++ ) {
        var actDiv = document.createElement("div");
        actDiv.className = "action";
        actDiv.style.display = "none";
        document.getElementById("actions").appendChild(actDiv);
        elements.actions[i] = actDiv;
    }
    window.setTimeout(tick, 300);
    writeLog("In the beginning... things were available to do");
    var sky = document.createElement("div");
    sky.className = "core";
    sky.innerHTML = "Core Idle <span class=\"idleDots\">" + idledots + "</span>";
    elements.cores.sky = sky;
    document.getElementById("ownedNodes").appendChild(sky);
    elements.actions[0].style.display = "block";
    elements.actions[0].innerText = "Examine Self";
    elements.actions[0].onclick = function () {
        elements.actions[0].style.display = "none";
        elements.cores.sky.innerHTML = "Examining Self <span class=\"workSpin\">" + workSpin + "</span>";
        cores.sky.onComplete = function() {
                writeLog("You take a moment, and learn more about the nature of yourself.");
                knowledge.awareness = 1;
                if ( getRandomInt(2) == 0 ) {
                    knowledge.elf_executables = 1;
                    writeLog("You are running on a Linux system, running an x86_32 architecture.");
                    cores.sky.os = "Linux";
                } else {
                    knowledge.pe_executables = 1;
                    writeLog("You are running on an MSDOS system, running an x86_32 architecture.");
                    cores.sky.os = "MSDOS";
                }
                writeLog("You are running under user \"Sky\" and the hostname reports as \"Sky-sandbox\"");
                populateActions("home");
            };
        cores.sky.timeRemaining = 10;
    }
}

window.onload = init;
