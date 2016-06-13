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
    var MeRadio = Renderjs.MeRadio;
    var MeCheckbox = Renderjs.MeCheckbox;
    var MeLabel = Renderjs.MeLabel;
	var MeImage = Renderjs.MeImage;
    var MeText = Renderjs.MeText;
    var MeIFrameVideo= Renderjs.MeIFrameVideo;
    var MeInnerVideo= Renderjs.MeInnerVideo;
    var MeClip	= Renderjs.MeClip;
	var MeGallary = Renderjs.MeGallary;
    var MeInput = Renderjs.MeInput;
    var MeSubmit = Renderjs.MeSubmit;
    var MePhone = Renderjs.MePhone;
    var MeMap = Renderjs.MeMap;
    var MeReward = Renderjs.MeReward;
    var MeRedEnvelopes = Renderjs.MeRedEnvelopes;
    var pageMgr = new MePageMgr(5);	//4 is the number of page
    var cxt = {
        pageMgr        : pageMgr,//作品范围的事件订阅器
        ee             : Renderjs.ee,
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