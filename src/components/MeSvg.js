/** 文件名称: MeSvg
 *
 * 创 建 人: fishYu
 * 创建日期: 2015/5/25 15:06
 * 描    述: SVG组件  --- 对应 item_type 39
 */
define("MeSvg", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeSvg = React.createClass({
        displayName: "MeSvg",
        getDefaultProps:function(){
            //todo itemVal itemValSub需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', border: 'none', boxSizing: 'border-box'}
            }
        },
        getInitialState : function(){
            this.myRef = "myMeSvg";
            return {};
        },
        mixins:[MeComponentMixin],
        /**
         * 显示当前页的时候
         */
        pageActive:function(){
            this.addSvgAnimate();
            console.log("get page active svg");
        },
        /**
         * 移除当前页的时候
         */
        pageDeactive:function(){
            this.removeSvgAnimate();
            console.log("get page deactive svg");
        },
        /**
         * 添加SVG动画
         */
        addSvgAnimate : function (){
            var path = this.state.path;
            var length = this.state.length;
            var dashName = this.state.dashName;
            var duration = this.state.duration;
            var delay = this.state.delay;
            var infinite = this.state.infinite;
            path.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
            path.style.strokeDasharray =  length;   //动画的总长度
            path.style.strokeDashoffset =  length;     //从多少长度开始动画
            path.style.WebkitAnimationName = dashName;
            path.style.WebkitAnimationDuration = duration + "s";
            path.style.WebkitAnimationTimingFunction = "linear";
            path.style.WebkitAnimationDelay = delay + "s";
            path.style.WebkitAnimationIterationCount= infinite;
            path.style.WebkitAnimationFillMode= "forwards";
            path.style.animationName = dashName;
            path.style.animationDuration = duration + "s";
            path.style.animationTimingFunction = "linear";
            path.style.animationDelay = delay + "s";
            path.style.animationIterationCount= infinite;
            path.style.animationFillMode= "forwards";
        },
        /**
         * 删除SVG的动画
         */
        removeSvgAnimate : function () {
            var path = this.state.path;
            path.style.animation = "none";
            path.style.WebkitAnimation = "none";
        },
        /**
         * 创建SVG动画
         */
        createSvgAnimate : function(){
            var el = this.refs.myMeSvg;
            var mySVG = el.querySelector("svg");
            mySVG.style.height = "100%";
            mySVG.style.width = "100%";
            var data = this.props.data;
            var delay = 0;
            if(data.delay){
                delay = data.delay
            }
            var duration = 1;
            if(data.duration){
                duration = data.duration;
            }
            var infinite = "1";
            if(data.infinite){
                infinite = data.infinite;
            }
            var a1 = 0;
            if(data.a1){
                a1 = parseInt(data.a1);
            }
            var a2 = 0;
            if(data.a2){
                a2 = parseInt(data.a2);
            }
            var b1 = 0;
            if(data.b1){
                b1 = parseInt(data.b1);
            }
            var b2 = 0;
            if(data.b2){
                b2 = parseInt(data.b2);
            }
            //获取SVG的路径
            //TODO 目前只支持路径的绘制动画
            var path = el.querySelector('path');
            if(!path){
                return;
            }
            var length = path.getTotalLength();
            var p0 = a1 / 100 * length;
            var p1 = a2/ 100 * length;
            var p2 = b1 / 100 * length;
            var p3 = b2 / 100 * length;

            //代码里面自定义，动态帧动画
            var cssArr = [];
            var dashName = "dash"+this.getIncId();
            cssArr.push("@-webkit-keyframes "+dashName+" { " +
                "to {"+
                "stroke-dashoffset: -" +p2+ ";"+
                "stroke-dasharray: "+(p3-p2) +" , " +length+";"+
                "}"+
                "}"+
                "@keyframes "+dashName+" { " +
                "to {"+
                "stroke-dashoffset: -" +p2+ ";"+
                "stroke-dasharray: "+(p3-p2) +" , " +length+";"+
                "}"+
                "}");
            var styleNode = document.createElement("style");
            styleNode.type = "text/css";
            styleNode.id = "svg-animation-keyframes" +this.getIncId();
            styleNode.innerHTML = cssArr.join("");
            document.head.appendChild(styleNode);
            var newState = {};
            newState.path = path;
            newState.length = length;
            newState.duration = duration;
            newState.delay = delay;
            newState.infinite = infinite;
            newState.dashName = dashName;
            console.log(newState);
            this.setState(newState);
        },
        componentWillMount: function () {

        },
        render: function () {
            return (<div style={_assign(this.props.commonStyle,this.props.normalStyle)} ref={this.myRef} dangerouslySetInnerHTML={{__html:this.props.data.content}}></div>)
        },
        componentDidMount: function () {
            this.createSvgAnimate();
        }
    });
    return MeSvg;
});
