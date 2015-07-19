var Diaporama = require("diaporama");
var GlslTransitions = require("glsl-transitions");

// Prepare the DOM
var container = document.createElement("div");
document.body.appendChild(container);
document.body.style.margin = "0";
document.body.style.overflow = "hidden";

var resources = {};

// Define the canvas timeline elements
var canvasTimeline =
[
{
  duration: 1000,
  transitionNext: {
    name: "DoomScreenTransition",
    uniforms: {
      barWidth: 40
    },
    duration: 1000,
    easing: [0.8, 0, 0.5, 1]
  },
  slide2d: {
    "background": "#eee",
    "size": [
      800,
      600
    ],
    "draws": [
      {
        "fillStyle": "#444",
        "font": "bold 80px Arial",
        "textAlign": "center"
      },
      [
        "fillText",
        "Diaporama DEMO",
        400,
        250
      ],
      {
        "fillStyle": "#999",
        "font": "italic 40px Arial",
        "textAlign": "center"
      },
      [
        "fillText",
        "Slideshow with Images and Videos",
        400,
        350
      ]
    ]
  }
}
];

// Define the images canvas elements
var imagesTimeline =
[
  "http://i.imgur.com/MQtLWbD.jpg",
  "http://i.imgur.com/N8a9CkZ.jpg",
  "http://i.imgur.com/adCmISK.jpg"
].map(function (url, i) {
  return {
    image: url,
    duration: 500,
    kenburns: {
      from: [ 0.6, [0.5,0.5] ],
      to: [ 1, [0.5,0.5] ]
    },
    transitionNext: {
      duration: 1000,
      name: ["CrossZoom", "flyeye", "ripple"][i]
    }
  };
});

// Define the video canvas elements
var videosTimeline =
"12345".split("").map(function (n,i) {
  var id = "cut"+n;
  resources[id] = {
    "video/webm": "cut"+n+".webm",
    "video/mp4": "cut"+n+".mp4",
    "image/png": "cut"+n+".png"
  };
  return {
    "video": id,
    "duration": 2000,
    "loop": true,
    "volume": 0,
    "position": 0,
    "playbackRate": 1,
    "transitionNext": {
      "duration": 2000,
      "name": ["burn","doorway","flyeye","swap","cube"][i]
    }
  };
});

// Utility to interleaves arrays
function interleaves () {
  var heads = [];
  var queues = [];
  for (var i=0; i<arguments.length; ++i) {
    var t = arguments[i];
    if (t.length > 0)
      heads.push(t[0]);
    if (t.length > 1)
      queues.push(t.slice(1));
  }
  if (heads.length === 0) return heads;
  return heads.concat(interleaves.apply(null, queues));
}

// Make the diaporama with the timeline, GlslTransitions and custom settings.
var diaporama = Diaporama(container, {
  timeline: interleaves(canvasTimeline, videosTimeline, imagesTimeline),
  transitions: GlslTransitions,
  resources: resources
}, {
  autoplay: true,
  loop: true,
  width: window.innerWidth,
  height: window.innerHeight
});

window.addEventListener("resize", function () {
  diaporama.width = window.innerWidth;
  diaporama.height = window.innerHeight;
});

window.diaporama = diaporama;
