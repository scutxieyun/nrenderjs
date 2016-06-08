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
    var EventEmitter = Renderjs.EventEmitter;
    var MeAudio = Renderjs.MeAudio;
    var MeSvg = Renderjs.MeSvg;
	var MeRadio = Renderjs.MeRadio;
	var MeCheckbox = Renderjs.MeCheckbox;
	var MeLabel = Renderjs.MeLabel;
	var MeGallary = Renderjs.MeGallary;
    var pageMgr = new MePageMgr(7);	//4 is the number of page
    var cxt = {
        pageMgr        : pageMgr,//作品范围的事件订阅器
        ee             : new EventEmitter(),
        interactHandler: null,	//在MeVPads初始化后会制定这个handler
    };
    var article = {
        "pages"  : [
            <MePage idx={0} cxt={cxt}
                    normalStyle={{backgroundImage:'url("http://ac-hf3jpeco.clouddn.com/d7f15555aa1d6e94e93f?imageView2/2/w/1128/h/800")'}}>
                <MeGallary cxt={cxt} id="sdfasdfasd" pageIdx={0} imgItems={[{
									src:"http://ac-hf3jpeco.clouddn.com/1550aa7c5f4f6422.jpg?imageView2/2/w/640",
									action:{}
								},{
									src:"http://ac-hf3jpeco.clouddn.com/1502dab133480fb7.png?imageView2/2/w/640",
									action:{}
								},{
									src:"http://ac-hf3jpeco.clouddn.com/15504ddbb4d7b09e.png?imageView2/2/w/274",
									action:{}
								}]}
                                normalStyle={{position:"absolute",top:"70px",left:"0px",height:"400px",width:"300px"}}>

                </MeGallary>
            </MePage>,
            ],
        "toolBar": <MeToolBar>
            

        </MeToolBar>,

        "layout": [//注意，这里安排是描述每一个page的相邻页面索引，page0对应着这个数组的第二个,即page0的上一页是4，下一页是1
            -1, 0,-1
        ],
        "cxt"   : cxt
    };
    return article;
});


