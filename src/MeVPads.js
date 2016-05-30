define("mevpads",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var Hammer = require("react-hammerjs");
var _assign = require("object-assign");
var PadBuffer = React.createClass({
	tempPageIdx:-1,
	getDefaultProps:function(){
		return {
			article:null,
			idx:0,
			pageWidth:720,
			pageHeight:1020,
			posIdx:0,
		};
	},
	getInitialState:function(){
		return {
			pageIdx:-1, // 当前缓存的页面
			state:"free",	//free:空闲，hide:装有page，但不能显示 standby:加载，但移除view之外, active:正在显示
			loc:"none",
		};
	},
	_getPageElement:function(){
		if(this.state.pageIdx == -1) return null;
		return this.props.article.getPageByIdx(this.state.pageIdx);
	},
	_getPageInstance:function(){
		if(this.state.pageIdx == -1) return null;
		return this.props.article.getPageInstanceByIdx(this.state.pageIdx);
	},
	updateBuffer:function(newState){//不能让pads直接设置pageIdx，所以用这个函数过滤一下
		var _toSet = _assign({},newState);
		if(this.state.pageIdx != -1 && this.state.pageIdx != newState.pageIdx && newState.pageIdx != -1){
		//需要delay修改,先使用无效页，将当前的内容清除，然后再置上新页
			tempPageIdx = newState.pageIdx;
			_toSet.pageIdx = -1;
		}
		this.setState(_toSet);
	},
	tick:function(){
		if(this.tempPageIdx != -1){
			this.setState({pageIdx:this.tempPageIdx});
		}
		this.tempPageIdx = -1;
	},

	componentDidUpdate:function(prevProps,prevState){
		if(this.tempPageIdx != -1 && this.state.pageIdx == -1){
			this.setInterval(this.tick,0);
			return;
		}
		var react_page = this._getPageInstance();
		var old_active = prevState.state == "active" ? true : false;
		var cur_active = this.state.state == "active" ? true : false;
		if(react_page != null && old_active != cur_active){
			react_page.setState({active:cur_active});
			//console.log("react page update with ",this.state);
		}
	},
	render:function(){
		var className = this.state.state == "active" ? "active":"deactive";
		className += " page_container " + this.state.loc;
		var pageInstance = this._getPageElement();
		if(pageInstance != null) return <div id={this.props.id} className={className} >{pageInstance}</div>;
		else return <div id={this.props.id} me_page_idx={this.state.pageIdx} className={className} ></div>;
	},
});


/***
对hammer进行扩展，在一个大的Touch Div下，处理事件的propogation prevent
**/
var MeHammer = function(hammer,default_handler){
	var self = this;
	this.hammer = hammer;
	this.defaultHandler = default_handler;
	this.listeners = {};
	//this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL }); it doesn't work???
	this.hammer.on("swipeleft swiperight swipeup swipedown pan tap",function(evt){self.handleHammerEvent(evt);});
	this.hammer.on("tap",function(evt){self.handleHammerEvent(evt);});
}
MeHammer.prototype.handleHammerEvent = function(evt){
	if(this.listeners.hasOwnProperty(evt.type)){
		var evt_listeners = this.listeners[evt.type];
		var curElm = evt.target;
		//向上遍历数，直到hammer的绑定元素
		while(curElm != null && curElm != this.hammer.element){
			for(i = 0;i < evt_listeners.length;i ++){
				if(evt_listeners[i].id == curElm.id){//没能理解apply的机制，按道理，1st参数应该对应this，但不是，严谨的做法应该用bind
					if(evt_listeners[i].func.apply(null,[evt]) == false) return;
				}
			}
			curElm = curElm.parentElement;
		}
	}
	if(this.defaultHandler.hasOwnProperty(evt.type)){
		this.defaultHandler[evt.type].apply([evt]);
	}
}
/***
停止当前的session，主要给Pan操作使用
**/
MeHammer.prototype.stop = function(){
	this.hammer.stop();
};

MeHammer.prototype.on = function(evttype,_id,_func){
	var evts = evttype.split(" ");
	for(var i = 0;i < evts.length; i ++){
		if(!this.listeners.hasOwnProperty(evts[i])) this.listeners[evts[i]] = [];
		this.listeners[evts[i]].push({id:_id,func:_func});
	}

	return;
};
MeHammer.prototype.off = function(evttype,_id){
	var evts = evttype.split(" ");
	for(var i = 0;i < evts.length; i ++){
		if(!this.listeners.hasOwnProperty(evts[i]))continue;
		var evt_listeners = this.listeners[evts[i]];
		var j = 0;
		for(j = 0;j < evt_listeners.length;j ++){
			if(evt_listeners[j].id == _id)break;
		}
		if(j < evt_listeners.length){
			evt_listeners.splice(j,1);
		}
	}
};
/**
虚拟操作面板
**/
var MeVPads = React.createClass({
	getInitialState:function(){
		this.lastTouchX = null;
		this.lastDeltaX = 0;
		this.pageCache = [];
		this.posXIdx = -1;
		this.posYIdx = -1;
		return {
		};
	},
	getDefaultProps:function(){
		return {
			bufferLen:3,
			pageHeight:1192,
			pageWidth:720,
			article:null,
		};
	},
	
	componentWillMount:function(){
		this.pageCacheIdx = Array(this.props.article.getNumOfPage());	//为了方便定义每个page的Cache
		for(var i = 0;i < this.pageCacheIdx.length;i ++){
			this.pageCacheIdx[i] = -1;
		}
		if(this.props.bufferLen == null || this.props.bufferLen < 3 || this.props.bufferLen > 10 )
			this.props.bufferLen = 3;
		for(var i = 0;i < this.props.bufferLen; i ++){
			this.pageCache.push({
				pageIdx:-1, // 当前缓存的页面
				rate:0,		// 缓存页面的分值，使用该分值评估是否需要重新使用
				state:"free",	//free:空闲，hide:装有page，但不能显示 standby:加载，但移除view之外, active:正在显示
				loc:"none",
				lock:false,	//锁定cache，不允许覆盖
				reactInstance:null
			});
		}
	},
	_findAvailableCache:function(){
		var smallestRate = 1000;
		var found = -1;
		for(var i = 0;i < this.pageCache.length;i ++){
			if(this.pageCache[i].rate < smallestRate && !this.pageCache[i].lock){
				smallestRate = this.pageCache[i].rate;
				found = i;
			}
		}
		console.log("alloc ",found);
		return found;	//@todo 加错误检查,应该获得一个空闲的page
	},
	_cachePage:function(pageIdx,state,loc){
		if(pageIdx < 0 || pageIdx > this.pageCacheIdx.length) return;
		var cacheIdx = this.pageCacheIdx[pageIdx];
		if(cacheIdx == -1){
			cacheIdx = this._findAvailableCache();
			if(cacheIdx == -1) return;//todo 严重错误
			/**尝试释放这个buffer*/
			/*if(this.pageCache[cacheIdx].reactInstance != null){
				ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this.pageCache[cacheIdx].reactInstance));
			}*/
			
			this.pageCacheIdx[pageIdx] = cacheIdx;
		}
		var cache = this.pageCache[cacheIdx];
		if(cache == null){
			console.log("critical error...");
		}
		if(cache.lock) return;//这个cache已经被激活，不用再次激活，，，通常是页面定义有冲突，比如page1的下一页也是page1
		cache.lock = true;
		if(state == "active") cache.rate += 4;
		else cache.rate += 2;
		//if(cache.pageIdx != -1 && cache.pageIdx != pageIdx){
		//	debugger;
		//}
		cache.pageIdx = pageIdx;
		cache.state = state;
		cache.loc = loc;
		if(cache.reactInstance != null){
			cache.reactInstance.updateBuffer({loc:cache.loc,state:cache.state,pageIdx:cache.pageIdx});
		}
		
	},
	loadPageByPos:function(posXIdx,posYIdx){//显示指定位置的页，对应的页在layout中定义
		var article = this.props.article;
		var pageIdx = article.getPageIdxInLayout(posXIdx,posYIdx);
		
		if(pageIdx < 0 || pageIdx > this.pageCacheIdx.length) return;
		
		this._cachePage(pageIdx,"active","middle");
		
		/*预加载相邻页*/
		var up = article.getNbrPageIdx("L2Prev",posXIdx,posYIdx);
		this._cachePage(up,"standby","up");
		
		var down = article.getNbrPageIdx("L2Next",posXIdx,posYIdx);
		this._cachePage(down,"standby","down");
		
		var left = article.getNbrPageIdx("L1Prev",posXIdx,posYIdx);
		this._cachePage(left,"standby","left");
		
		var right = article.getNbrPageIdx("L1Next",posXIdx,posYIdx);
		this._cachePage(right,"standby","right");
		
		for(var i = 0;i < this.pageCache.length;i ++){
			var cache = this.pageCache[i];
			if(!cache.lock){
				if(cache.rate > 0)
					cache.rate -= 1;
				if(cache.pageIdx != -1 && cache.reactInstance != null){
					cache.state = "hide";
					cache.loc = "none";
					cache.reactInstance.updateBuffer({state:cache.state,loc:cache.loc});
				}
			}else{
				cache.lock = false;//释放刚刚申请的page，供下次调度使用
			}
		}
		
		//console.log(this.pageCache);
		
	},
	moveXNext:function(){
		if(this.props.article.getPageIdxInLayout(this.posXIdx + 1,0) == -1) return;//翻到尽头
		this.posXIdx ++;
		this.posYIdx = 0;	//这是由作品的结构决定的，横向，作品有可能是单页，posYIdx位置失效
		this.loadPageByPos(this.posXIdx,this.posYIdx);
	},
	moveXPrev:function(){
		if(this.props.article.getPageIdxInLayout(this.posXIdx - 1,0) == -1) return;//翻到尽头
		this.posXIdx --;
		this.posYIdx = 0;
		this.loadPageByPos(this.posXIdx,this.posYIdx);
	},
	moveYNext:function(){
		if(this.props.article.getPageIdxInLayout(this.posXIdx,this.posYIdx + 1) == -1) return;//翻到尽头
		this.posYIdx ++;
		this.loadPageByPos(this.posXIdx,this.posYIdx);
	},
	moveYPrev:function(){
		if(this.props.article.getPageIdxInLayout(this.posXIdx,this.posYIdx - 1) == -1) return;//翻到尽头
		this.posYIdx --;
		this.loadPageByPos(this.posXIdx,this.posYIdx);
	},
	handleSwipe:function(evt){
		console.log("swipe ",evt);
		if(evt.direction == 2){
			this.moveNext();
		}else if (evt.direction == 1){
			this.movePrev();
		}
	},
	handleTap:function(evt){
		console.log("get tap in pad ",evt);
	},
	componentDidMount:function(){
		this.posXIdx = 0;
		this.posYIdx = 0;
		this.loadPageByPos(this.posXIdx,this.posYIdx);
	},
	_registerBuffer:function(ref){
		this.pageCache[ref.props.id].reactInstance = ref;
	},
	_registerHammer:function(ref){
		//this.hammer = ref;
		this.props.article.getCxt().interactHandler = 
					new MeHammer(ref.hammer,{"swipeleft":this.moveXNext,"swiperight":this.moveXPrev,
											"swipedown":this.moveYPrev,"swipeup":this.moveYNext});
	},
	render:function(){
		
		var offset_x = -(this.props.pageWidth * this.state.actPosIndex) + this.state.offset;
		var divStyle = {
			width: "auto",
			height: "1008px",
			"transform":"translate3d(" + offset_x + "px,0px,0px)",
			"backfaceVisibility": "hidden", 
			"perspective": "1000px", 
			"top":"36.5px",
			"left": "0px"
		};
		var self = this;
		
		var items = [];
		for(i = 0;i < this.props.bufferLen;i++){
			items.push(<PadBuffer id={i} posIdx={i} ref={self._registerBuffer} article = {self.props.article}></PadBuffer>)
		}
		return (
	<Hammer ref={this._registerHammer} id="oper-area" className ="magazine-page-container show" vertical={true}>
			<div>
			
			{items}
			{self.props.article.getToolBar()}
			</div>
			</Hammer>
		);
	},
	
});

	return MeVPads;
});
