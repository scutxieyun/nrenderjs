define("MeMusic", function () {
    /**
     note:
     这个控件仅仅提供背景音乐
     */

    var React = require("react");
    var ReactDOM = require("react-dom");
    var MeMediaMixin = require("../src/MeMediaMixin.js")
    var MeMusic = React.createClass({
        displayName: "MeMusic",
        mixins: [MeMediaMixin],
        getDefaultProps: function () {
            return {
                autoplay: true
            }
        },
        getInitialState: function () {
            this.myRef = "myMeMusic";
            return {};
        },
        componentDidMount: function () {
            if (this.props.autoplay) this.play();
        },
        componentWillUnmount: function () {
            this.refs.mediaPlay.pause();
        },
        render: function () {
            var res = null;
            if(this.props.src){
                var spinClass = this.state.isPlay ? "spin" : "";
                var noteClass = this.state.isPlay ? "note" : "";
                var spanTxt = this.state.isPlay ? "开启音乐" : "关闭音乐";
                res = (
                    <div className="magazine-music-wrapper" style={{display: "block"}} ref={this.myRef}>
                        <span >{spanTxt}</span>
                        <audio src={this.props.src} preload="none" loop="loop" autoplay ref="mediaPlay" ></audio>
                        <div className={"fly-note1 " + noteClass}></div>
                        <div className={"fly-note2 " + noteClass}></div>
                        <menu onClick={this.togglePlay} id={this.props.id} className={spinClass + " magazine-music"}></menu>
                    </div>
                    );
            }
            return res;
        }
    });
    return MeMusic;
});


