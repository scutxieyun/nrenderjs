/** 文件名称: MeVideoPlayer
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/7 17:19
 * 描    述: 视频播放器
 */
define("MeInnerVideo", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeMediaMixin = require("../src/MeMediaMixin.js");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeInnerVideo = React.createClass({
        mixins:[MeComponentMixin, MeMediaMixin, MeCommandMixin],
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', border:"none",backgroundPosition :"center",backgroundRepeat:"no-repeat", backgroundSize:"100%"},
                commonPopupStyle :{
                    "position":"absolute",
                    width:"100%",
                    height:"100%",
                    left:0,
                    top:0,
                    display:"none"
                }
            }
        },
        getInitialState : function(){
            return {};
        },
        /**
         * 显示当前页的时候
         */
        pageActive:function(){
            console.log("active checkbox");
        },
        /**
         * 移除当前页的时候
         */
        pageDeactive:function(){
            this.pause();
        },
        /**
         * 视频点击事件，区分iframe或者嵌入视频
         * @param ev
         */
        clickHandle : function(ev){
            var self = this;
            var _videoEndLayer = self.refs.mediaEnd;
            var _videoPauseLayer = self.refs.mediaPause;
            if (self.state.isPlay) {
                //显示暂停层
                _videoPauseLayer.style.display = "block";
                self.pause()
            }
            else {
                //隐藏暂停层和结束层
                _videoPauseLayer.style.display = "none";
                _videoEndLayer.style.display = "none";
                self.play();
            }
        },
        /**
         * 视频播放结束处理函数
         */
        videoEndHandle : function(){
            var self = this;
            var _video = self.refs.mediaPlay;
            var _videoEndLayer = self.refs.mediaEnd;
            _video.addEventListener("ended", function(e){
                //视频播放结束
                //TODO 视频播放结束的时候需要播放背景音乐,和执行脚本
                if((!!self.props.triggerActions) && (!!self.props.triggerActions.tap))
                    self.callActionMethod(self.props.triggerActions.tap);
                self.setState({
                    isPlay:false
                });
                _videoEndLayer.style.display = "block";
            })
        },
        render: function () {
            this.props.commonPopupStyle.background ="url("+this.props.data.poster+") no-repeat center rgba(0, 0, 0, 0.65098)";
            return (<div onClick={this.clickHandle} style={_assign(this.props.normalStyle,this.props.commonStyle)}>
                <video width={this.props.data.width} height={this.props.data.height} id={"vjs_video_1"} preload={"auto"} controls={"controls"}
                    ref="mediaPlay" x-webkit-airplay={"true"} webkit-playsinline={"true"} style={{"position":"absolute","zIndex":1}} poster={this.props.data.poster}>
                <source type={"video/mp4"} src={this.props.data.src} ></source></video>
                <div ref="mediaPause" style={_assign(this.props.commonPopupStyle,{zIndex:2})}><div className={"video-player-btn"}></div></div>
                <div ref="mediaEnd" style={_assign(this.props.commonPopupStyle,{zIndex:3})}><span className={"video-player-end"}>重新开始</span></div>
            </div>);
        },
        componentDidMount: function () {
            this.videoEndHandle();
        }
    });
    return MeInnerVideo;
});
