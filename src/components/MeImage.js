define("MeImage",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var _assign = require("object-assign");
var MeComponentMixin = require("../src/MeComponentMixin.js");	
var MeImage  = React.createClass({
	/** 简单的封装，主要是为了支持hide,show等调用，制作模块，转换程序应该考虑，非必要时，直接使用img
	**/
	mixins:[MeComponentMixin],
	displayName:"MeImage",
    getInitialState:function(){
        this.myRef = "myMeImage";
        return {};
    },
	render:function(){
		var _style = this.props.normalStyle;
		this.updateStyleForDisplay(_style);
		return <img id={this.getId()} src={this.props.src} ref={this.myRef} style={_style}>{this.props.children}</img>
	}
});
return MeImage;
});