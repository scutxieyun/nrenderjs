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
				listenEvt:{//字符串，定义哪些事件触发动画启动
					active:null,
					deactive:null
				},
				normalStyle:{
					position:"absolute",
				},
				autoActive:true
			}
		},
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
		},
		render:function(){
			var className = this.getAnimationClass();
			//处理display属性
			return <div className={className} style={_assign(this.props.animation,this.props.normalStyle)}> {this.props.children}</div>
		}});
	return MeAnimation;
});
