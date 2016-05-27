define("MeMusic",function(){
var React = require("react");
var ReactDOM = require("react-dom");
var MeMusic = React.createClass({
	displayName         :"MeMusic",
	getDefaultProps     :function(){
		return {
			autoplay:true
		}
	},
	componentDidMount   :function(){
		if(this.props.autoplay) this.refs.player.play();
	},
	toggleAudio         :function(){
		if(!this.refs.player.paused)this.refs.player.pause();
		else this.refs.player.play();
	},
	componentWillUnmount:function(){
		this.refs.player.pause();
	},
	render              :function(){
		return( 
		<div id="magazine-music-wrapper" className="half-zoom" style={{display:"block"}}>
			<span>开启音乐</span>
			<audio src={this.props.src} preload="none" loop="loop" className="main-audio" autoplay ref="player" ></audio>
			<div className="fly-note1  note"></div>
            <div className="fly-note2  note"></div>
			<menu onClick={this.handleClick} id={this.props.id} className="spin"></menu>
		</div>
		)
	}
});
return MeMusic;
});


