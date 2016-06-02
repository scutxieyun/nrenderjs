var React = require("react");
var ReactDOM = require("react-dom");
define("MePage",function(){
	var MePage  = React.createClass({
		containerWidth:720,
		containerHeight:1020,//所有page公用这个变量
		getInitialState:function(){
			this.container = {};//让页面内的组件进行注册
			this.pageListener = [];
			this._lastDeltaTime = 0;
			this._xBeforePan = 0;
			this._yBeforePan = 0;
			this._lastEdge = 1;//上顶部
			return{
				active:false,
				y_offset:0,
				x_offset:0
			};
		},
		getDefaultProps:function(){
			return {
				normalStyle:{
					height:"1008px", //为了兼容老的杂志没有这个信息
					width:"640px"
				}
			};
		},
		registerComponent:function(compId,comRef){
			//Page内的组件登记，为了获得页面状态改变通知和组件间定位
			if(compId != undefined){
				if(this.container.hasOwnProperty(compId)){
					console.log("warning the name may duplicate");
				}
				this.container[compId] = comRef;
			}
			var comHeight = ReactDOM.findDOMNode(comRef).height;
			if(comHeight > this.pageHeight){
				this.pageHeight = comHeight;
			}
			return this;
		},
		getComponent:function(compId){
			if(this.container.hasOwnProperty(compId)){
				return this.container[compId];
			}
			return null;
		},
		addListener:function(comRef){
			if(comRef != null){// @todo 应该做重复检查
				this.pageListener.push(comRef);
			}
		},
		removeListener:function(comRef){
			if(comRef != null){
				var i = 0;
				for(i = 0;i < this.pageListener.length;i ++){
					if(this.pageListener[i] == comRef)break;
				}
				if(i < this.pageListener.length){
					this.pageListener.splice(i,1);
				}
			}
		},
		notifyPageEvent:function(){
			var i = 0;
			for(i = 0;i < this.pageListener.length;i ++){
				if(this.pageListener[i] != null){
					if(this.state.active){
						this.pageListener[i].pageActive(this);
					}else{
						this.pageListener[i].pageDeactive(this);
					}
				}
			}
			var _method = this.state.active ? "pageActive" : "pageDeactive"; 
			for(var compid in this.container){
				if(this.container[compid].hasOwnProperty(_method)){
					var compMethod = this.container[compid][_method];
					if(!!(compMethod && compMethod.constructor && compMethod.call && compMethod.apply)){
						compMethod.apply(null,{page:this});
					}
				}
			}
		},
		interactHandle:function(evt){
			var res = true; //到达边界否
			if(evt.type == "pan"){
				if(evt.additionalEvent == "panup" || evt.additionalEvent == "pandown"){
					if(evt.deltaTime < this._lastDeltaTime)
					{//新的事件,但却到达页尾的处理
						this._xBeforePan = this.state.x_offset;
						this._yBeforePan = this.state.y_offset;
					}
					this._lastDeltaTime = evt.deltaTime;
					res = this._setOffset({
						x:0,
						y:this._yBeforePan + evt.deltaY
					});
				}else{
				}
			}else{
				if(evt.type == "swipeup"){
					res = this._setOffset({
						x:0,
						y:this.state.y_offset - this.containerHeight/2,
					});
				}
				if(evt.type == "swipedown"){
					res = this._setOffset({
						x:0,
						y:this.state.y_offset + this.containerHeight/2,
					});
				}
			}
			if(res == this._lastEdge){
				return true;//允许上层hammer继续处理
			}
			this._lastEdge = res;
			return false;
		},
		_setOffset:function(newOffset){
			var pSize = this.getPageSize();
			var atEdge = false;
			var lastY = newOffset.y;
			if(newOffset.y > 0){
				lastY = 0;
				atEdge = 1;
			}
			if(newOffset.y < this.containerHeight - pSize.height){
				lastY = this.containerHeight - pSize.height;
				atEdge = 2;
			}
			this.setState({
				x_offset:0,
				y_offset:lastY
			});
			return atEdge;
		},
		pageActive:function(){
			var size = this.getPageSize();
			this._lastEdge = 1;//在上顶部
			if(size.height > this.containerHeight){
			//注册漫游功能
				this.props.cxt.interactHandler.on("pan swipeup swipedown",this.getId(),this.interactHandle);
			}
		},
		getPageSize:function(){
			return{
				height:parseInt(this.props.normalStyle.height),
				width:parseInt(this.props.normalStyle.width)
			};
		},
		pageDeactive:function(){
			this.setState({
				y_offset:0,
				x_offset:0
			});
			this.props.cxt.interactHandler.off("pan swipeup swipedown",this.getId(),this.interactHandle);
		},
		setContainerSize:function(_width,_height){
			this.containerWidth = _width;
			this.containerHeight = _height;
		},
		componentWillMount:function(){
			if(this.props.cxt.pageMgr != null){
				this.props.cxt.pageMgr.registerPage(this);
			}
			//在Vpads中强制页面重新加载后这个调用可以放在这里
		},
		componentDidUpdate:function(prevProps,prevState){
			if(prevState.active != this.state.active){
				var pageActEvt = "page[" + this.props.idx + "]:" + (this.state.active ? "active":"deactive");
				console.log(pageActEvt);
				this.props.cxt.ee.emitEvent(pageActEvt,[{target:this,active:this.state.active}]);
				this.notifyPageEvent();
				if(this.state.active){
					this.pageActive();
				}else{
					this.pageDeactive();
				}
			}
		},
		componentWillUnmount:function(){
			console.log("me page will be unmounted at page",this.props.idx);
		},
		getId:function(){
			return "page" + this.props.idx;
		},
		render:function(){
			//if(this.props.cxt.pageMgr != null){
			//	this.props.cxt.pageMgr.registerPage(this); 
			//}
			var  transform = "translate3d(" + this.state.x_offset +"px," + this.state.y_offset + "px,0px)";
			var _style = this.props.normalStyle != undefined ? this.props.normalStyle:{};
			_style.transform = transform;
			return <div className="me-page" id={this.getId()} style={_style} >{this.props.children}</div>;
		}});
	return MePage;
});

