/** 文件名称: MeDirectory
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/29 17:26
 * 描    述: 全局的目录组件
 */
define("MeDirectory", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeDirectory = React.createClass({
        getDefaultProps:function(){
            return {
                commonStyle : {position:"absolute",zIndex:4,width:"100%",height:"100%",top:"0px",left:"0px",paddingTop:"78px",overflow:"hidden"}
            }
        },
        getInitialState : function(){
            this.myRef = "myMeDirectory";
            this.signleActiveClass = "";                                //单列选中样式 1-- 白色 2---黑色
            this.doubleActiveClass = "item-double-view-port-img";    //双列选中样式3-- 白色 4---黑色
            this.meScrollHeight = 0;                                    //UL默认到顶部的距离
            return {
                isShow : false,     //动态配置是否显示全局目录组件
                currentX : 0        //当前组
            };
        },
        mixins:[MeComponentMixin,MeCommandMixin],
        componentWillMount: function () {

        },
        closeClickHandle : function(ev){
            this.setState({isShow: false});
        },
        itemClickHandle : function(ev){
            var self =this;
            var target = ev.target;
            var pageTo = target.getAttribute("page-to");
            var meDiff = target.getAttribute("signle-diff");
            if(!meDiff || meDiff == 0){
                if(pageTo){
                    var pageTo = parseInt(pageTo);
                    //TODO 执行跳页
                    var action = "pageTo(" + pageTo+",0)";
                    self._handleCmd(action);
                    self.setState({isShow: false,currentX: pageTo });
                }
            }
        },
        showDirectoryHandler : function(data){
            this.setState(data);
            this.resetStatus();
        },
        hideDirectoryHandler : function(data){
            this.setState(data);
        },
        createDirectoryItem : function(liHeight, commonTitleColor, commonBorder){
            var self = this;
            var _directoryType = this.props.data.directoryType;
            var liWith = _directoryType <= 2 ? "100%" : "50%";
            var liPadding = _directoryType <= 2 ? "16px 32px" : "";
            var liTextAlign = _directoryType <= 2 ? "" : "center";
            var liFloat = _directoryType <= 2 ? "" : "left";
            var divVerticalAlign = _directoryType <= 2 ? "middle" : "";
            //需要替换的mePageTo --  跳到的组序号、 meLiActiveClass ---- 当前选中的样式,   meBorderBottom ---  单列的样式 commonBorder,  meDirectoryItemSrc --- 图片地址， meDirectoryItemName -- 目录名称
            var spanWidth = _directoryType <= 2 ? "calc(100% - 170px)" : "100%";
            var spanHeight = _directoryType <= 2 ? "" : "64px";
            var spanFontSize = _directoryType <= 2 ? "32px" : "28px";
            var spanTextOverFlow = _directoryType <= 2 ? "ellipsis" : "";
            var spanOverflow = _directoryType <= 2 ? "hidden" : "";
            var spanWhiteSpace = _directoryType <= 2 ? "nowrap" : "pre-wrap";
            var spanLineHeight = _directoryType <= 2 ? "" : "36px";
            var spanPaddingLeft = _directoryType <= 2 ? "32px" : "";
            var spanMarginTop = _directoryType <= 2 ? "" : "16px";
            var itemTemp = '<li  data-type="myMeDirectoryItem" class="meLiActiveClass" page-to="mePageTo" signle-diff="mediff" ' +
                ' style="position:relative;width:'+liWith+';height:'+liHeight+';padding:'+liPadding+';border-bottom:meBorderBottom;list-style-type:none;box-sizing: border-box;text-align:'+liTextAlign+';float:'+liFloat+';">' +
                '<div page-to="mePageTo"  class="meLiActiveClass1" style="width:170px;height:260px;overflow:hidden;display: inline-block;box-sizing: border-box;vertical-align: '+divVerticalAlign+';">' +
                '<img  page-to="mePageTo"  src="meDirectoryItemSrc" style="width: 170px; box-sizing: border-box;">' +
                '</div>' +
                '<span page-to="mePageTo" style="display:inline-block;box-sizing:border-box;width:'+spanWidth+';' +
                'font-size:'+spanFontSize+';padding-left:'+spanPaddingLeft+';margin-top:'+spanMarginTop+';line-height:'+spanLineHeight+
                ';height:'+spanHeight+';text-align:'+liTextAlign+';text-overflow:'+spanTextOverFlow+';' +
                'overflow:'+spanOverflow+';white-space:'+spanWhiteSpace+';color:'+commonTitleColor+';">' +
                'meDirectoryItemName' +
                '</span>' +
                '</li>';
            var imgData = this.props.data.imgData;
            var temp = "", obj;
            var len = imgData.length;
            for(var i = 0; i < len; i++){
                obj = imgData[i];
                var activeClass = "";
                var activeClass1 = "";
                var meBorder = "";
                var mediff = "";
                if(self.state.currentX == i){
                    if(_directoryType <= 2){
                        activeClass = self.signleActiveClass;
                        mediff = 0
                    }else{
                        activeClass1 = self.doubleActiveClass;
                        mediff = 1
                    }
                }
                if(_directoryType <= 2){
                    mediff = 0
                }else{
                    mediff = 1
                }
                //只是白色单列的时候才是所有的列都有顶部边框
                if (_directoryType == 1 && i != len) {
                    meBorder = commonBorder;
                }
                var item = itemTemp.replace(/mePageTo/g, i).replace("meDirectoryItemSrc", obj.img)
                    .replace("meDirectoryItemName", obj.name).replace("meLiActiveClass", activeClass)
                    .replace("meLiActiveClass1", activeClass1)
                    .replace("meBorderBottom", meBorder).replace("mediff", mediff);
                temp += item;
            }
            return temp;
        },
        render: function () {
            var res = null;
            if(this.state.isShow ) {
                var _directoryType = this.props.data.directoryType;
                var closeWhiteBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAA4klEQVRYw8XVvQ3CMBBA4StDE8+TMiVsAIOGLAAdzJIBEI8CR7IimfjvDne+FO+TY8kiIgL0QCf/WIAD7sDVEgEcASdAB8x8lwkCOAMvYFoHZoggvgBD+EEdEY1bIHbjmojkuAYiO94SURxvgaiO1yCaxUsQzeM5CLV4CkI9HkHMfm8TjyAepvEN4ukRb2A0i3vAeuyEv8M6vgDj9k5Yxgc/60wQwCV24YCDKuJXXB2REldD5MSbI0rizRA18WpEi3gxomU8G6ERT0ZoxncRwMnqSQ0QN8CtQwdMVu+5R/QiIh+LtJ5ZeEclewAAAABJRU5ErkJggg==";
                var closeBlackBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABfUlEQVRYw72XrU4EMRCAvz0MnARXiSHBjkGRAHpB8iAEBwhA3APwGBjgLIvFrMKToO4NMIQfcd3kUrptp7e9uv1Jvy/T6XSKiOyLyIOIjFnhEJEtgDVjzB1QA3vGmPvZbPa1AvgO8GqM2RgBp0ADHAGPpSNh4Q1ggPXKvhwDT8Ah8Awct237WRh+27btZbXwsaiEDw5QOT8VkeiD/xMoIRGCewWGlIjBewWGkEiBBwWWkUiFA4xCE1lYjaJOOPCbEDwaAScSU+AgFAkP/Co2d5JAikQOXCUQksiFqwV6JM7tsxqeJeCR+GGezGo4RHZB37Brfwb82jnegUnOXFkCds2nzCP4AWyTeZSrBdyEA3aBFzL7Ce0u8Ga7kxMNUKeWbU0dCG61XInUSpi0z3MkogLaIqOViJ2GWRVOIxHqB7LLq0airyNaCq6R8PWEg8BTJdyueFB4isTivaAIPCbR3YyKwkMSlYhsAm+l4R6Jb+Cke3khItclwa5Ed2j9ARiWJT1Bbz2WAAAAAElFTkSuQmCC";
                var commonCloseBg = _directoryType % 2 !=0 ? closeBlackBg : closeWhiteBg;
                var commonBgColor = _directoryType % 2 != 0 ? "rgb(238,238,238)" : "rgba(0,0,0, .5)";     //TODO 背景颜色需要透明度吗？
                var commonHintColor = _directoryType % 2 != 0 ? "rgb(1,1,1)" : "rgb(255,255,255)";
                var commonTitleColor = _directoryType % 2 != 0 ? "rgb(0,0,0)" : "rgb(255,254,254)";
                var commonBorder = _directoryType % 2 != 0 ? "1px dashed #D2D2D2" : "1px solid rgba(204,204,204, .3)";
                this.signleActiveClass = _directoryType % 2 != 0 ? "item-white-view-port-li" : "item-black-view-port-li";
                var ulPadding = this.props.data.directoryType > 2 ? "48px 6%" : "";
                var closeBg = "url("+commonCloseBg+") 50% 50% no-repeat";
                this.props.commonStyle.backgroundColor = commonBgColor;
                var liHeight = _directoryType <= 2 ? "292px" : "366px";
                this.meScrollHeight =  _directoryType <= 2 ? parseInt(liHeight)*this.state.currentX : parseInt(liHeight)*(this.state.currentX / 2);
                res = (<div ref={this.myRef}  style={this.props.commonStyle}>
                    <div style={{position:"absolute",zIndex:2,left:"0px",top:"0px",width:"100%",height:"78px",boxSizing:"border-box",borderBottom:commonBorder}}>
                        <div onClick={this.closeClickHandle} style={{position:"absolute",right:"32px",top:"19px",width:"40px",height:"40px",background:closeBg}}></div>
                        <div style={{position:"absolute",left:"32px",top:"0px",color:commonHintColor,fontSize:"32px",letterSpacing:"3.2px",height:"78px",lineHeight:"78px"}}>
                        目录</div>
                    </div>
                    <ul data-bar={"cancel-scroll-bar"} ref="meDirectoryUl" style={{width:"100%",height:"100%",boxSizing:"border-box",
                        overflowY:"auto",WebkitOverflowScrolling:"touch", padding:ulPadding}} dangerouslySetInnerHTML={{__html:this.createDirectoryItem(liHeight, commonTitleColor,commonBorder)}}></ul>
                </div>);
            }
            return res;
        },
        componentDidMount: function () {
            //监听自定义事件,显示或者隐藏
            this.props.cxt.ee.addListener("show:directory",this.showDirectoryHandler);
            this.props.cxt.ee.addListener("hide:directory",this.hideDirectoryHandler);
            if(this.state.isShow){
                this.resetStatus();
            }


        },
        resetStatus : function(){
            var directoryUl = this.refs.meDirectoryUl;
            $(directoryUl).scrollTop(this.meScrollHeight);
            var directoryWrapper = this.refs.myMeDirectory;
            directoryWrapper.className = "slideInFromBottom";
            $(directoryWrapper).on("webkitAnimationEnd",function(){
                directoryWrapper.className = "";
                $(directoryWrapper).off("webkitAnimationEnd");
            });
            var myMeDirectoryItem = directoryUl.querySelectorAll(("*[data-type='myMeDirectoryItem']"));
            for(var i = 0; i < myMeDirectoryItem.length; i++){
                var obj = myMeDirectoryItem[i];
                //先解绑，预防两次
                obj.removeEventListener("click", this.itemClickHandle, false);
                obj.addEventListener("click", this.itemClickHandle, false);
            }
        }
    });
    return MeDirectory;
});
