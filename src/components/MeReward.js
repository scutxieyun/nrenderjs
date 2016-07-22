/** 文件名称: MeReward
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/13 14:27
 * 描    述: 打赏组件  --- 对应 item_type 36
 */
define("MeReward", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeReward = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', border:"none"}
            }
        },
        getInitialState : function(){
            this.myRef = "myMeReward";
            return {};
        },
        mixins:[MeComponentMixin],
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
            console.log("deactive checkbox");
        },
        componentWillMount: function () {

        },
        clickHandle : function(ev){
            console.log("MeReward");
            var self = this;
            var target = self.props.data.target;
            if(!target) return;
            var testReward = {};
            testReward.tplId = self.props.data.tplId;
            testReward.pageId = self.props.data.pageId;
            testReward.userId = self.props.data.userId;
            testReward.userName = self.props.data.userName;
            testReward.userHeaderSrc = self.props.data.userHeaderSrc;
            testReward.userLeave = self.props.data.userLeave;
            //添加正式还是测试服
            testReward.fmawr = window.fmawr || "0";
            //TODO 存储本地localstorage
            window.localStorage.tpl_award_info = JSON.stringify(testReward);
            window.location.href = target;
        },
        render: function () {
            var res = null;
            //在非微信里面不显示
            var userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.indexOf("micromessenger") > 0) { //微信里面
                var content = this.props.data.content || "";
                this.props.normalStyle.lineHeight = this.props.data.lineHeight;
                res = (<div onClick={this.clickHandle} style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef}>{content}</div>);
            }
            return res;
        },
        componentDidMount: function () {

        }
    });
    return MeReward;
});
