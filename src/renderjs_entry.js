var MePage = require("../dist/MePage.js");
var MeAnimation = require("../dist/MeAnimation.js");
var MeToolBar = require("../dist/MeToolBar.js");
var MeDiv = require("../dist/MeDiv.js");
var MeImage = require("../dist/MeImage.js");
var MeMusic = require("../dist/MeMusic.js");
var MeTouchTrigger = require("../dist/MeTouchTrigger.js");
var MeVPads = require("../dist/MeVPads.js");
var MePanArea = require("../dist/MePanArea.js");
var MeAudio = require("../dist/MeAudio.js");
var MeArticle = require("../src/me-article.js");
var MePageMgr = require("../src/MePageMgr.js");
var MeMediaMgr=require("../src/MeMediaMgr.js");
var MeSvg = require("../dist/MeSvg.js");
var MeRadio = require("../dist/MeRadio.js");
var MeCheckbox = require("../dist/MeCheckbox.js");


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
	MeAudio:MeAudio,
	MeDiv:MeDiv,
	MeMediaMgr:MeMediaMgr,
	MeSvg:MeSvg,
	MeImage:MeImage,
    MeRadio:MeRadio,
    MeCheckbox:MeCheckbox,
	EventEmitter:EventEmitter,
	React:React,
	ReactDOM:ReactDOM
};