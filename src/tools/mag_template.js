define([], function () {
    var Renderjs = renderjs;
    var React = Renderjs.React;
    var ReactDOM = Renderjs.ReactDOM;
    var MePage = Renderjs.MePage;
    var MeAnimation = Renderjs.MeAnimation;
    var MeTouchTrigger = Renderjs.MeTouchTrigger;
    var MeMusic = Renderjs.MeMusic;
    var MeToolBar = Renderjs.MeToolBar;
    var MePageMgr = Renderjs.MePageMgr;
    var MePanArea = Renderjs.MePanArea;
	var MeDiv = Renderjs.MeDiv;
	var MeAudio = Renderjs.MeAudio;
    var EventEmitter = Renderjs.EventEmitter;
    var MeSvg = Renderjs.MeSvg;
	var MeImage = Renderjs.MeImage;
	var MeAudio	= Renderjs.MeAudio;
    var MeText = Renderjs.MeText;
    var MeVideo	= Renderjs.MeVideo;
    var pageMgr = new MePageMgr(5);	//4 is the number of page
    var cxt = {
        pageMgr        : pageMgr,//作品范围的事件订阅器
        ee             : new EventEmitter(),
        interactHandler: null,	//在MeVPads初始化后会制定这个handler
    };
    var article = {
		pages:[<%= pages%>],
		layout:<%= layout%>,
		"toolBar": <MeToolBar>
            <MeMusic cxt={cxt} id="magazine-music" autoplay={true} src="<%= music_src%>">
			</MeMusic>
        </MeToolBar>,
		"cxt"   : cxt
	};
	return article;
});