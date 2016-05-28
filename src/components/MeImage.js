define("MeImage",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var _assign = require("object-assign");
var MeComponentMixin = require("../src/MeComponentMixin.js");	
var MeImage  = React.createClass({
	mixins:[MeComponentMixin],
	displayName:"MeImage",
	render:function(){
		var _style = this.props.style;
		if(this.state.display == false) _style.display = "none";
	return <img id={this._cid} src={this.props.src} style={_style}>{this.props.children}</img>
	}
});
return MeImage;
});