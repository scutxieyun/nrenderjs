define("MeMusic",function(){
/**
note:
这个控件仅仅提供背景音乐
*/	
	
var React = require("react");
var ReactDOM = require("react-dom");
var MeMediaMixin = require("../src/MeMediaMixin.js")
var MeMusic = React.createClass({
	displayName         :"MeMusic",
	mixins:[MeMediaMixin],
	getDefaultProps     :function(){
		return {
			autoplay:true
		}
	},
	componentDidMount   :function(){
		if(this.props.autoplay) this.play();
	},
	componentWillUnmount:function(){
		this.refs.mediaPlay.pause();
	},
	render              :function(){
		var spinClass = this.state.isPlay ? "spin" : "";
		var noteClass = this.state.isPlay ? "note" : "";
		return( 
		<div id="magazine-music-wrapper" className="half-zoom" style={{display:"block"}}>
			<span>开启音乐</span>
			<audio src={this.props.src} preload="none" loop="loop" className="main-audio" autoplay ref="mediaPlay" ></audio>
			<div className={"fly-note1 " + noteClass}></div>
            <div className={"fly-note2 " + noteClass}></div>
			<menu onClick={this.togglePlay} id={this.props.id} className={spinClass}></menu>
		</div>
		)
	}
});
return MeMusic;
});


