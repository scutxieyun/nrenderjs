define([],function(){
var Renderjs = renderjs;
var React = Renderjs.React;
var ReactDOM = Renderjs.ReactDOM;
var MePage = Renderjs.MePage;
var MeAnimation = Renderjs.MeAnimation;
var MeTouchTrigger = Renderjs.MeTouchTrigger;
var MeMusic = Renderjs.MeMusic;
var MeToolBar = Renderjs.MeToolBar;
var MePageMgr = Renderjs.MePageMgr;
var MeInteractImage = Renderjs.MeInteractImage;
var EventEmitter = Renderjs.EventEmitter;
var pageMgr = new MePageMgr(5);	//4 is the number of page
var cxt = {
	pageMgr:pageMgr,//作品范围的事件订阅器
	ee:new EventEmitter(),
	interactHandler:null,	//在MeVPads初始化后会制定这个handler
};
function pageGenerate(xNum,yNum){
var pages = [];
var layout = [];
layout.push(-1);
	for(var i = 0;i < xNum * yNum; i ++){
		pages.push(<MePage idx={i} cxt={cxt} normalStyle={{fontSize:100,backgroundColor:"white"}}>{Math.floor(i/yNum)} X { i % yNum}</MePage>);
	}
	for(var i = 0;i < xNum; i ++){
		var L2Data = [-1];
		for(var j = 0;j < yNum; j ++){
			L2Data.push(i * yNum + j);
		}
		L2Data.push(-1);
		layout.push(L2Data);
	}
	layout.push(-1);
	return {
		pages:pages,
		layout:layout,
		"toolBar":
			<MeToolBar>
				<MeMusic id="magazine-music" src="http://ac-hf3jpeco.clouddn.com/154478292068657d.mp3"></MeMusic>
			</MeToolBar>,
		cxt:cxt
	};
}
return pageGenerate(10,10);
});