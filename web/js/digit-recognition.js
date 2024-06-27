var div2 = document.getElementById("secondPhase");
div2.style.display = "none";

let model;
var canvasSize = 280;
var canvasStrokeStyle = "white";
var canvasLineJoin = "round";
var canvasLineWidth = 10;
var canvasBackgroundColor = "black";
var canvasId = "canvas";

var clickX = new Array();
var clickY = new Array();
var clickD = new Array();
var drawing;



// Create canvas
var canvasBox = document.getElementById("canvas_box");
var canvas = document.createElement("canvas");

canvas.setAttribute("width", canvasSize);
canvas.setAttribute("height", canvasSize);
canvas.setAttribute("id", canvasId);
canvas.style.backgroundColor = canvasBackgroundColor;
canvasBox.appendChild(canvas);
if(typeof G_vmlCanvasManager != "undefined") {
  canvas = G_vmlCanvasManager.initElement(canvas);
}

ctx = canvas.getContext("2d");


function canvasMouseListeners() {
    canvas.addEventListener("mousedown", function (e) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX- rect.left;;
        var mouseY = e.clientY- rect.top;
        drawing = true;
        addUserGesture(mouseX, mouseY);
        drawOnCanvas();
    });
    
    canvas.addEventListener("mousemove", function (e) {
        if(drawing) {
            var rect = canvas.getBoundingClientRect();
            var mouseX = e.clientX- rect.left;;
            var mouseY = e.clientY- rect.top;
            addUserGesture(mouseX, mouseY, true);
            drawOnCanvas();
        }
    });
    
    canvas.addEventListener("mouseleave", function (e) {
        drawing = false;
    });
    
    canvas.addEventListener("mouseup", function (e) {
        drawing = false;
    });
}

function canvasTouchListeners() {
    canvas.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
        
        var rect = canvas.getBoundingClientRect();
        var touch = e.touches[0];
        
        var mouseX = touch.clientX - rect.left;
        var mouseY = touch.clientY - rect.top;
        
        drawing = true;
        addUserGesture(mouseX, mouseY);
        drawOnCanvas();
     
    }, false);
    
    canvas.addEventListener("touchmove", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
        if(drawing) {
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            
            var mouseX = touch.clientX - rect.left;
            var mouseY = touch.clientY - rect.top;
            
            addUserGesture(mouseX, mouseY, true);
            drawOnCanvas();
        }
    }, false);
    
    canvas.addEventListener("touchleave", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
        drawing = false;
    }, false);
    
    canvas.addEventListener("touchend", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
        drawing = false;
    }, false);
}

canvasMouseListeners();
canvasTouchListeners();

// Click function
function addUserGesture(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickD.push(dragging);
}

// Draw on canvas
function drawOnCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
 
    ctx.strokeStyle = canvasStrokeStyle;
    ctx.lineJoin    = canvasLineJoin;
    ctx.lineWidth   = canvasLineWidth;
 
    for (var i = 0; i < clickX.length; i++) {
        ctx.beginPath();
        if(clickD[i] && i) {
            ctx.moveTo(clickX[i-1], clickY[i-1]);
        } else {
            ctx.moveTo(clickX[i]-1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.stroke();
    }
}

// Clear canvas
document.getElementById("clear-button").addEventListener("click", async function () {
    div2.style.display = "none";
    document.getElementById('chart_box').style.display = "none";
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    clickX = new Array();
    clickY = new Array();
    clickD = new Array();
    document.querySelector(".prediction-text").innerHTML = "";
    document.getElementById("result_box").classList.add("d-none");
});



// Load model
async function loadModel() {
    console.log("loading model...");
    model = undefined;
    model = await tf.loadLayersModel("jsmodel/model.json");
    console.log("model loaded!");
}

loadModel();


function preprocessCanvas(image) {
    // resize the input image to target size of (1, 28, 28)
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(2)
        .expandDims()
        .toFloat();
    console.log(tensor);
    return tensor.div(255.0);
}


// Predict canvas
document.getElementById("predict-button").addEventListener("click", async function () {
    let tensor = preprocessCanvas(canvas)
    let prediction = await model.predict(tensor).data();
    let results = Array.from(prediction);
    
    document.getElementById("result_box").classList.remove('d-none');
    displayChart(results);
    displayLabel(results);
    console.log(results);
});

function displayLabel(data) {
    var max = data[0];
    var maxIndex = 0;
 
    for (var i = 1; i < data.length; i++) {
        if (data[i] > max) {
            maxIndex = i;
            max = data[i];
        }
    }
    document.querySelector(".prediction-text").innerHTML = maxIndex;
    div2.style.display = "block";
}

//------------------------------
// Chart to display predictions
//------------------------------
var chart = "";
var firstTime = 0;
function loadChart(label, data) {
    var ctx = document.getElementById('chart_box').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
 
        // The data for our dataset
        data: {
            labels: label,
            datasets: [{
                label: "Prediction",
                backgroundColor: '#f50057',
                data: data,
            }]
        },
 
        // Configuration options go here
        options: {
            animation: {
                duration: 0
            }
        }
    });
}
 
//----------------------------
// display chart with updated
// drawing from canvas
//----------------------------
function displayChart(data) {
    label = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (firstTime == 0) {
        loadChart(label, data);
        firstTime = 1;
    } else {
        chart.destroy();
        loadChart(label, data);
    }
    document.getElementById('chart_box').style.display = "block";
}