/** 文件名称: MeVideo
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/3 17:08
 * 描    述: 视频组件  --- 对应 item_type 8
 */
define("MeVideo", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeMediaMixin = require("../src/MeMediaMixin.js");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeVideo = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', border:"none",backgroundPosition :"center",backgroundRepeat:"no-repeat", backgroundSize:"100%"}
            }
        },
        getInitialState : function(){
            return {};
        },
        mixins:[MeComponentMixin, MeMediaMixin, MeCommandMixin],
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
         * 根据不同的src创建不同的内容
         * @returns {string}
         */
        createVideo : function(){
            var src = this.props.data.src;
            var poster = this.props.normalStyle.backgroundImage;
            var width = this.props.normalStyle.width;
            var height = this.props.normalStyle.height;
            var temp = "";
            //iframe形式的时候创建的模版
            if(src.indexOf("iframe") > -1){
                var icon = "data:image/png;base64,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";
                temp += '<div style="width:88px;height:88px;position:absolute;z-index:2;margin:0 auto;top:calc(50% - 44px);' +
                    'left:calc(50% - 44px);top:-webkit-calc(50% - 44px);left:-webkit-calc(50% - 44px);background:url('+icon+');background-size:cover;">';
                temp += '</div>';
                temp += '<div style="width:100px;height:100px;position:absolute;z-index:1;margin:0 auto;top:calc(50% - 50px);' +
                    'left:calc(50% - 50px);top:-webkit-calc(50% - 50px);left:-webkit-calc(50% - 50px);background:rgba(31, 29, 27, 0.4);' +
                    'border-radius:100%;-webkit-animation-name:player-button;-webkit-animation-duration:2.6s;-webkit-animation-iteration-count:infinite;-webkit-animation-timing-function:linear;">';
                temp += '</div>';
            }else{  //创建嵌入的视频

            }
            return temp;

        },
        clickHandle : function(ev){
            var isIFrame = this.props.data.isIFrame;
            var src = this.props.data.src;
            //iframe的时候点击，外部打开iframe视频
            if(isIFrame){
                //停止其他的音视频
                this.play();
                var height = this.props.data.iframeHeight;
                var action = "openWithIFrame(" + src+","+height+")";
                this.handleCmd(action);
            }
        },
        componentWillMount: function () {

        },
        render: function () {
            var poster = this.props.data.poster;
            var width = this.props.normalStyle.width;
            var height = this.props.normalStyle.height;
            if(poster){
                //modify by fishYu 2016-4-22 18:44 修改让视频的背景图片适配视频的区域
                poster = poster.split("?")[0]+"?imageView2/1/w/"+parseInt(width)+"/h/" +parseInt(height);
                this.props.data.poster = poster;
                this.props.normalStyle.backgroundImage = poster;
            }
            return (<div  onClick={this.clickHandle} style={_assign(this.props.normalStyle,this.props.commonStyle)} dangerouslySetInnerHTML={{__html:this.createVideo()}}></div>)
        },
        componentDidMount: function () {

        }
    });
    return MeVideo;
});
