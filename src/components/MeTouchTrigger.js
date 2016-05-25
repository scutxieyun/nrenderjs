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
				listenEvt:{//
					active:null,				//激活检测的事件
					triggerEvt:"swipeleft",		//需要检测的交互事件
				},
				id:this.displayName + MeComponentMixin.getIncId(),//因为这个控件需要pageActive，为了减少应用的麻烦，自己先定义一个id
			}
		},
		_triggerEvent:function(evt){//发送事件
			/*if(this.props.repeat == false && this.state.triggeredCount > 0){
			//禁止反复触发
				this.detectionActive(false);
				return true;
			}
			this.props.cxt.ee.emitEvent(this.props.evtName,this);
			this.state.triggeredCount ++;*/
			if(this.props.triggerActions.hasOwnProperty(evt.type)){
				this.handleCmd(this.props.triggerActions[evt.type].action);
				return this.props.triggerActions[evt.type].propagate;
			}
			return true;
		},
		detectionActive:function(enable){
			if(this.props.cxt.interactHandler != null && this.props.triggerActions != null){
				if(enable == false){ 
					this.props.cxt.interactHandler.off(
									MeTouchTrigger.getTriggerEvents(this.props.triggerActions),
									this.refs.meswipe);
				}
				else{
					this.props.cxt.interactHandler.on(
									MeTouchTrigger.getTriggerEvents(this.props.triggerActions),
									this.refs.meswipe,
									this._triggerEvent);
				}
			}
		},
		_detectionActive:function(){
			this.state.triggeredCount = 0;
			this.detectionActive(true);
		},
		pageActive:function(){
			this._detectionActive();
		},
		pageDeactive:function(){
			if(this.props.listenEvt.active != null)
				this.props.cxt.ee.removeListener(this.props.listenEvt.active,this._detectionActive);
			this.detectionActive(false);
		},
		render:function(){
			return <div ref="meswipe" id="registerTouch" style={this.props.normalStyle}>{this.props.children}</div>
		}});
	return MeTouchTrigger;
});
