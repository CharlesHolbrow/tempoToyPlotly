// Find your api_key here: https://plot.ly/settings/api
apiKey = process.argv[2];
if (!apiKey) throw new Error('pass api key as command line argument');

_ = require('underscore');

bpm1 = v0 = 90;
bpm2 = v1 = 100;
bpmRatio = bpm2 / bpm1;

staticBeats = _.range(24)
fasterBeats = _(_.range(26)).map(function(val){ return val / bpmRatio; });

pre = [-4, -3, -2, -1]
staticBeats = pre.concat(staticBeats)
fasterBeats = pre.concat(fasterBeats)


var blue = "1f77b4";
var orange = "ff7f0e";

var lightGrey = "bfbfbf";
var grey = "808080";
var black = "000000";
var titleFontSize = 22
var axisLineWidth = 2;
var tempoColor = black;
var beatsColor = grey;
var axisTitleFontSize = 18;
var axisTickFontSize = 16;
var layoutMarginTopBottom = 80;
var layoutMarginLeftRight = 10;



var plotly = require('plotly')('cholbrow', apiKey);
var data = [
  {
    x: fasterBeats,
    y: _(fasterBeats).map(function(){return 1}),
    type: "scatter",
    name: bpm2 + " BPM",
    mode: "markers",
    marker:{
      color:tempoColor,
      width:2,
    }
  },
  {
    x: staticBeats,
    y: _(staticBeats).map(function(){return 0}),
    type: "scatter",
    name: bpm1 + " BPM",
    mode:"markers",
    marker:{
      color:beatsColor,
      width:2,
    }
  }
];

var chartTitle = 'Beats played at two different tempos'

var layout = {
  // title: chartTitle,
  titlefont: {size: titleFontSize},
  width: 700,
  height: 200,
  margin: {b:layoutMarginTopBottom, t:layoutMarginTopBottom, l:layoutMarginLeftRight, r:layoutMarginLeftRight},
  xaxis: {

    title: "Time, measured in beats at " + bpm1 + " BPM",
    // zeroline on the xaxis is the vertical zero line
    zeroline: false,
    showline: false,
    // titlefont: {color: beatsColor, size: axisTitleFontSize},
    tickfont: {color: beatsColor, size: axisTickFontSize},
    autotick: false,
    tick0: -4,
    dtick: 4,
  },
  yaxis: {
    autotick: false,
    tick0: -3,
    dtick: 10,
    title: "",
    titlefont: {color: tempoColor, size: axisTitleFontSize},
    tickfont: {color: tempoColor, size: axisTickFontSize},
    showline: false,
    linecolor: tempoColor,
    linewidth: axisLineWidth,
    side: 'left',
    range: [-1, 2],
    showticks: false,
    // zeroline on the y axis horizontal line
    zeroline: false,
    zerolinewidth: axisLineWidth,
    zerolinecolor: black,
  },
  annotations: [
    {
      x: -4,
      y: 1.2,
      xref: "x",
      yref: "y",
      text: "Both parts begin at " + bpm1 + " BPM",
      showarrow: true,
      arrowhead: 2,
      arrowsize: 1,
      arrowwidth: 2,
      ax: 0,
      ay: -32
    },
    {
      x: 0,
      y: 1.2,
      xref: "x",
      yref: "y",
      text: "Top part changes to " + bpm2 + " BPM",
      showarrow: true,
      arrowhead: 2,
      arrowsize: 1,
      arrowwidth: 2,
      ax: 0,
      ay: -52
    },
    {
      x: 16,
      y: 1.2,
      xref: "x",
      yref: "y",
      text: "Not synchronized",
      showarrow: true,
      arrowhead: 2,
      arrowsize: 1,
      arrowwidth: 2,
      ax: 0,
      ay: -32
    }
  ]
};

var graphOptions = {
  filename: "tempo toy linear acceleration",
  fileopt: "overwrite",
  layout: layout
};
plotly.plot(data, graphOptions, function (err, msg) {
  console.log('err:', err);
  console.log(msg);
});
