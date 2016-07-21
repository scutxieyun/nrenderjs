/** 文件名称: MeEndPage
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/7/6 10:36
 * 描    述: 全局的尾页模版
 */
define("MeEndPage", function () {
    var React = require("react");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeEndPage = React.createClass({
        getDefaultProps:function(){
            return {
                commonStyle : {}
            }
        },
        mixins:[MeComponentMixin],
        getInitialState : function(){
            this.myRef = "myMeEndPage";
            this.device = this.judgePlatform();
            return {};
        },
        componentWillMount: function () {

        },
        /**
         * 点击头像，跳转到他人个人控件
         * @param e
         */
        clickHeaderHandle : function(e){
            e.preventDefault();
            e.stopPropagation();
            //用于判断，是否派发全局的点击事件
            window.IsMeElementTap = true;
            if(this.props.data && this.props.data.author){
                location.href = "http://www.agoodme.com/views/share/index.html?id=" + this.props.data.author;
            }
        },
        /**
         * 点击关注
         * @param e
         */
        clickAttentionHandle : function(e){
            e.preventDefault();
            e.stopPropagation();
            //用于判断，是否派发全局的点击事件
            window.IsMeElementTap = true;
            if(this.props.data && this.props.data.author){
                location.href = "http://me.agoodme.com/index.html?userId=" + this.props.data.author;
            }
        },
        /**
         * 点击下载
         * @param e
         */
        clickDownloadHandle : function(e){
            e.preventDefault();
            e.stopPropagation();
            //用于判断，是否派发全局的点击事件
            window.IsMeElementTap = true;
            var _url = "";
            if (this.device == "android") {	//android设备
                _url = "http://a.app.qq.com/o/simple.jsp?pkgname=com.gli.cn.me";
            } else if (this.device == "ipad" || this.device == "iphone") {	//ios设备
                _url = "https://itunes.apple.com/cn/app/mobigage-ndi/id917062901";
                //在微信里面打开的情况
                if (this.isWeiXinPlatform()) {
                    _url = "http://a.app.qq.com/o/simple.jsp?pkgname=com.gli.cn.me";
                }
            }
            location.href = _url;
        },
        render: function () {
            //为了增加兼容PC和phone端。
            var clickDown, header, guanZhu;
            if(this.isPC()){
                clickDown = <div id="end-node-btn" onMouseDown={this.clickDownloadHandle}></div>;
                guanZhu = <div id="end-node-guanzhu" onMouseDown="end-node-guanzhu" onMouseDown={this.clickAttentionHandle} ></div>;
                header =   <img id="end-node-face" src={this.props.data.src} onMouseDown={this.clickHeaderHandle} />;
            }else{
                clickDown = <div id="end-node-btn" onTouchStart={this.clickDownloadHandle}></div>;
                guanZhu = <div id="end-node-guanzhu" className="end-node-guanzhu" onTouchStart={this.clickAttentionHandle} ></div>;
                header = <img id="end-node-face" src={this.props.data.src} onTouchStart={this.clickHeaderHandle} />;
            }
            var res = null;
            res = (<div ref={this.myRef}  id="end-node-wrapper">
                <div className="end-node-face">
                    {header}
                </div>
                <div id="end-node-nick" className="end-node-nick">{this.props.data.name}</div>
                    {guanZhu}
                <div className="end-node-btn end-node-btn-background" >
                    {clickDown}
                </div>
            </div>);
            return res;
        },
        componentDidMount: function () {

        },
        /**
         * 判断浏览器平台
         * @returns {string}
         */
        judgePlatform : function () {
            var platform = "pc";
            //来源判断
            if (navigator.userAgent.match(/Android/i)) {
                platform = "android";
            } else if (navigator.userAgent.match(/iPhone/i)) {
                platform = "iphone";
            } else if (navigator.userAgent.match(/iPad/i)) {
                platform = "ipad";
            } else if (navigator.userAgent.match(/Windows Phone/i)) {
                platform = "wphone";
            } else {
                platform = "pc";
            }
            return platform;
        },
        /**
         * 判断是否在微信内部
         * @returns {boolean}
         */
        isWeiXinPlatform : function () {
            var userAgent = navigator.userAgent.toLowerCase();
            var res = false;
            //来源判断
            if (userAgent.indexOf("micromessenger") > -1) {
                res = true;
            }
            return res;
        }
    });
    return MeEndPage;
});
