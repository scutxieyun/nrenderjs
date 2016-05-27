var MePage = require("../dist/MePage.js");
var MeAnimation = require("../dist/MeAnimation.js");
var MeToolBar = require("../dist/MeToolBar.js");
var MeMusic = require("../dist/MeMusic.js")
var MeTouchTrigger = require("../dist/MeTouchTrigger.js");
var MeVPads = require("../dist/MeVPads.js");
var MePanArea = require("../dist/MePanArea.js");
var MeAudio = require("../dist/MeAudio.js");
var MeArticle = require("../src/me-article.js");
var MePageMgr = require("../src/MePageMgr.js");

var MeMedia=require("../dist/MeMedia.js")

var MeSvg = require("../dist/MeSvg.js");


var EventEmitter = require("wolfy87-eventemitter");
var React = require("react");
var ReactDOM = require("react-dom");

function renderjs(){}
module.exports = {
	MePage:MePage,
	MeAnimation:MeAnimation,
	MeToolBar:MeToolBar,
	MeMusic:MeMusic,
	MeVPads:MeVPads,
	MeArticle:MeArticle,
	MeTouchTrigger:MeTouchTrigger,
	MePanArea:MePanArea,
	MePageMgr:MePageMgr,
<<<<<<< HEAD
	MeAudio:MeAudio,
	MeMedia:MeMedia,
=======
	MeSvg:MeSvg,
>>>>>>> b9609dc0442ecb6de2d9ea84bfbf6d0566ac39d6
	EventEmitter:EventEmitter,
	React:React,
	ReactDOM:ReactDOM
};