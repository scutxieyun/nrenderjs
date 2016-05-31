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
                    <div style={{fontSize:"46px",fontFamily:"css-font-111"}}>2015年7月25日<p>夏天，很热打扫我们</p><p>
                        即将要开始新生活的住所</p></div>
            </MePage>,
            <MePage idx={2} cxt={cxt}
                    normalStyle={{backgroundColor:"gray",backgroundImage:'url("http://ac-hf3jpeco.clouddn.com/312ab77435c7d2b06bad.jpg?imageView2/2/format/jpg/w/600/h/800")'}}>哈哈哈</MePage>,
            <MePage idx={3} cxt={cxt}
                    normalStyle={{backgroundColor:"pink",backgroundImage:'url("http://ac-hf3jpeco.clouddn.com/3c2d462ae56458d68746.jpg")'}}>
                <MeAnimation id="e3" pageIdx={3} cxt={cxt}  cxt={cxt} listenEvt={{active:"page[3]:active",deactive:"page[3]:deactive"}}
                             normalStyle={{top:"20px",height:"100px"}}  animation={{
                                                                        						animationIterationCount:"1",
                                                                        						animationDelay:"0s",
                                                                        						animationDuration:"1s"
                                                                        					}}>
                    <div>Hello the animation</div>
                </MeAnimation>
            </MePage>,
            <MePage idx={4} cxt={cxt} normalStyle={{backgroundColor:"pink"}}>
					<MeLabel normalStyle={{left:"224px",top:"361px",width: "190px",height: "52px", borderRadius: "40px", color:"#fff", fontSize:"24px"}}
						data={{
							content:"方向左的",
							type:"地点",
							typeImg:"http://ac-hf3jpeco.clouddn.com/3bce28861e082296e8b7.png",
							direction:"left"
						}}
					>

					</MeLabel>
					<MeLabel normalStyle={{left:"90px",top:"572px",width: "285px",height: "52px", borderRadius: "40px", color:"#fff", fontSize:"24px"}}
						data={{
							content:"方向右的",
							type:"地点",
							typeImg:"http://ac-hf3jpeco.clouddn.com/3bce28861e082296e8b7.png",
							direction:"right"
						}}
					>

					</MeLabel>
			</MePage>,
			<MePage idx={5} cxt={cxt} normalStyle={{backgroundColor:"pink"}}>
				<MeSvg normalStyle={{left: "50px", top: "50px",width: '320px', height: '320px'}} id={"mesvg1111"} pageIdx={5} cxt={cxt} data={{
					content: "<svg version=\"1.2\" baseProfile=\"tiny\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 320 480\" xml:space=\"preserve\" style=\"height: 100%; width: 100%;\">\n<path fill=\"none\" stroke=\"#FF0000\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" d=\"M77-159v304.472\tc0,5.5,4.328,9.528,9.828,9.528H238.5c5.5,0,9.5,4.972,9.5,10.472v5.157c0,5.5-4,10.371-9.5,10.371H86.828\tc-5.5,0-9.828,4.129-9.828,9.629v4.151c0,5.5,4.328,10.22,9.828,10.22H238.5c5.5,0,9.5,4.28,9.5,9.78v5.157\tc0,5.5-4,10.062-9.5,10.062H87.826c-5.5,0-9.826,4.438-9.826,9.938v5.157c0,5.5,4.326,9.905,9.826,9.905H238.5\tc5.5,0,9.5,4.595,9.5,10.095v4.15c0,5.5-4,9.755-9.5,9.755H89.822c-5.5,0-9.822,4.745-9.822,10.245v5.157\tc0,5.5,4.322,9.598,9.822,9.598h147.68c5.5,0,10.498,4.902,10.498,10.402V574\" style=\"transform: matrix(1, 0, 0, 1, 0, 0); stroke-dashoffset: 1e-05px; stroke-dasharray: 1864.11px, 1874.11px;\"></path>",
					delay:0.5,
					duration:3.5,
					infinite:"1",
					a1:0,
					a2:50,
					b1:50,
					b2:100}}
				 ></MeSvg>
			</MePage>,
			<MePage idx={6} cxt={cxt} normalStyle={{backgroundColor:"pink"}}>
				<MeRadio normalStyle={{left: "50px", top: "50px", width: '480px', height: '361px', border : "2px solid rgb(0, 0, 0)",
				borderRadius : "10px", fontSize:"30px", color:"#fff", backgroundColor:"#000"}} id={"meRadio147"}
				 data={{
					title: "测试选项喜欢的蔬菜",
					options : ["萝卜","白菜","莲藕"],
					objectId : "574b9c1271cfe4005eaae908"}} pageIdx={6} cxt={cxt} ></MeRadio>
				 <MeCheckbox normalStyle={{left: "84px", top: "400px", width: '480px', height: '361px', border : "2px solid rgb(0, 0, 0)",
				 borderRadius : "10px", fontSize:"30px", color:"rgb(255,102,0)", backgroundColor:"#000"}} id={"meCheckbox147"}
				 data={{
					title: "喜欢的明星",
					options : ["刘德华","胡歌","马伊俐"],
					objectId : "574bf4e1a3413100591d2125"}} pageIdx={6} cxt={cxt} ></MeCheckbox>
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


