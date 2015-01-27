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

resolution = 100;
time = _(_.range(resolution + 1)).map(function(val){return val / resolution * durationInMinutes});
beatsElapsed = _(time).map(function(t){
  return 0 + (v0 * t) + (a0 * t * t)/2 + (a1 * t * t * t)/6;
});

bpm = _(time).map(function(t){
  return v0 + (a0 * t) + (a1 * t * t)/2;
});

var plotly = require('plotly')('cholbrow', apiKey);
var data = [
  {
    x: time, 
    y: beatsElapsed, 
    type: "scatter"
  },
  {
    x:time,
    y: bpm,
    type: "scatter"
  }
];


var graphOptions = {filename: "tempo toy", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
  console.log('err:', err);
  console.log(msg);
});
