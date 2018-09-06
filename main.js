
document.addEventListener("DOMContentLoaded", function(event) { 
    updateImage();
});

function writeMessage(message) {
    document.getElementById("message").innerText = message;
}

function updateImage() {
    // clear messages
    writeMessage("");
    var canvas = document.getElementById("output");
    
    // get data points
    parseInput(document.getElementById("txtInput").innerHTML);
}

function parseInput(rawText){
    var lines = rawText.split("\n");
    var dataPoints = [].concat(...lines.map(l => {
        var precomment = l.split("#")[0];
        var dataPointSet = precomment.split(" ").map(p => p.trim()).filter(x => x !== "");
        return dataPointSet;
    }));

    console.log(dataPoints);
}
