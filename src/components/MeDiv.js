define("MeDiv",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var _assign = require("object-assign");
var MeComponentMixin = require("../src/MeComponentMixin.js");	
var MeDiv  = React.createClass({
	mixins:[MeComponentMixin],
	displayName:"MeDiv",
	render:function(){
		var _style = this.props.style;
		if(this.state.display == false) _style.display = "none";
		else if(_style.display == "none") _style.display = "block";
		return <div id={this.props.id} style={_style}>{this.props.children}</div>
	}
});
return MeDiv;
});