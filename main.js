
document.addEventListener("DOMContentLoaded", function (event) {
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
    var inputData = parseInput(document.getElementById("txtInput").value);
    if (inputData.error) {
        writeMessage(inputData.error);
        return;
    }

    // Get output size
    var pixelSize = document.getElementById("pixelSize").value;

    // Reformat canvas
    canvas.width = inputData.width * pixelSize;
    canvas.height = inputData.height * pixelSize;

    var ctx = canvas.getContext("2d");

    for (let y = 0; y < inputData.height; y++) {
        for (let x = 0; x < inputData.width; x++) {
            var r,g,b;
            if (inputData.type === "P3") {
                r = 255 * inputData.pixelData[3 * (y * inputData.width + x)] / inputData.maxValue;
                g = 255 * inputData.pixelData[3 * (y * inputData.width + x) + 1] / inputData.maxValue;
                b = 255 * inputData.pixelData[3 * (y * inputData.width + x) + 2] / inputData.maxValue;
            } else {
                r = g = b = 255 * inputData.pixelData[y * inputData.width + x] / inputData.maxValue;
            }

            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }
}

function parseInput(rawText) {
    var lines = rawText.split("\n");
    var dataPoints = [].concat(...lines.map(l => {
        var precomment = l.split("#")[0];
        var dataPointSet = precomment.split(" ").map(p => p.trim()).filter(x => x !== "");
        return dataPointSet;
    }));

    // Check type is supported
    var type = dataPoints.shift();
    if (["P4", "P5", "P6", "P7"].includes(type)) {
        return {
            error: "Binary NetPbm formats unsupported"
        };
    } else if (!["P1", "P2", "P3"].includes(type)) {
        return {
            error: `Header type ${type} unrecognised`
        };
    }

    // Get output size
    var width = parseInt(dataPoints.shift());
    var height = parseInt(dataPoints.shift());

    // If not P1, also get maxValue
    var maxValue = 1;
    if (type !== "P1") {
        maxValue = parseInt(dataPoints.shift());
    }

    var pixelData = dataPoints.map(p => parseInt(p));

    // If P1, invert 1s and 0s
    if (type === "P1") {
        pixelData = pixelData.map(p => 1 - p);
    }

    //Should have correct number of data points remaining
    if (pixelData.length !== width * height * (type === "P3" ? 3 : 1)) {
        return {
            error: `Invalid number of pixel values - expected ${width * height * (type === "P3" ? 3 : 1)}, actual ${pixelData.length}`
        };
    }

    return {
        type: type,
        width: width,
        height: height,
        maxValue: maxValue,
        pixelData: pixelData
    };
}
