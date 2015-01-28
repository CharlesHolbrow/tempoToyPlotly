// Find your api_key here: https://plot.ly/settings/api
apiKey = process.argv[2];
if (!apiKey) throw new Error('pass api key as command line argument');

_ = require('underscore');

initialBpm = v0 = 90;
finalBpm = v1 = 135;
durationInBeatsAtInitialTempo = 64;
durationInMinutes = t = durationInBeatsAtInitialTempo / initialBpm;
beatsInChangingTempo = b1 = p1 = 76;

initialAcceleration = a0 = ((6 * b1) - (2 * t) * (v1 + (2 * v0))) / (t * t);
finalAcceleration = a1 = (v0 - v1 + (initialAcceleration * t)) * (-2/(t * t));

// resolution of our time
resolution = 9000;
// array of times (in minutes) at which we will sample our curves
time = _(_.range(resolution + 1)).map(function(val){return val / resolution * durationInMinutes});

// array of how many beats have elapsed relative to time
beatsElapsed = _(time).map(function(t){
  return 0 + (v0 * t) + (a0 * t * t)/2 + (a1 * t * t * t)/6;
});

// array of current tempo, sampled <resolution> times
bpm = _(time).map(function(t){
  return v0 + (a0 * t) + (a1 * t * t)/2;
});

staticBeats = _(time).map(function(t){
  return initialBpm * t;
});

// keys: beat number
// values: [timeInMinutes, accuracy]
firstBeats = {};
_(beatsElapsed).each(function(val, index){
  t = time[index]
  beat = Math.floor(val);
  // do we already have a time for this beat?
  if (firstBeats[beat]) return;
  firstBeats[beat] = [t, val];
});

changingBeatsRelativeToStaticBeats = _(firstBeats).map(function(val){return val[0] * initialBpm});

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


var plotly = require('plotly')('cholbrow', apiKey);
var data = [
  {
    x: changingBeatsRelativeToStaticBeats,
    y: _(changingBeatsRelativeToStaticBeats).map(function(){return 1}),
    type: "scatter",
    name: "Changing Beats",
    mode: "markers",
    marker:{
      color:tempoColor,
      width:2,
    }
  },
  {
    x: _.range(durationInBeatsAtInitialTempo + 1),
    y: _(changingBeatsRelativeToStaticBeats).map(function(){return 0}),
    type: "scatter",
    name: "Static Beats",
    mode:"markers",
    marker:{
      color:beatsColor,
      width:2,
    }
  }
];

var layout = {
  title: "Beat Chart - Changing Tempo Over Static Tempo",
  titlefont: {size: titleFontSize},
  xaxis: {
    title: "Static Tempo Beats (90 BPM)",
    // zeroline on the xaxis is the vertical zero line
    zeroline: true,
    titlefont: {color: beatsColor, size: axisTitleFontSize},
    tickfont: {color: beatsColor, size: axisTickFontSize},
  },
  yaxis: {
    title: "",
    titlefont: {color: tempoColor, size: axisTitleFontSize},
    tickfont: {color: tempoColor, size: axisTickFontSize},
    showline: false,
    linecolor: tempoColor,
    linewidth: axisLineWidth,
    side: 'left',
    range: [-2, 3],
    // zeroline on the y axis horizontal line
    zeroline: false,
    zerolinewidth: axisLineWidth,
    zerolinecolor: black,
  },
};

var graphOptions = {
  filename: "tempo toy syncopation",
  fileopt: "overwrite",
  layout: layout
};
plotly.plot(data, graphOptions, function (err, msg) {
  console.log('err:', err);
  console.log(msg);
});
