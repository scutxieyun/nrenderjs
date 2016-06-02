define("mevpads",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var Hammer = require("react-hammerjs");
var _assign = require("object-assign");
var PadBuffer = React.createClass({
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
		this.bufferredState = {
			pageIdx:-1,
			state:"standby"
		}
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
	//这个函数实现有局限，他假定pageIdx和state一起设置，如果分开设置，程序会有问题
	updateBuffer:function(newState){
	//不能让pads直接设置pageIdx，所以用这个函数过度一下
		var _toSet = _assign({},newState);
		if(this.state.pageIdx != -1 && this.state.pageIdx != newState.pageIdx && newState.pageIdx != -1 && newState.pageIdx != undefined){
		//需要delay修改,先使用无效页，将当前的内容清除，然后再置上新页
			if(this.bufferredState.pageIdx != -1){
				console.log("try to update delay loading:",this.bufferredState.pageIdx," with ",newState.pageIdx, " cur state ",this.state.pageIdx);
			}
			this.bufferredState.pageIdx = newState.pageIdx;
			if(newState.state == "active"){
				_toSet.state = "standby";//暂时不要激活
			}
			this.bufferredState.state = newState.state;
			_toSet.pageIdx = -1;
			console.log("delay the page:",this.bufferredState.pageIdx," in buffer ",this.props.id, " own ",this.state.pageIdx);
		}
		//if(this.state.state == "active" && this.state.state != _toSet.state)
		//{
		//		this.delayState = _toSet.state;
		//		_toSet.state = this.state.state;
		//}
		this.setState(_toSet);
	},
	tick:function(){
		var tem = this.bufferredState.pageIdx;
		this.bufferredState.pageIdx = -1
		if(tem != -1){
			console.log("do actual update for ",tem," in buffer ",this.props.id);
			this.setState({pageIdx:tem,
							state:this.bufferredState.state});
		}
		//if(this.delayState != null){
		//	this.setState({state:this.delayState});
		//}
		//this.delayState = null;
	},
	componentWillMount:function(){//没找到一个好方法创建非state的属性，暂时这样
	},
	componentDidUpdate:function(prevProps,prevState){
		var myself = this;
		if((this.bufferredState.pageIdx != -1 && this.state.pageIdx == -1)){
			setInterval(function(){myself.tick()},0);
			return;
		}
		var react_page = this._getPageInstance();
		var old_active = prevState.state == "active" ? true : false;
		var cur_active = this.state.state == "active" ? true : false;
		if(react_page != null && old_active != cur_active){
			react_page.setContainerSize(this.props.pageWidth,this.props.pageHeight);
			react_page.setState({active:cur_active});
			//console.log("react page update with ",this.state);
		}
	},
	
	render:function(){
		var className = this.state.state == "active" ? "active":"deactive";
		//var zIndex = this.state.state == "active" ? 1 : 0;
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
			for(var i = 0;i < evt_listeners.length;i ++){
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
		return found;	//@todo 加错误检查,应该获得一个空闲的page
	},
	_cachePage:function(pageIdx,state,loc){
		if(pageIdx < 0 || pageIdx > this.pageCacheIdx.length) return;
		var cacheIdx = this.pageCacheIdx[pageIdx];
		if(cacheIdx == -1){
			cacheIdx = this._findAvailableCache();
			if(cacheIdx == -1) return;//todo 严重错误
			if(this.pageCache[cacheIdx].pageIdx != -1){
				this.pageCacheIdx[this.pageCache[cacheIdx].pageIdx] = -1;//释放这个cache
			}
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
	_preLoadPage:function(idx,loc,remainders){
		if(idx == -1)return;
		if(this.pageCacheIdx[idx] != -1) this._cachePage(idx,"standby",loc); //提前加载
		else
			remainders.push({
				pageIdx:idx,
				loc:loc
			});
	},
	loadPageByPos:function(posXIdx,posYIdx){//显示指定位置的页，对应的页在layout中定义
		var candidatePages = [];
		var article = this.props.article;
		var pageIdx = article.getPageIdxInLayout(posXIdx,posYIdx);
		
		if(pageIdx < 0 || pageIdx > this.pageCacheIdx.length) return;
		
		var up = article.getNbrPageIdx("L2Prev",posXIdx,posYIdx);
		this._preLoadPage(up,"up",candidatePages);

		var down = article.getNbrPageIdx("L2Next",posXIdx,posYIdx);
		this._preLoadPage(down,"down",candidatePages);
		
		var left = article.getNbrPageIdx("L1Prev",posXIdx,posYIdx);	
		this._preLoadPage(left,"left",candidatePages);
		
		var right = article.getNbrPageIdx("L1Next",posXIdx,posYIdx);
		this._preLoadPage(right,"right",candidatePages);
		
		this._cachePage(pageIdx,"active","middle"); //最后再激活
		
		for(var i = 0;i < candidatePages.length;i ++){
			 this._cachePage(candidatePages[i].pageIdx,"standby",candidatePages[i].loc);
		}

		console.log(pageIdx,up,down,left,right,candidatePages);
		
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
	handlePan:function(){

	},
	_registerHammer:function(ref){
		//this.hammer = ref;
		this.props.article.getCxt().interactHandler = 
					new MeHammer(ref.hammer,{"swipeleft":this.moveXNext,"swiperight":this.moveXPrev,
											"swipedown":this.moveYPrev,"swipeup":this.moveYNext,
											"pan":this.handlePan});
	},
	_smartAdjustTranform:function(){
		var yScale = this.props.containerHeight / this.props.pageHeight;
		var xScale = this.props.containerWidth / this.props.pageWidth;
		var xOffset = 0;
		if(this.props.containerWidth > this.props.pageWidth){
			xOffset = (this.props.containerWidth - this.props.pageWidth) / 2 / xScale
		}
		var yOffset = 0;
		if(this.props.containerHeight > this.props.pageHeight){
			yOffset = (this.props.containerHeight - this.props.pageHeight) / 2 / yScale;
		}
		var res = "scale(" + xScale + "," + yScale + ") translate(" + xOffset + "px," + yOffset + "px)";   
		return res;
	},
	
	
	render:function(){
		
		var offset_x = -(this.props.pageWidth * this.state.actPosIndex) + this.state.offset;
		var self = this;
		
		var items = [];
		for(var i = 0;i < this.props.bufferLen;i++){
			items.push(<PadBuffer id={i} key={i} posIdx={i} ref={self._registerBuffer} article = {self.props.article}></PadBuffer>)
		}
		return (
	<Hammer ref={this._registerHammer} id="oper-area" className ="magazine-page-container show" vertical={true}>
			<div style={{height:this.props.pageHeight + "px",width:this.props.pageWidth + "px", transform:this._smartAdjustTranform()}}>
			<div style={{backgroundImage:'url("http://ac-hf3jpeco.clouddn.com/15509a86b6c9ab79.png?imageView2/2/w/640")',
			height:"100%",width:"100%"}}>
			{items}
			{self.props.article.getToolBar()}
			</div>
			</div>
			</Hammer>
		);
	},
	
});

	return MeVPads;
});
