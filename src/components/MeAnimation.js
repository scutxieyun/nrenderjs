define("MeAnimation",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var _assign = require("object-assign");
var MeComponentMixin = require("../src/MeComponentMixin.js");	
var MeAnimationMxin = require("../src/MeAnimationMixin.js");
	var MeAnimation  = React.createClass({
		displayName:"MeAnimation",
		mixins:[MeComponentMixin,MeAnimationMxin],
		getDefaultProps:function(){
			return {
				normalStyle:{
					position:"absolute",
				},
				autoActive:true
			}
		},
		getInitialState:function(){
			return {
				animationIndex:0
			}
		},
		animationEnd:function(){
			if(this.props.animationClass instanceof Array && 
				this.state.animationIndex < this.props.animationClass.length - 1){
				this.setState({animationIndex:this.state.animationIndex + 1});//执行下一个动画
			}
		},
		pageActive:function(){
			this.componentPageActive();
			if(this.props.autoActive && this.state.display == true)
				this.animationActive();
			var myDOM = ReactDOM.findDOMNode(this);
			myDOM.addEventListener("animationend",this.animationEnd, false);
		},
		pageDeactive:function(){
			this.componentPageDeactive();
			this.animationDeactive();//无论是否自动启动, 都将动画设为禁止
			var myDOM = ReactDOM.findDOMNode(this);
			myDOM.removeEventListener("animationend",this.animationEnd, false);
		},
		
		/*
		自定义消息触发动画，考虑到与已有作品的模型兼容，放弃事件触发，改为函数调用，参见componentDo伪函数
		componentWillMount:function(){
			if(this.props.listenEvt.active != null)
				this.props.cxt.ee.addListener(this.props.listenEvt.active,this.animationActive);
			if(this.props.listenEvt.deactive != null)
				this.props.cxt.ee.addListener(this.props.listenEvt.deactive,this.animationDeactive);
		},
		componentWillUnmount:function(){
			if(this.props.listenEvt.active != null)
				this.props.cxt.ee.removeListener(this.props.listenEvt.active,this.animationActive);
			if(this.props.listenEvt.deactive != null)
				this.props.cxt.ee.removeListener(this.props.listenEvt.deactive,this.animationDeactive);
		},*/
		getAnimationClass:function(){
			var animationClass = this.props.animationClass;
			if(this.props.animationClass instanceof Array){
				if(this.state.animationIndex < this.props.animationClass.length){
					animationClass = this.props.animationClass[this.state.animationIndex];
				}else{
					animationClass = "hidden";
				}
			}
			var className = (this.state.animationState == "start" ? "animated " + animationClass:"hidden");
			return className;
		},
		getAnimationCss:function(){
			var animation = this.props.animation;
			if(this.props.animation instanceof Array){
				if(this.state.animationIndex < this.props.animation.length){
					animation = this.props.animation[this.state.animationIndex];
				}else{
					animation = {};
				}
			}
			return animation;
		},
		render:function(){
			var className = this.getAnimationClass();
			var _style = _assign(this.getAnimationCss(),this.props.normalStyle);
			this.updateStyleForDisplay(_style);
			return <div id={this.getId()} className={className} style={_style}> {this.props.children}</div>
		}});
	return MeAnimation;
});
