define("MeGallary",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var _assign = require("object-assign");
var MeComponentMixin = require("../src/MeComponentMixin.js");	
var MeGallary  = React.createClass({
	mixins:[MeComponentMixin],
	displayName:"MeGallary",
	getInitialState:function(){
		return {
			actIdx:0
		};
	},
	getDefaultProps:function(){
		return{
			normalStyle:{display:"block"},
			imgItems:[],
		};
	},
	_triggerEvent:function(evt){
		if(evt.type == "swipeleft"){
			this.setState({
				actIdx:this.state.actIdx + 1
			})
			return false;
		}
		if(evt.type == "swiperight"){
			this.setState({
				actIdx:this.state.actIdx - 1
			})
			return false;
		}
	},
	detectionActive:function(enable){
		if(this.props.cxt.interactHandler != null && this.props.imgItems.length > 1){
			if(enable == false){ 
				this.props.cxt.interactHandler.off(
								"swipeleft swiperight",
								this.props.id);
			}
			else{
				this.props.cxt.interactHandler.on(
								"swiperight swipeleft",
								this.props.id,
								this._triggerEvent);
			}
		}
	},
	getWidth:function(){
		return parseInt(this.props.normalStyle.width);
	},
	pageActive:function(){
		this.componentPageActive();
		this.detectionActive(true);
	},
	pageDeactive:function(){
		this.componentPageDeactive();
		this.detectionActive(false);
	},
	render:function(){
		var _style = _assign(this.props.normalStyle);
		_style.overflow = "hidden";
		var imgComps = [];
		var self = this;
		var width = this.getWidth();
		for(var i = 0; i < this.props.imgItems.length;i ++){
			var xOffset = (i - this.state.actIdx) * width;
			var _transform = "translate(" + xOffset + "px,0px)"; 
			imgComps.push(<img src={self.props.imgItems[i].src} key={i} style={{height:self.props.normalStyle.height
																,width:self.props.normalStyle.width
																,position:"absolute"
																,transform:_transform}}></img>);
		}
		this.updateStyleForDisplay(_style);
		return <div id={this.props.id} style={_assign(_style)}>{imgComps}</div>
	}
});
return MeGallary;
});