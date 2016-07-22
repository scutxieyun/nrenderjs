/** 文件名称: MeVideoAnimation
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/7 17:09
 * 描    述: iframe视频动画组件
 */
define("MeIFrameVideo", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeMediaMixin = require("../src/MeMediaMixin.js");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeIFrameVideo = React.createClass({
        getDefaultProps:function(){
            return {
                animationStyle : {"width":"100px","height":"100px","position":"absolute","zIndex":1,"margin":"0 auto","top":"calc(50% - 50px)",
                    "left":"calc(50% - 50px)","top":"-webkit-calc(50% - 50px)","left":"-webkit-calc(50% - 50px)","background":"rgba(31, 29, 27, 0.4)",
                    "borderRadius":"100%","WebkitAnimationName":"player-button","WebkitAnimationDuration":"2.6s",
                    "WebkitAnimationIterationCount":"infinite","WebkitAnimationTimingFunction":"linear"},
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', border:"none",backgroundPosition :"center",backgroundRepeat:"no-repeat", backgroundSize:"100%"}
            }
        },
        /**
         * 显示当前页的时候
         */
        pageActive:function(){
            console.log("active checkbox");
        },
        mixins:[MeComponentMixin, MeMediaMixin, MeCommandMixin],
        /**
         * 移除当前页的时候
         */
        pageDeactive:function(){
            this.pause();
        },
        getInitialState : function(){
            this.myRef = "myMeIFrameVideo";
            return {};
        },
        /**
         * 视频点击事件，区分iframe或者嵌入视频
         * @param ev
         */
        clickHandle : function(ev){
            var src = this.props.data.src;
            //iframe的时候点击，外部打开iframe视频
            //停止其他的音视频
            this.play();
            var height = this.props.data.iframeHeight;
            var action = "openWithIFrame(" + src+","+height+")";
            this._handleCmd(action);
        },
        render: function () {
            var self = this;
            var poster = this.props.data.poster;
            if(poster){
                this.props.normalStyle.backgroundImage = "url("+poster+")";
            }
            return (<div onClick={this.clickHandle} ref={this.myRef} style={_assign(this.props.normalStyle,this.props.commonStyle)}><div className={"video-player-btn"} ></div> <div style={this.props.animationStyle}></div></div>);
        }
    });
    return MeIFrameVideo;
});
