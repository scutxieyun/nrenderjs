/**
 * Created by lifeng on 2016/5/25.
 */
define("MeAudio", function () {
    var React = require("react");
    var MeMediaMixin = require("../src/MeMediaMixin.js");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeAudio = React.createClass({
        getInitialState:function(){
            return {isPlay: false}
        },
        mixins     : [MeComponentMixin,MeMediaMixin,MeCommandMixin],
        pause:function(){
            this.refs.player.pause();
            this.setState({isPlay: false})
            console.log("audio pause:",this.props.id);
        },
        play:function(){
            this.refs.player.play();
            this.setState({isPlay: true})
            console.log("audio play");
        },

        render: function () {
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
