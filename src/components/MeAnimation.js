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
		pageActive:function(){
			this.componentPageActive();
			if(this.props.autoActive)
				this.animationActive();
		},
		pageDeactive:function(){
			this.componentPageDeactive();
			this.animationDeactive();//无论是否自动启动, 都将动画设为禁止
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
		render:function(){
			var className = this.getAnimationClass();
			var _style = _assign(this.props.animation,this.props.normalStyle);
			this.updateStyleForDisplay(_style);
			return <div id={this.getId()} className={className} style={_style}> {this.props.children}</div>
		}});
	return MeAnimation;
});
