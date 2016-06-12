/**
 * Created by lifeng on 2016/5/25.
 */
define("MeAudio", function () {
    var React = require("react");
    var MeMediaMixin = require("../src/MeMediaMixin.js");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeAudio = React.createClass({
        mixins     : [MeComponentMixin,MeCommandMixin,MeMediaMixin],
        pageActive:function(){
			if(this.props.autoplay){
				this.play();
			}
		},
		pageDeactive:function(){
			this.pause();
		},
        /**
         * 音频播放结束处理函数
         */
        audioEndHandle : function(){
            var self = this;
            var _video = self.refs.mediaPlay;
            _video.addEventListener("ended", function(e){
                //视频播放结束
                //TODO 视频播放结束的时候需要播放背景音乐,和执行脚本
                if((!!self.props.triggerActions) && (!!self.props.triggerActions.tap))
                    self.callActionMethod(self.props.triggerActions.tap);
                self.setState({
                    isPlay:false
                });
            })
        },
        render: function () {
			var playingClass = this.state.isPlay ? "playing" : "";
            return (<div className="audioWrapper" onClick={this.togglePlay} style={this.props.normalStyle}>
                <audio src={this.props.src} preload="none"
                       play-status="play-current" ref="mediaPlay"></audio>
				<div className={"audioBack " + playingClass}></div>
            </div>)
        },
        componentDidMount: function () {
            this.audioEndHandle();
        }
    });
    return MeAudio;
});
