/** 文件名称: MeLongPress
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/13 19:01
 * 描    述: 电话组件  --- 对应 item_type 25
 */
define("MeLongPress", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeLongPress = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative',boxSizing: 'border-box', userSelect:"none", WebkitUserSelect:"none"}
            }
        },
        getInitialState : function(){
            this.myRef = "myMeLongPress";
            this.timeOutEvent = 0;//定时器
            return {};
        },
        mixins:[MeComponentMixin],
        /**
         * 显示当前页的时候
         */
        pageActive:function(){
            console.log("active MeLongPress");
        },
        /**
         * 移除当前页的时候
         */
        pageDeactive:function(){
            console.log("deactive MeLongPress");
        },
        componentWillMount: function () {

        },
        initEvent : function(){
            var self = this;
            var hastouch = self.isPC() ? false : true;
            var tapstart = hastouch ? "touchstart" : "mousedown",
                tapmove = hastouch ? "touchmove" : "mousemove",
                tapend = hastouch ? "touchend" : "mouseup";
            var longPress = self.refs.myMeLongPress;
            longPress.addEventListener(tapstart, function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.goTouchStart();
                return false;
            });

            longPress.addEventListener(tapmove, function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.goTouchMove();
                return false;
            });

            longPress.addEventListener(tapend, function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.goTouchEnd();
                return false;
            });
        },
        goTouchStart : function(){
            var self = this;
            //这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
            this.timeOutEvent = window.setTimeout(function(){
                self.longPress();
            },500);
            return false;
        },
        goTouchEnd : function(){
            window.clearTimeout(this.timeOutEvent);//清除定时器
            if(this.timeOutEvent!=0){
//        alert("你这是点击，不是长按");
            }
            return false;
        },
        goTouchMove : function(){
            window.clearTimeout(this.timeOutEvent);//清除定时器
            this.timeOutEvent = 0;
            return false;
        },
        longPress : function(){
            this.timeOutEvent = 0;
            //TODO 事件
            alert("1111111");
            if((!!self.props.triggerActions) && (!!self.props.triggerActions.tap))
                self.callActionMethod(self.props.triggerActions.tap);
        },
        render: function () {
            var width = this.props.normalStyle.width;
            var color = this.props.normalStyle.color;
            width = parseInt(width);
            var height = this.props.normalStyle.height;
            height = parseInt(height);
            var cornerWidth = width / 6 + "px";
            var cornerHeight = height / 6 + "px";
            var popupWidth = (width - 30) + "px";
            var commonBorder = this.props.data.borderWidth + "px solid " + color;
            var bdRaidus = this.props.normalStyle.borderRaidus;
            var rgbaColor = color.substring(3, color.lastIndexOf(")"));
            this.props.normalStyle.fontFamily = "";
            return (<div style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef} data-type={"me-fingerprint"} className={"noDownLoad"}>
                <div style={{position:"absolute",zIndex:"1",width:cornerWidth,height:cornerHeight,left:0,top:0,borderTopLeftRadius:bdRaidus,border:0,borderTop:commonBorder,borderLeft:commonBorder}}></div>
                <div style={{position:"absolute",zIndex:"1",width:cornerWidth,height:cornerHeight,right:0,top:0,borderTopRightRadius:bdRaidus,border:0,borderTop:commonBorder,borderRight:commonBorder}}></div>
                <div style={{position:"absolute",zIndex:"1",width:cornerWidth,height:cornerHeight,left:0,bottom:0,borderBottomLeftRadius:bdRaidus,border:0,borderBottom:commonBorder,borderLeft:commonBorder}}></div>
                <div style={{position:"absolute",zIndex:"1",width:cornerWidth,height:cornerHeight,right:0,bottom:0,borderBottomRightRadius:bdRaidus,border:0,borderBottom:commonBorder,borderRight:commonBorder}}></div>
                <div style={{position:"absolute",zIndex:"2",width:popupWidth,height:"1px",top:"97%",left:"15px",boxShadow:"0px 2px 4px "+ ("rgba" + rgbaColor+", .35)"),
                    WebKitBoxShadow:"0px 2px 4px "+ ("rgba" + rgbaColor+", .35)"),background:"-webkit-linear-gradient(left, "+("rgba" + rgbaColor+", 0)")+", "+color+" 50%, "+("rgba" + rgbaColor+", 0)")+")"}} className={"noDownLoad fingerprint-move"}></div>
            </div>);
        },
        componentDidMount: function () {
            this.initEvent();
        }
    });
    return MeLongPress;
});
