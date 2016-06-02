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
    var MeText = Renderjs.MeText;
    var pageMgr = new MePageMgr(5);	//4 is the number of page
    var cxt = {
        pageMgr        : pageMgr,//��Ʒ��Χ���¼�������
        ee             : new EventEmitter(),
        interactHandler: null,	//��MeVPads��ʼ������ƶ����handler
    };
    var article = {
		pages:[<%= pages%>],
		layout:<%= layout%>,
		"toolBar": <MeToolBar>
            <MeMusic id="magazine-music" src="<%= music_src%>">
			</MeMusic>
        </MeToolBar>,
		"cxt"   : cxt
	};
	return article;
});