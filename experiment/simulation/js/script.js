// Pendulum properties
let length1 = 100; // Length of the first pendulum arm
let length2 = 100; // Length of the second pendulum arm
let angle1 = Math.PI / 8; // Initial angle of the first pendulum arm
let angle2 = Math.PI / 8; // Initial angle of the second pendulum arm
let mass1 = 25; // Mass of the first pendulum bob
let mass2 = 25; // Mass of the second pendulum bob
let gravity = 9.80; // Acceleration due to gravity

// current slider
let cslider1 = document.getElementById("cslider1");
let cslider2 = document.getElementById("cslider2");
let cslider3 = document.getElementById("cslider3");
let cslider4 = document.getElementById("cslider4");
let cslider5 = document.getElementById("cslider5");
let coutput1 = document.getElementById("len1value");
let coutput2 = document.getElementById("len2value");
let coutput3 = document.getElementById("mass1value");
let coutput4 = document.getElementById("mass2value");
let coutput5 = document.getElementById("gravityvalue");
coutput1.innerHTML = cslider1.value;
cslider1.oninput = function () {
    coutput1.innerHTML = this.value;
    length1 = this.value;
}
coutput2.innerHTML = cslider2.value;
cslider2.oninput = function () {
    coutput2.innerHTML = this.value;
    length2 = this.value;
}
coutput3.innerHTML = cslider3.value;
cslider3.oninput = function () {
    coutput3.innerHTML = this.value;
    // mass1 = this.value;
}
coutput4.innerHTML = cslider4.value;
cslider4.oninput = function () {
    coutput4.innerHTML = this.value;
    // mass2 = this.value;
}
coutput5.innerHTML = cslider5.value;
cslider5.oninput = function () {
    coutput5.innerHTML = this.value;
    gravity = this.value;
}
function slider_reset() {
    document.getElementById('len1value').innerText = "100";
    document.getElementById('cslider1').value = 100;
    document.getElementById('len2value').innerText = "100";
    document.getElementById('cslider2').value = 100;
    document.getElementById('mass1value').innerText = "25";
    document.getElementById('cslider3').value = 25;
    document.getElementById('mass2value').innerText = "25";
    document.getElementById('cslider4').value = 25;
    document.getElementById('gravityvalue').innerText = "9.80";
    document.getElementById('cslider5').value = 9.80;
}

document.getElementById("cslider1").addEventListener("change", sliderlen1);
function sliderlen1() {
    document.getElementById("len1value").innerHTML = cslider1.value;
    length1 = cslider1.value;
}
document.getElementById("cslider2").addEventListener("change", sliderlen2);
function sliderlen2() {
    document.getElementById("len2value").innerHTML = cslider2.value;
    length2 = cslider2.value;
}
document.getElementById("cslider3").addEventListener("change", slidermass1);
function slidermass1() {
    document.getElementById("mass1value").innerHTML = cslider3.value;
    // mass1 = cslider3.value;
}
document.getElementById("cslider4").addEventListener("change", slidermass2);
function slidermass2() {
    document.getElementById("mass2value").innerHTML = cslider4.value;
    // mass2 = cslider4.value;
}
document.getElementById("cslider5").addEventListener("change", slidergravity);
function slidergravity() {
    document.getElementById("gravityvalue").innerHTML = cslider5.value;
    gravity = cslider5.value;
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let isDragging = false; // Flag to indicate if the pendulum is being dragged
let mouseX = 0; // X-coordinate of the mouse position
let mouseY = 0; // Y-coordinate of the mouse position

// Add event listeners for mouse events
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

// Event handler for mouse down event
function handleMouseDown(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    isDragging = true;
}

// Event handler for mouse move event
function handleMouseMove(event) {
    if (isDragging) {
        const dx = event.clientX - mouseX;
        const dy = event.clientY - mouseY;
        
        // Update pendulum angles based on mouse movement
        angle1 += dx * 0.005;
        angle2 += dy * 0.005;
        
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
}

// Event handler for mouse up event
function handleMouseUp() {
    isDragging = false;
}

// Simulation properties
const dt = 0.020; // Time step
const stepsPerFrame = 10; // Number of simulation steps per frame
let t = 1; // Current time

let angularVelocity1 = 0; // Angular velocity of the first pendulum arm
let angularVelocity2 = 0; // Angular velocity of the second pendulum arm
let angularAcceleration1 = 0;
let angularAcceleration2 = 0;

let potentialEnergy = 0;
let kineticEnergy = 0;
let totalEnergy = 0;

function update() {
    // Perform multiple simulation steps per frame
    for (let i = 0; i < stepsPerFrame; i++) {
        const numerator1 = -gravity * (2 * mass1 + mass2) * Math.sin(angle1);
        const numerator2 = -mass2 * gravity * Math.sin(angle1 - 2 * angle2);
        const numerator3 = -2 * Math.sin(angle1 - angle2) * mass2;
        const numerator4 = angularVelocity2 * angularVelocity2 * length2 + angularVelocity1 * angularVelocity1 * length1 * Math.cos(angle1 - angle2);
        const denominator = length1 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * angle1 - 2 * angle2));

        angularAcceleration1 = (numerator1 + numerator2 + numerator3 * numerator4) / denominator;
        const numerator5 = 2 * Math.sin(angle1 - angle2);
        const numerator6 = angularVelocity1 * angularVelocity1 * length1 * (mass1 + mass2);
        const numerator7 = gravity * (mass1 + mass2) * Math.cos(angle1);
        const numerator8 = angularVelocity2 * angularVelocity2 * length2 * mass2 * Math.cos(angle1 - angle2);
        const denominator2 = length2 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * angle1 - 2 * angle2));

        angularAcceleration2 = (numerator5 * (numerator6 + numerator7 + numerator8)) / denominator2;

        angularVelocity1 += dt * angularAcceleration1;
        angularVelocity2 += dt * angularAcceleration2;
        // Update pendulum angles and velocities using Euler's method
        angle1 += dt * angularVelocity1;
        angle2 += dt * angularVelocity2;

        // Update time
        t += dt;

        potentialEnergy = -mass1*gravity*length1*Math.cos(angle1) - mass2*gravity*(length1*Math.cos(angle1) + length2*Math.cos(angle2));
        kineticEnergy = (0.5 * mass1 * (length1^2) * (angularVelocity1^2)) + (0.5 * mass2 * ((length1^2) * (angularVelocity1^2) + (length2^2) * (angularVelocity2^2) + 2 * length1 * length2 * angularVelocity1 * angularVelocity2 * Math.cos(angle1 - angle2)));
        totalEnergy = potentialEnergy + kineticEnergy;
    }   
}
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate pendulum positions
    const x1 = length1 * Math.sin(angle1);
    const y1 = length1 * Math.cos(angle1);
    const x2 = x1 + length2 * Math.sin(angle2);
    const y2 = y1 + length2 * Math.cos(angle2);

    // Draw pendulums
    ctx.beginPath();
    ctx.moveTo(300, 200);
    ctx.lineTo(300 + x1, 200 + y1);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(300 + x1, 200 + y1);
    ctx.lineTo(300 + x2, 200 + y2);
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Draw bobs
    ctx.beginPath();
    ctx.arc(300 + x1, 200 + y1, mass1 / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(300 + x2, 200 + y2, mass2 / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
}
function loop() {
	update();
	draw();
	requestAnimationFrame(loop);
}

loop();

// Initialize empty data arrays
let xData = [];
let yData = [];

function Graph() {
    document.getElementById("canvas").style.display = "none";
    document.getElementById("graph").style.display = "block";
    document.getElementById("Timegraph").style.display = "none";
    document.getElementById("clearbutton").style.display = "block";
    document.getElementById("clearbutton2").style.display = "none";

    document.getElementById("simbutton").disabled = false;
    document.getElementById("graphbutton").disabled = true;
    document.getElementById("timegraph").disabled = false;

    document.getElementById("length1").style.display = "none";
    document.getElementById("length2").style.display = "none";
    document.getElementById("mass1").style.display = "none";
    document.getElementById("mass2").style.display = "none";
    document.getElementById("gravity").style.display = "none";

    document.getElementById("g1").style.display = "none";
    document.getElementById("g2").style.display = "none";

    // Create the initial trace with empty data
    const trace = {
        x: xData,
        y: yData,
        type: 'scatter',
        mode: 'lines',
        line: {
            color: 'lime',
            width: 1,
            shape: 'spline'
        }
    };

    // Create the plot
    const layout = {
        title: 'Angle1 vs Angle2 Graph',
        width: 600,
        height: 520,
        xaxis: {
            title: 'Angle1'
        },
        yaxis: {
            title: 'Angle2'
        }
    };

    Plotly.newPlot('graph', [trace], layout);

    // Function to update the pendulum's position and plot the data
    function updatePosition() {
            // update();

            // Add the new position to the data arrays
            xData.push(angle1);
            yData.push(angle2);

            // Update the trace with the new data
            Plotly.update('graph', {
                x: [xData],
                y: [yData]
            });
        // }
    }

    // Example: Update the pendulum's position every frame
    function loop() {
        updatePosition();
        requestAnimationFrame(loop);
    }

    loop();
}

function clearGraph() {
    xData = []; // Clear xData array
    yData = []; // Clear yData array

    Plotly.update('graph', {
        x: [xData],
        y: [yData]
    });
}

// Initialize empty data arrays
let x1Data = [];
let y1Data = [];
let y2Data = [];

// Define the maximum number of data points to display on the graph
const maxDataPoints = 400; // Adjust this value as needed

function Timegraph() {
    document.getElementById("canvas").style.display = "none";
    document.getElementById("graph").style.display = "none";
    document.getElementById("Timegraph").style.display = "block";
    document.getElementById("clearbutton").style.display = "none";
    document.getElementById("clearbutton2").style.display = "block";

    document.getElementById("simbutton").disabled = false;
    document.getElementById("graphbutton").disabled = false;
    document.getElementById("timegraph").disabled = true;

    document.getElementById("length1").style.display = "none";
    document.getElementById("length2").style.display = "none";
    document.getElementById("mass1").style.display = "none";
    document.getElementById("mass2").style.display = "none";
    document.getElementById("gravity").style.display = "none";

    document.getElementById("g1").style.display = "block";
    document.getElementById("g2").style.display = "block";
    
    const trace = [
        {
            x: x1Data,
            y: y1Data,
            type: 'scatter',
            mode: 'lines',
            line: {
                color: 'lime',
                width: 1,
                shape: 'spline'
            }
        },
        {
            x: x1Data,
            y: y2Data,
            type: 'scatter',
            mode: 'lines',
            line: {
                color: 'Red',
                width: 1,
                shape: 'spline'
            }
        }
    ];
    
    const layout = {
        title: 'Time graph',
        width: 600,
        height: 520,
        xaxis: {
            title: 'Time'
        },
        yaxis: {
            title: 'Value'
        }
    };
    
    Plotly.newPlot('Timegraph', trace, layout);
    
    function updatePosition() {
        update();
    
        // Retrieve the selected values from the dropdown menus
        const s1Value = document.getElementById("s1").value;
        const s2Value = document.getElementById("s2").value;
    
        x1Data.push(t);
        
        // Update the data arrays based on the selected values
    switch (s1Value) {
        case "angle-1":
          y1Data.push(angle1);
          break;
        case "angle-1 velocity":
          y1Data.push(angularVelocity1);
          break;
        case "angle-2":
          y1Data.push(angle2);
          break;
        case "angle-2 velocity":
          y1Data.push(angularVelocity2);
          break;
        case "acceleration-1":
          y1Data.push(angularAcceleration1);
          break;
        case "acceleration-2":
          y1Data.push(angularAcceleration2);
          break;
        case "potential energy":
          y1Data.push(potentialEnergy);
          break;
        case "kinetic energy":
          y1Data.push(kineticEnergy);
          break;
        case "total energy":
          y1Data.push(totalEnergy);
          break;
        case "time":
          y1Data.push(t);
          break;
        default:
          break;
      }
      
      switch (s2Value) {
        case "angle-1":
          y2Data.push(angle1);
          break;
        case "angle-1 velocity":
          y2Data.push(angularVelocity1);
          break;
        case "angle-2":
          y2Data.push(angle2);
          break;
        case "angle-2 velocity":
          y2Data.push(angularVelocity2);
          break;
        case "acceleration-1":
          y2Data.push(angularAcceleration1);
          break;
        case "acceleration-2":
          y2Data.push(angularAcceleration2);
          break;
        case "potential energy":
          y2Data.push(potentialEnergy);
          break;
        case "kinetic energy":
          y2Data.push(kineticEnergy);
          break;
        case "total energy":
          y2Data.push(totalEnergy);
          break;
        case "time":
          y2Data.push(t);
          break;
        default:
          break;
      }

        // Ensure data arrays do not exceed the maximum number of data points
        if (y1Data.length > maxDataPoints) {
            y1Data.splice(0, y1Data.length - maxDataPoints);
        }
    
        if (y2Data.length > maxDataPoints) {
            y2Data.splice(0, y2Data.length - maxDataPoints);
        }

        // Update the x-axis data based on the length of y1Data or y2Data
        const newDataLength = Math.max(y1Data.length, y2Data.length);
        x1Data = Array.from({ length: newDataLength }, (_, i) => i + 1); // Update x1Data as [1, 2, 3, ..., newDataLength]
        // Add the new values to the data arrays
        // x1Data.push(Date.now());  Push current time value
        // y1Data.push(angle1);
        // y2Data.push(angularVelocity1);
    
        // Ensure x-axis data does not exceed the maximum number of data points
        // if (x1Data.length > maxDataPoints) {
        //     const numPointsToRemove = x1Data.length - maxDataPoints;
        //     x1Data.splice(0, numPointsToRemove);
        //     y1Data.splice(0, numPointsToRemove);
        //     y2Data.splice(0, numPointsToRemove);
        // }
    
        // Update the trace with the new data
        Plotly.update('Timegraph', {
            x: [x1Data, x1Data],
            y: [y1Data, y2Data]
        });
    }
    
    // Example: Update the pendulum's position every frame
    function loop() {
        updatePosition();
        requestAnimationFrame(loop);
    }

    loop();
}

function clearGraph2() {
    x1Data = [];    // Clear x1Data array
    y1Data = [];   // Clear y1Data array
    y2Data = [];    // Clear y2Data array

    Plotly.update('Timegraph', {
        x: [x1Data, x1Data],
        y: [y1Data, y2Data]
    });
}
function sim() {
    document.getElementById("canvas").style.display = "block";
    document.getElementById("graph").style.display = "none";
    document.getElementById("Timegraph").style.display = "none";

    document.getElementById("simbutton").disabled = true;
    document.getElementById("graphbutton").disabled = false;
    document.getElementById("timegraph").disabled = false;

    document.getElementById("length1").style.display = "block";
    document.getElementById("length2").style.display = "block";
    document.getElementById("mass1").style.display = "block";
    document.getElementById("mass2").style.display = "block";
    document.getElementById("gravity").style.display = "block";  

    document.getElementById("g1").style.display = "none";
    document.getElementById("g2").style.display = "none";
}

// Next button
let a = 1;

function up() {
    a += 1;
    next()
}

function next() {
    if (a == 1) {
        document.getElementById("buttonup").style.display = 'block';
        document.getElementById("content").style.display = 'block';
        document.getElementById("content2").style.display = 'none';
    } else if (a == 2) {
        document.getElementById("content").style.display = 'none';
        document.getElementById("content2").style.display = 'block';
        document.getElementById("buttonup").style.display = 'none';
    }
}

function Refresh() {
    window.location = window.location.href;
};

function closeobservation2() {
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('blocker').style.display = 'none';
}

function help() {
    document.getElementById('instructions').style.display = 'block';
    document.getElementById('blocker').style.display = 'block';
}
