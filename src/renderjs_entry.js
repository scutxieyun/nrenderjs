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
var MeIFrameVideo = require("../dist/MeIFrameVideo.js");
var MeInnerVideo = require("../dist/MeInnerVideo.js");
var MeClip = require("../dist/MeClip.js");
var MeGallary = require("../dist/MeGallary.js");
var MeInput = require("../dist/MeInput.js");
var MeSubmit = require("../dist/MeSubmit.js");
var MePhone = require("../dist/MePhone.js");
var MeMap = require("../dist/MeMap.js");
var MeReward = require("../dist/MeReward.js");
var MeRedEnvelopes = require("../dist/MeRedEnvelopes.js");
var MeShake = require("../dist/MeShake.js");
var MeLongPress = require("../dist/MeLongPress.js");
var MePanorama = require("../dist/MePanorama.js");
var MeVote = require("../dist/MeVote.js");
var MeMessageBox = require("../dist/MeMessageBox.js");
var MePageNum = require("../dist/MePageNum.js");

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
    MeIFrameVideo:MeIFrameVideo,
    MeInnerVideo:MeInnerVideo,
    MeClip:MeClip,
	MeGallary:MeGallary,
    MeInput:MeInput,
    MeSubmit:MeSubmit,
    MePhone:MePhone,
    MeMap:MeMap,
    MeReward:MeReward,
    MeRedEnvelopes:MeRedEnvelopes,
    MeShake:MeShake,
    MeLongPress:MeLongPress,
    MePanorama:MePanorama,
    MeVote:MeVote,
    MeMessageBox:MeMessageBox,
    MePageNum:MePageNum,
	ee:new EventEmitter(),	//因为需要ee建立，容器，Pads和作品之间的联系，所以在这里创建ee
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
                article:null,
                ee : myself.ee
			};
			elem = _elem;
			cfg = _assign(
				_default,options
			);
		}
		function _loadArticle(mag){
			myself.ee.removeAllListeners(); // later, 仅仅删除与page相关的内容
			if(elem != null){
				if(cfg.article != null) ReactDOM.unmountComponentAtNode(elem);
				var _article = new MeArticle(mag);
				cfg.article = _article;
				_article.getCxt().system = myself;
				pads = ReactDOM.render(React.createElement(MeVPads,cfg), elem);
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
			getEE:function (){
				return myself.ee; 
			},
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
			},
			gotoPrev:function(){
				if(pads != null){
					var x = 0;
					var y = 0;
					y = pads.moveYPrev();
				}
			},
            /**
             * 这里调用外部的以iframe打开链接
             * @param target
             */
            openWithInnerBrowse : function(target,height){
                if(elem == null) return;
                if(globalOpenWithInnerBrowse == undefined) return;//globalLoadTid是外部提供的一个函数，通过tid，获得作品数据
                globalOpenWithInnerBrowse(target,height);
            },
            /**
             * 这里调用外部的保存数据
             * @param data  保存的数据
             * @param type  保存的数据类型，有表单数据，和投票数据1---表单数据， 2-----投票数据
             */
            submitDataToCloud : function(data,type){
                if(elem == null) return;
                if(globalSubmitDataToCloud == undefined) return;//globalLoadTid是外部提供的一个函数，通过tid，获得作品数据
                globalSubmitDataToCloud(data,type);
            }
		};
		}()
	}	
		
	return myself;
}();