/**
 * Created by lifeng on 2016/5/26.
 */
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
    var pageMgr = new MePageMgr(5);	//4 is the number of page
    var cxt = {
        pageMgr        : pageMgr,//作品范围的事件订阅器
        ee             : new EventEmitter(),
        interactHandler: null,	//在MeVPads初始化后会制定这个handler
    };
    var article = {
        "pages"  : [
            <MePage idx={0} cxt={cxt} normalStyle={{backgroundImage:'url("http://ac-hf3jpeco.clouddn.com/d7f15555aa1d6e94e93f?imageView2/2/w/1128/h/800")'}}>
                <MeTouchTrigger cxt={cxt} listenEvt={{active:"page[0]:active",triggerEvt:"swiperight"}} evtName="xxxxx" normalStyle={{position:"absolute",top:"70px",left:"0px",height:"400px",width:"300px"}}>
                    <MeAnimation cxt={cxt} listenEvt={{active:"xxxxx",deactive:"page[0]:deactive"}} normalStyle={{top:"200px"}} animation={{
						animationIterationCount:"1",
						animationDelay:"0s",
						animationDuration:"1s"
					}}
                                 animationClass="fadeInLeft">
                        <img src="http://www.sinaimg.cn/dy/slidenews/1_img/2016_20/2841_694171_482050.jpg"></img>
                    </MeAnimation>
                </MeTouchTrigger>
            </MePage>,
            <MePage idx={1} cxt={cxt} normalStyle={{backgroundColor:"pink"}}>
                <MeAudio></MeAudio>
            </MePage>],
        "toolBar": <MeToolBar>
            <MeMusic id="magazine-music" src="http://ac-hf3jpeco.clouddn.com/154478292068657d.mp3"></MeMusic>
        </MeToolBar>,

        "layout": [//注意，这里安排是描述每一个page的相邻页面索引，page0对应着这个数组的第二个,即page0的上一页是4，下一页是1
            -1, 0,1, -1
        ],
        "cxt"   : cxt
    };
    return article;
});


