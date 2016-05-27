/**
 * Created by lifeng on 2016/5/25.
 */
define("MeAudio", function () {
    var React = require("react");
    var ReactDOM = require("react-dom");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeAudio = React.createClass({
        getInitialState(){
            return {isPlay: false}
        },
        mixins     : [MeComponentMixin,MeCommandMixin],
        toggleAudio: function () {
            if (this.state.isPlay) {
                this.refs.player.pause();
            }
            else {
                this.refs.player.play();
            }
            this.setState({isPlay: !this.state.isPlay})
        },
        pageActive:function(){
            console.log("audio active");
        },
        render     : function () {
            var style = {width: '40px', height: '40px'};
            var imgUrl = "images/audio-stop.png";
            if (this.state.isPlay) {
                imgUrl = "images/audio.png"
            }
            return (<div className="audioWrapper" onClick={this.toggleAudio}><img src={imgUrl} style={style}/>
                <audio src="http://ac-hf3jpeco.clouddn.com/bed3dbebf579cc7e95ac.mp3" preload="none"
                       play-status="play-current" ref="player"></audio>
            </div>)
        }
    });
    return MeAudio;
});
