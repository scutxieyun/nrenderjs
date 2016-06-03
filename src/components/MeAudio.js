/**
 * Created by lifeng on 2016/5/25.
 */
define("MeAudio", function () {
    var React = require("react");
    var MeMediaMixin = require("../src/MeMediaMixin.js");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeAudio = React.createClass({
        mixins     : [MeComponentMixin,MeMediaMixin],
        pageActive:function(){
			if(this.props.autoplay){
				this.play();
			}
		},
		pageDeactive:function(){
			this.pause();
		},
        render: function () {
			var playingClass = this.state.isPlay ? "playing" : "";
            return (<div className="audioWrapper" onClick={this.togglePlay} style={this.props.normalStyle}>
                <audio src={this.props.src} preload="none"
                       play-status="play-current" ref="mediaPlay"></audio>
				<div className={"audioBack " + playingClass}></div>
            </div>)
        }
    });
    return MeAudio;
});
