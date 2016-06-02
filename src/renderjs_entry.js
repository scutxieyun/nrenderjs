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
var MeLabel = require("../dist/MeLabel.js");
var MeText = require("../dist/MeText.js");


var EventEmitter = require("wolfy87-eventemitter");
var React = require("react");
var ReactDOM = require("react-dom");

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
    MeLabel:MeLabel,
    MeText:MeText,
	EventEmitter:EventEmitter,
	React:React,
	ReactDOM:ReactDOM,
	helper:function(){
		var pads = null;
		var elem = null;
		function _renderArticle(mag,_elem,options){
			var _assign = require("object-assign");
			var _article = new MeArticle(mag);
			elem = _elem;
			var _default = {
				containerHeight:elem.offsetHeight,
				containerWidth:elem.offsetWidth,
				bufferLen: 5, 
				pageHeight:1008,
				pageWidth:640, 
				article:_article,
			}
			pads = ReactDOM.render(React.createElement(MeVPads,
											_assign(_default,options)), 
											elem);
							
		}
		function _unload(){
			if(elem != null){
				ReactDOM.unmountComponentAtNode(elem);
				pads = null;
				return;
			}
		}
		return {
			load:_renderArticle,
			unload:_unload,
			gotoPos:function(x,y){
				if(pads != null){
					pads.gotoPos(x,y);
				}
			}
		};
		}(),
};