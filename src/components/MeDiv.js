define("MeDiv",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var _assign = require("object-assign");
var MeComponentMixin = require("../src/MeComponentMixin.js");	
var MeDiv  = React.createClass({
	mixins:[MeComponentMixin],
	displayName:"MeDiv",
	getDefaultProps:function(){
		return{
			normalStyle:{display:"block"}
		};
	},
	pageActive:function(){
		this.componentPageActive();
	},
	pageDeactive:function(){
		this.componentPageDeactive();
	},
	render:function(){
		var _style = _assign({}, this.props.normalStyle);
		this.updateStyleForDisplay(_style);
		return <div id={this.props.id} style={_assign({}, _style)}>{this.props.children}</div>
	}
});
return MeDiv;
});