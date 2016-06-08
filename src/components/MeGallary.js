define("MeGallary",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var _assign = require("object-assign");
var MeComponentMixin = require("../src/MeComponentMixin.js");	
var MeGallary  = React.createClass({
	mixins:[MeComponentMixin],
	displayName:"MeGallary",
	getInitialState:function(){
		this.timer = null;
		return {
			actIdx:0,
		};
	},
	getDefaultProps:function(){
		return{
			normalStyle:{display:"block"},
			imgItems:[],
			autoplay:true,
			gap:10,
		};
	},
	_triggerEvent:function(evt){
		if(evt.type == "swipeleft"){
			this.moveNext(false);
			return false;
		}
		if(evt.type == "swiperight"){
			this.movePrev(false);
			return false;
		}
	},
	detectionActive:function(enable){
		if(this.props.imgItems.length == 0) return;
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
	moveNext:function(loop){
		if(this.state.actIdx >= this.props.imgItems.length - 1){
			if(loop != false)this.setState({actIdx:0});
		}else{
			this.setState({actIdx:this.state.actIdx + 1});
		}
	},
	movePrev:function(loop){
		if(this.state.actIdx <= 0) return;
		this.setState({actIdx:this.state.actIdx - 1});
	},
	getWidth:function(){
		return parseInt(this.props.normalStyle.width);
	},
	pageActive:function(){
		var myself = this;
		this.componentPageActive();
		if(this.props.imgItems.length == 0) return;
		if(this.props.autoplay){
			this.timer = setInterval(function(){myself.moveNext(true);},this.props.gap * 1000);
		}
		this.detectionActive(true);
	},
	pageDeactive:function(){
		this.componentPageDeactive();
		if(this.timer != null){
			Window.clearInterval(this.timer);
			this.timer = null;
		}
		this.detectionActive(false);
	},
	render:function(){
		var _style = _assign(this.props.normalStyle);
		_style.overflow = "hidden";
		var imgComps = [];
		var inds = [];
		var self = this;
		var width = this.getWidth();
		var _transform = "translate(-" + this.state.actIdx * width + "px,0px)"; 
		for(var i = 0; i < this.props.imgItems.length;i ++){
			imgComps.push(<img src={self.props.imgItems[i].src} key={i} className="img-item" style={{height:self.props.normalStyle.height
																,width:self.props.normalStyle.width
																}}></img>);
			var indClass = "indicator " + (i == self.state.actIdx ? "photos-on" : ""); 
			inds.push(<span className={indClass}></span>);
		}
		this.updateStyleForDisplay(_style);
		return <div className="me-gallary"  id={this.props.id} style={_assign(_style)}> 
					<div className="img-collection" style={{width:width*this.props.imgItems.length,transform:_transform}}>
						{imgComps}
					</div>
					<div className="inds">
					{inds}
					</div>
				</div>
	}
});
return MeGallary;
});

