/** 文件名称: MeMessageBox
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/22 15:51
 * 描    述: 全局的消息提示框组件
 */
define("MeMessageBox", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeMessageBox = React.createClass({
        getDefaultProps:function(){
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative',display:"inline-block", boxSizing: 'border-box', outline:"none", backgroundPosition:"center", backgroundRepeat:"no-repeat", overFlow:"hidden"}
            }
        },
        getInitialState : function(){
            this.myRef = "myMeMessageBox";
            this.msgBtnContent = "确认";
            this.msgContent = "请填写表单";
            this.callBack = null;
            return {
                isShow : false     //动态配置是否显示全局消息组件
            };
        },
        mixins:[MeComponentMixin],
        componentWillMount: function () {

        },
        clickHandle : function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            //用于判断，是否派发全局的点击事件
            window.IsMeElementTap = true;
//            console.log(ev, "点击确认按钮");
            this.setState({isShow: false});
            if(this.callBack && this.callBack.constructor && this.callBack.call && this.callBack.apply){
                this.callBack();
            }
        },
        customEventHandle : function(data){
            if(data.callBack){
                this.callBack = data.callBack;
            }
            if(data.msg){
                this.msgContent = data.msg;
            }
            if(data.btn){
                this.msgBtnContent = data.btn;
            }
            this.setState({isShow: true});
        },
        render: function () {
            var res = null;
            var msgBtn = null;
            if(this.isPC()){
                msgBtn = <div onMouseDown={this.clickHandle} style={{position: "absolute", bottom: "0px", fontSize: "28px", textAlign: "center", color: "rgb(0, 91, 255)",
                    width: "100%", height: "75px", lineHeight: "75px", borderStyle: "solid none none", borderTopWidth: "1px", borderTopColor: "rgb(211, 211, 215)",
                    outline: "0px", WebkitUserSelect: "none", boxSizing: "border-box", borderBottomRightRadius: "12px", borderBottomLeftRadius: "12px",
                    letterSpacing: "2em", paddingLeft: "55px", background: "transparent"}}>{this.msgBtnContent}</div>;
            }else{
                msgBtn = <div onTouchStart={this.clickHandle} style={{position: "absolute", bottom: "0px", fontSize: "28px", textAlign: "center", color: "rgb(0, 91, 255)",
                    width: "100%", height: "75px", lineHeight: "75px", borderStyle: "solid none none", borderTopWidth: "1px", borderTopColor: "rgb(211, 211, 215)",
                    outline: "0px", WebkitUserSelect: "none", boxSizing: "border-box", borderBottomRightRadius: "12px", borderBottomLeftRadius: "12px",
                    letterSpacing: "2em", paddingLeft: "55px", background: "transparent"}}>{this.msgBtnContent}</div>;
            }
            if(this.state.isShow) {
                res = (<div style={{position: "absolute", zIndex: "3", left: "0px", top: "0px", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.4)"}}>
                    <div style={{position: "relative", width: "460px", height: "246px", margin: "0px auto", top: "38%", borderRadius: "12px", background: "rgb(255, 255, 255)"}}>
                        <div style={{fontSize: "32px", textAlign: "center", color: "rgb(0, 0, 0)", width: "100%", height: "171px",
                            lineHeight: "171px", position: "absolute", top: "0px"}}>{this.msgContent}</div>
                        {msgBtn}
                    </div>
                </div>);
            }
            return res;
        },
        componentDidMount: function () {
            //TODO 监听自定义事件
            this.props.cxt.ee.addListener("show:message:box",this.customEventHandle);
        }
    });
    return MeMessageBox;
});
