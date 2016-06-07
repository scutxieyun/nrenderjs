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
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', border:"none",backgroundPosition :"center",backgroundRepeat:"no-repeat", backgroundSize:"100%"}
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
            this.togglePlay();
        },
        render: function () {
            return (<div onClick={this.clickHandle} style={_assign(this.props.normalStyle,this.props.commonStyle)}><video width={this.props.data.width} height={this.props.data.height} id={"vjs_video_1"} preload={"auto"} controls={"controls"}
            ref="mediaPlay" x-webkit-airplay={true} webkit-playsinline={true} style={{"position":"absolute","zIndex":1}} poster={this.props.data.poster}>
                <source type={"video/mp4"} src={this.props.data.src} ></source></video>
            </div>);
        }
    });
    return MeInnerVideo;
});
