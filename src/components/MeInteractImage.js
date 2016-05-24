define("MeInteractImage",function(){
var React = require("react");
var ReactDOM = require("react-dom");
	var MeInteractImage  = React.createClass({
		getInitialState:function(){
			this.xBeforePan = 0;
			this.yBeforePan = 0;
			this.lastDeltaTime = 0;
			return {
				x_offset:0,
				y_offset:0
			}
		},
		getDefaultProps:function(){
			return {
				normalStyle:{}
			};
		},
		componentDidMount:function(){
			this.props.cxt.pageMgr.addPageListener(this.props.pageIdx,this); 
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
						y_offset:this.yBeforePan + evt.deltaY
					});
				}else{
					//this.props.cxt.interactHandler.stop();
				}
			}
			//console.log("receive ",evt);
		},
		pageActive:function(){
			this.props.cxt.interactHandler.on("pan swipeup swipedown swipeleft swipright",this.refs.interactArea,this.interactHandle)
			console.log("get page active");
		},
		pageDeactive:function(){
			this.setState({
				x_offset:0,
				y_offset:0
			});
			this.props.cxt.interactHandler.off("pan swipeup swipedown swipeleft swipright",this.refs.interactArea,this.interactHandle)
			console.log("get page deactive");
		},
		render:function(){
			var  transform = "translate3d(" + this.state.x_offset +"px," + this.state.y_offset + "px,0px)";
			this.props.normalStyle.transform = transform;
			return(<img ref="interactArea" src={this.props.src} style={this.props.normalStyle}></img>);
		}
	});
	return MeInteractImage;
});