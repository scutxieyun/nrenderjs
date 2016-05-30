define("MePanArea",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var MeComponentMixin = require("../src/MeComponentMixin");
	var MePanArea  = React.createClass({
		displayName:"MePanArea",
		mixins:[MeComponentMixin],
		getInitialState:function(){
			this.xBeforePan = 0;
			this.yBeforePan = 0;
			return {
				x_offset:0,
				y_offset:0
			}
		},
		lastDeltaTime:0,
		getDefaultProps:function(){
			return {
				normalStyle:{},
				autoActive:true
			};
		},
		interactHandle:function(evt){
			if(evt.type == "pan"){
				if(evt.additionalEvent == "panup" || evt.additionalEvent == "pandown"){
					if(evt.deltaTime < this.lastDeltaTime)
					{//新的事件,但却到达页尾的处理
						this.xBeforePan = this.state.x_offset;
						this.yBeforePan = this.state.y_offset;
					}
					this.lastDeltaTime = evt.deltaTime;
					this.setState({
						x_offset:0,//this.state.x_offset + evt.deltaX,
						y_offset:this.yBeforePan + evt.deltaYgit
					});
				}else{
				}
			}
		},
		pageActive:function(){
			this.componentPageActive();
			this.props.cxt.interactHandler.on("pan swipeup swipedown swipeleft swipright",this.getId(),this.interactHandle)
			console.log("get page active");
		},
		pageDeactive:function(){
			this.componentPageDeactive();
			this.setState({
				x_offset:0,
				y_offset:0
			});
			this.props.cxt.interactHandler.off("pan swipeup swipedown swipeleft swipright",this.getId(),this.interactHandle)
			console.log("get page deactive");
		},
		render:function(){
			var  transform = "translate3d(" + this.state.x_offset +"px," + this.state.y_offset + "px,0px)";
			var _style = this.props.normalStyle;
			_style.transform = transform;
			this.updateStyleForDisplay();
			return(<div id={this.getId()} ref="interactArea" style={_style}>{this.props.children}</div>);
		}
	});
	return MePanArea;
});