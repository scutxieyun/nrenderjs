var React = require("react");
var ReactDOM = require("react-dom");
define("MePage",function(){
	var MePage  = React.createClass({
		containerWidth:720,
		containerHeight:1020,
		getInitialState:function(){
			this.container = {};//让页面内的组件进行注册
			this.pageListener = [];
			return{
				active:false,
				y_offset:0,
				x_offset:0
			};
		},
		registerComponent:function(compId,comRef){
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
		_lastDeltaTime:0,
		_xBeforePan:0,
		_yBeforePan:0,
		interactHandle:function(evt){
			if(evt.type == "pan"){
				if(evt.additionalEvent == "panup" || evt.additionalEvent == "pandown"){
					if(evt.deltaTime < this._lastDeltaTime)
					{//新的事件,但却到达页尾的处理
						this._xBeforePan = this.state.x_offset;
						this._yBeforePan = this.state.y_offset;
					}
					this._lastDeltaTime = evt.deltaTime;
					this._setOffset({
						x:0,
						y:this._yBeforePan + evt.deltaY
					});
				}else{
				}
			}else{
				if(evt.type == "swipeup"){
					this._setOffset({
						x:0,
						y:this.state.y_offset - this.containerHeight/2,
					});
				}
				if(evt.type == "swipedown"){
					this._setOffset({
						x:0,
						y:this.state.y_offset + this.containerHeight/2,
					});
				}
			}
		},
		_setOffset:function(newOffset){
			var pSize = this.getPageSize();
			var lastY = newOffset.y;
			if(newOffset.y > 0){
				lastY = 0;
			}
			if(newOffset.y < this.containerHeight - pSize.height){
				lastY = this.containerHeight - pSize.height;
			}
			this.setState({
				x_offset:0,
				y_offset:lastY
			});
		},
		pageActive:function(){
			var size = this.getPageSize();
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
			console.log("mepage will be unmounted",this);
		},
		getId:function(){
			return "page" + this.props.idx;
		},
		render:function(){
			//if(this.props.cxt.pageMgr != null){
			//	this.props.cxt.pageMgr.registerPage(this); 
			//}
			var  transform = "translate3d(" + this.state.x_offset +"px," + this.state.y_offset + "px,0px)";
			var _stype = this.props.normalStyle != undefined ? this.props.normalStyle:{};
			_stype.transform = transform;
			return <div className="me-page" id={this.getId()} style={_stype} >{this.props.children}</div>;
		}});
	return MePage;
});

