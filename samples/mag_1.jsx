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
                <MeTouchTrigger cxt={cxt} pageIdx={0} triggerActions=
                    {{"swipeleft":{action:"componentDo(animationActive,e1)",propagate:false},
                     "tap":{action:"componentDo(animationActive,e1)",propagate:true}
                    }}
                                normalStyle={{position:"absolute",top:"70px",left:"0px",height:"400px",width:"300px"}}>
                    <MeAnimation id="e1" pageIdx={0} cxt={cxt} listenEvt={{active:"xxxxx",deactive:"page[0]:deactive"}}
                                 normalStyle={{top:"200px"}} animation={{
						animationIterationCount:"1",
						animationDelay:"0s",
						animationDuration:"1s"
					}}
                                 animationClass="fadeInLeft">
                        <img src="http://www.sinaimg.cn/dy/slidenews/1_img/2016_20/2841_694171_482050.jpg"></img>
                    </MeAnimation>
                </MeTouchTrigger>
            </MePage>,
            <MePage idx={1} cxt={cxt}
                    normalStyle={{backgroundColor:"white",backgroundImage:'url("http://ac-hf3jpeco.clouddn.com/3225b3517d091debcc12?imageView2/2/w/640/h/853")'}}>

                <MeAnimation cxt={cxt} listenEvt={{active:"page[1]:active",deactive:"page[1]:deactive"}}
                             normalStyle={{top:"200px"}} animationClass="fadeInUp">
                    <div style={{fontSize:"46px",fontFamily:"css-font-111"}}>2015年7月25日<p>夏天，很热打扫我们</p><p>
                        即将要开始新生活的住所</p></div>
                </MeAnimation>
            </MePage>,
            <MePage idx={2} cxt={cxt}
                    normalStyle={{backgroundColor:"gray",backgroundImage:'url("http://ac-hf3jpeco.clouddn.com/312ab77435c7d2b06bad.jpg?imageView2/2/format/jpg/w/600/h/800")'}}></MePage>,
            <MePage idx={3} cxt={cxt}
                    normalStyle={{backgroundColor:"pink",backgroundImage:'url("http://ac-hf3jpeco.clouddn.com/3c2d462ae56458d68746.jpg")'}}>
                <MeAnimation cxt={cxt} listenEvt={{active:"page[3]:active",deactive:"page[3]:deactive"}}
                             normalStyle={{top:"20px",height:"100px"}}>
                    <div>Hello the animation</div>
                </MeAnimation>
                <MePanArea cxt={cxt} pageIdx={3} normalStyle={{height:"2000px"} }>
                    <img src="http://www.sinaimg.cn/dy/slidenews/1_img/2016_20/2841_694470_324642.jpg"></img>
                </MePanArea>
            </MePage>,
            <MePage idx={4} cxt={cxt} normalStyle={{backgroundColor:"pink"}}>
                <MeAnimation cxt={cxt} listenEvt={{active:"page[4]:active",deactive:"page[4]:deactive"}}
                             normalStyle={{top:"20px",height:"100px"}}>
                    <div style={{fontSize:"30px"}}>Hello the animation</div>
                </MeAnimation>
            </MePage>,
            <MePage idx={5} cxt={cxt} normalStyle={{backgroundColor:"pink"}}>
			<MeAudio>d</MeAudio>
                <MeSvg dynamicStyle={{width: '320px', height: '320px'}} id={"mesvg1111"} pageIdx={5} cxt={cxt} ></MeSvg>
            </MePage>,
            <MePage idx={6} cxt={cxt} normalStyle={{backgroundColor:"pink"}}>
            	<MeRadio dynamicStyle={{left: "50px", top: "50px", width: '480px', height: '361px', border : "2px solid rgb(0, 0, 0)", borderRadius : "10px"}} id={"meRadio147"}
            	 dynamicData={{
					font_size : "30px",
					bg_color: "#000000",
					bd_color: "#000000",
                    bd_radius: "10",
                    bd_style: "solid",
                    bd_side: "top,right,bottom,left",
                    item_color: "#FFFFFF",
                    item_border: 2,
                    item_val: '{"title":"测试选项喜欢的蔬菜","options":["萝卜","白菜","莲藕"]}',
                    objectId: "574b9c1271cfe4005eaae908",
                    fb_field: "cd_radio"
            	 }} pageIdx={6} cxt={cxt} ></MeRadio>
            </MePage>
            ],
        "toolBar": <MeToolBar>
            <MeMusic id="magazine-music" src="http://ac-hf3jpeco.clouddn.com/154478292068657d.mp3"></MeMusic>

        </MeToolBar>,

        "layout": [//注意，这里安排是描述每一个page的相邻页面索引，page0对应着这个数组的第二个,即page0的上一页是4，下一页是1
            -1, 0, 1, 2, 3, 4, 5, 6, -1
        ],
        "cxt"   : cxt
    };
    return article;
});


