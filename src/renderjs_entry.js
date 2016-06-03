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

module.exports = function(){
	var myself = {
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
		var cfg = {};
		function _init(_elem,options){
			var _assign = require("object-assign");
			var _default = {
				containerHeight:_elem.offsetHeight,
				containerWidth:_elem.offsetWidth,
				bufferLen: 5, 
				pageHeight:1008,
				pageWidth:640,
				article:null
			};
			elem = _elem;
			cfg = _assign(
				_default,options
			);
		}
		function _loadArticle(mag){
			if(elem != null){
				if(cfg.article != null) ReactDOM.unmountComponentAtNode(elem);
				var _article = new MeArticle(mag);
				cfg.article = _article;
				_article.getCxt().system = myself;
				pads = ReactDOM.render(React.createElement(MeVPads,
															cfg), 
											elem);
							
			}
		}
		function _unload(){
			if(elem != null){
				ReactDOM.unmountComponentAtNode(elem);
				pads = null;
				return;
			}
		}
		return {
			load:_loadArticle,
			unload:_unload,
			init:_init,
			gotoPos:function(x,y){
				if(pads != null){
					pads.gotoPos(x,y);
				}
			},
			loadTid:function(tid){
				if(elem == null) return;
				if(globalLoadTid == undefined) return;//globalLoadTid是外部提供的一个函数，通过tid，获得作品数据
				globalLoadTid(tid,function(mag){
					myself.helper.load(mag);
				});
			},
			gotoNext:function(){
				if(pads != null){
					var x = 0;
					var y = 0;
					y = pads.moveYNext();
					if(y == -1){
						x = pads.moveXNext();
						if(x == -1){
							this.gotoPos(0,0);
						}
					}
				}
			}
		};
		}(),
	}	
		
	return myself;
}();