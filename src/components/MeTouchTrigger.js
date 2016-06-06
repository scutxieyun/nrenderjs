define("MeTouchTrigger",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var Hammer = require("react-hammerjs");
var _assign = require("object-assign");
var MeCommandMixin = require("../src/MeCommandMixin.js");
var MeComponentMixin = require("../src/MeComponentMixin.js");
	var MeTouchTrigger  = React.createClass({
		statics:{
			getTriggerEvents:function(triggerActions){
				var str = [];
				for(var key in triggerActions){
					str.push(key);
				}
				return str.join(" ");
			}
		},
		mixins:[MeComponentMixin,MeCommandMixin],
		displayName:"MeTouchTrigger",
		getInitialState:function(){
			return{
				triggeredCount:0,
				active:true
			}
		},
		getDefaultProps:function(){
			return {
				repeat:false,
				evtName:"trigger1",			//检测到交互事件后，发送的事件
				normalStyle:{},
				autoActive:true,
				//所有对象都引用同一个defaultProps，所以不要试图在这里初始化动态的prop
				//id:this.displayName + MeComponentMixin.getIncId(),//因为这个控件需要pageActive，为了减少应用的麻烦，自己先定义一个id
			}
		},
		_triggerEvent:function(evt){//发送事件
			if(this.props.triggerActions.hasOwnProperty(evt.type)){
				var actions = [this.props.triggerActions[evt.type]];
				if(this.props.triggerActions[evt.type] instanceof Array){
					actions = this.props.triggerActions[evt.type];
				}
				var propagate = false;
				for(var i = 0;i < actions.length; i ++){
                    console.log(actions[i].action);
					this.handleCmd(actions[i].action);
					propagate |= actions[i].propagate;
					
				}
				return propagate;
			}
			return true;
		},
		detectionActive:function(enable){
			if(this.props.cxt.interactHandler != null && this.props.triggerActions != null){
				if(enable == false){ 
					this.props.cxt.interactHandler.off(
									MeTouchTrigger.getTriggerEvents(this.props.triggerActions),
									this.props.id);
				}
				else{
					this.props.cxt.interactHandler.on(
									MeTouchTrigger.getTriggerEvents(this.props.triggerActions),
									this.props.id,
									this._triggerEvent);
				}
			}
		},
		_detectionActive:function(){
			this.state.triggeredCount = 0;
			this.detectionActive(true);
		},
		pageActive:function(){
			this.componentPageActive();
			this._detectionActive();
		},
		pageDeactive:function(){
			this.componentPageDeactive();
			this.detectionActive(false);
		},
		render:function(){
			var _style = this.props.normalStyle;
			this.updateStyleForDisplay(_style);
			return <div ref="meswipe" id={this.props.id} style={_style}>{this.props.children}</div>
		}});
	return MeTouchTrigger;
});
