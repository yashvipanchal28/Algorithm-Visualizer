Chart.defaults.global.legend.display = false
Chart.defaults.global.tooltips.enabled = false

// Run Terminal Animation on Heading upon Loading
document.addEventListener('DOMContentLoaded', consoleText('AlgoViz.', 'text'), false);
function consoleText(word, id) {
  var visible = true;
  var con = document.getElementById('console');
  var letterCount = 1;
  var target = document.getElementById(id)
  
  const interval = window.setInterval(function() {
    if (letterCount === word.length + 1) {
      clearInterval(interval)
      }
    else{
      target.innerHTML = word.substring(0, letterCount)
      letterCount++;
    }
  }, 150)
  
  window.setInterval(function() {
    if (visible === true) {
      con.className = 'console-underscore hidden'
      visible = false;

    } else {
      con.className = 'console-underscore'
      visible = true;
    }
  }, 400)
}

// Handle Submit request
const submitButton = document.getElementById('codeEditorSubmit')
submitButton.addEventListener('click', (e) => {
  console.log('Button status disabled : ' + e.target.disabled)
  if (e.target.disabled){
    console.log('Code already running aborting process')
    return 
  }  

  handleDisableSubmitButton()
  alert.className = "alert alert-light"
  alert.innerHTML = "Loading..."

  var value = window.editor.getValue()

  console.log('Sending Code to Main Process: ' + value)
  ipcRenderer.send('insert-compile-code', value);
})

// Handle disable submit button
function handleDisableSubmitButton(){
  console.log('Disabling submit button')
  submitButton.disabled = true
}

// Handle enable submit button 
function handleEnableSubmitButton(){
  console.log('Enabling submit button')
  submitButton.disabled = false
}

// Handle enable submit button

// Extracting ipcRenderer from  window.ipcRenderer
const ipcRenderer = window.ipcRenderer

// Alert Sign
const alert = document.getElementById('codeEditorAlert')

// Sleep function 
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Print error function 
function handleJSONParsingError(){
  alert.className = "alert alert-danger"
  alert.innerHTML = "Json Parsing Error"
}

// Declaring variables 
var network 
var barGraph

// clear previous graphs
function clearNetwork(){
  if (network !== undefined) network.destroy()
}

function clearBarGraph(){
  var av = document.getElementById('av')
  av.innerHTML = ''
}

function clearPreviousCharts() {
  console.log('Clearing previously created charts')
  clearNetwork()
  clearBarGraph()
}


// Running network chart
async function runNetworkCharts(graphDataList){
  clearPreviousCharts()
  var nodes = new vis.DataSet([])
  var edges  = new vis.DataSet([])

  console.log('Selecting container as av')
  var av = document.getElementById('av')
  var data = { nodes: nodes, edges: edges }
  var options = { 
    width:"100%", 
    height:"100%", 
    nodes: {
      shape: "dot",
      size: 25,
      font: { size: 15, color: 'black', },
      borderWidth: 2,
      margin: 5,
      color: {
          border: '#2B7CE9',
          background: '#97C2FC',
          hover: { border: '#2B7CE9', background: '#D2E5FF' },
      },
    },
    edges: {
      width: 2,
      color: { color: 'rgba(30, 30, 30, 0.4)'}
    },
    layout: {
      randomSeed: 10,
      improvedLayout: true,
    }
  }
  
  network = new vis.Network( av, data, options )
  for await (var graphData of graphDataList){
    network.setData(graphData)
    await sleep(500)
  }
  handleEnableSubmitButton()
}

// Running bar chart

async function runBarChart(barGraphDataList){
  clearPreviousCharts()

  console.log('Selecting container as av')
  var av = document.getElementById('av')

  console.log('Creating canvas element')
  var barGraphCanvas = document.createElement('canvas')
  barGraphCanvas.id = 'bar-graph-canvas'

  console.log('Appending canvas to av')
  av.appendChild(barGraphCanvas)

  var ctx = document.getElementById('bar-graph-canvas').getContext('2d')
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
          data: [],
          backgroundColor: [],
        }]
      },
    options: {
      legend: {display: false},
      tooltips: {enabled: false},
      animation: {duration: 0,},
      scales: {
        yAxes: [{ticks: {beginAtZero: true}}],
        xAxes: [{barPercentage: 0.4}]
      },
      layout: {padding: {top: 100}}
    }
  });

  for await (var barGraphData of barGraphDataList ){
    console.log(barGraphData)
    myChart.data.datasets[0].data = barGraphData.values
    myChart.data.datasets[0].backgroundColor = barGraphData.colors
    myChart.data.labels = barGraphData.labels
    myChart.update()
    await sleep(1000)
  }

  handleEnableSubmitButton()
}

ipcRenderer.on('code-compiled', async (event, arg) => {

  console.log("Recieved Stdout of child process ")
  alert.className = "alert alert-success"
  alert.innerHTML = "Code Compiled Successfully!"

  //runBarChart()

  console.log('Parsing the recieved Stdout')
  try{
    var info = JSON.parse(arg)
    var data = info.data
    var type  = info.type
  }
  catch(error) {
    handleJSONParsingError()
    handleEnableSubmitButton()
    return 
  } 

  console.log('Type of information : ' + type)
  console.log(data)
  
  if (type === 'Graph'){
    runNetworkCharts(data)
  } else {
    runBarChart(data)
  }
})

ipcRenderer.on('code-not-compiled', (event, arg) => {
  alert.className = "alert alert-danger"
  alert.innerHTML = "Some Error Occurred"
  console.log("Could not compile code: ", arg)
  handleEnableSubmitButton()
})
