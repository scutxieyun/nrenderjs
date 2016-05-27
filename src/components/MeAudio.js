/**
 * Created by lifeng on 2016/5/25.
 */
define("MeAudio", function () {
    var React = require("react");
    var MeMediaMixin = require("../src/MeMediaMixin.js");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeAudio = React.createClass({
        getInitialState(){
            return {isPlay: false}
        },
        mixins     : [MeMediaMixin,MeCommandMixin],
        pause(){
            this.refs.player.pause();
            console.log("audio pause");
        },
        play(){
            this.refs.player.play();
            console.log("audio play");
        },

        render     : function () {
            var style = {width: '40px', height: '40px'};
            style=Object.assign({},style,this.props.style)
            var imgUrl = "images/audio-stop.png";
            if (this.state.isPlay) {
                imgUrl = "images/audio.png"
            }
            return (<div className="audioWrapper" onClick={this.togglePlay}><img src={imgUrl} style={style}/>
                <audio src={this.props.src} preload="none"
                       play-status="play-current" ref="player"></audio>
            </div>)
        }
    });
    return MeAudio;
});
