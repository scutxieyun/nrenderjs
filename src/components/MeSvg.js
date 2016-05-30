/**
 * Created by lifeng on 2016/5/25.
 */
define("MeSvg", function () {
    var React = require("react");
    var ReactDOM = require("react-dom");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeSvg = React.createClass({
        getDefaultProps:function(){
            //todo itemVal itemValSub需要动态配置
            return {
                normalStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', border: 'none', boxSizing: 'border-box'},
                itemVal : "<svg version=\"1.2\" baseProfile=\"tiny\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 320 480\" xml:space=\"preserve\" style=\"height: 100%; width: 100%;\">\n<path fill=\"none\" stroke=\"#FF0000\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-miterlimit=\"10\" d=\"M77-159v304.472\tc0,5.5,4.328,9.528,9.828,9.528H238.5c5.5,0,9.5,4.972,9.5,10.472v5.157c0,5.5-4,10.371-9.5,10.371H86.828\tc-5.5,0-9.828,4.129-9.828,9.629v4.151c0,5.5,4.328,10.22,9.828,10.22H238.5c5.5,0,9.5,4.28,9.5,9.78v5.157\tc0,5.5-4,10.062-9.5,10.062H87.826c-5.5,0-9.826,4.438-9.826,9.938v5.157c0,5.5,4.326,9.905,9.826,9.905H238.5\tc5.5,0,9.5,4.595,9.5,10.095v4.15c0,5.5-4,9.755-9.5,9.755H89.822c-5.5,0-9.822,4.745-9.822,10.245v5.157\tc0,5.5,4.322,9.598,9.822,9.598h147.68c5.5,0,10.498,4.902,10.498,10.402V574\" style=\"transform: matrix(1, 0, 0, 1, 0, 0); stroke-dashoffset: 1e-05px; stroke-dasharray: 1864.11px, 1874.11px;\"></path>",
                itemValSub : {"delay":0.5,"duration":3.5,"infinite":"1","a1":0,"a2":50,"b1":50,"b2":100}
            }
        },
        getInitialState : function(){
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
            console.log(this.state);
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
            var itemValSub = this.props.itemValSub;
            //转换成JSON对象
//            itemValSub = dms.toJSON(itemValSub);
            var delay = 0;
            if(itemValSub.delay){
                delay = itemValSub.delay
            }
            var duration = 1;
            if(itemValSub.duration){
                duration = itemValSub.duration;
            }
            var infinite = "1";
            if(itemValSub.infinite){
                infinite = itemValSub.infinite;
            }
            var a1 = 0;
            if(itemValSub.a1){
                a1 = parseInt(itemValSub.a1);
            }
            var a2 = 0;
            if(itemValSub.a2){
                a2 = parseInt(itemValSub.a2);
            }
            var b1 = 0;
            if(itemValSub.b1){
                b1 = parseInt(itemValSub.b1);
            }
            var b2 = 0;
            if(itemValSub.b2){
                b2 = parseInt(itemValSub.b2);
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
            newState.delay = delay;
            newState.duration = duration;
            newState.infinite = infinite;
            newState.dashName = dashName;
            var fullState = _assign(this.state,newState);
            this.setState(fullState);
        },
        componentWillMount: function () {

        },
        render: function () {
            return (<div style={_assign(this.props.dynamicStyle,this.props.normalStyle)} ref="myMeSvg" dangerouslySetInnerHTML={{__html:this.props.itemVal}}></div>)
        },
        componentDidMount: function () {
            this.createSvgAnimate();
        }
    });
    return MeSvg;
});
