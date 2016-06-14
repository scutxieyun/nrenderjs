/** 文件名称: MeRedEnvelopes
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/13 14:27
 * 描    述: 红包组件  --- 对应 item_type 41
 */
define("MeRedEnvelopes", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeRedEnvelopes = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', overFlow:"hidden"}
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
            console.log("MeRedEnvelopes");
            var self = this;
            var target = self.props.data.target;
            if(!target) return;
            if(window.app && window.app.VERSION){
                return;
            }else {
                var testRedEnvelopes = {};
                testRedEnvelopes.tplId = self.props.data.tplId;
                testRedEnvelopes.pageId = self.props.data.pageId;
                testRedEnvelopes.userId = self.props.data.userId;
                testRedEnvelopes.userName = self.props.data.userName;
                testRedEnvelopes.userHeaderSrc = self.props.data.userHeaderSrc;
                testRedEnvelopes.envelopesId = self.props.data.envelopesId;
                //添加正式还是测试服
                testRedEnvelopes.fmawr = window.fmawr || "0";
                //TODO 存储本地localstorage
                window.localStorage.tpl_red_envelopes_info = JSON.stringify(testRedEnvelopes);
                //在app外部的时候
                window.location.href = target;
            }
        },
        render: function () {
            var content = this.props.data.content || "";
            return (<div onClick={this.clickHandle} style={_assign(this.props.normalStyle,this.props.commonStyle)} ref="myMeRedEnvelopes">
                <img src={content} style={{width:"100%", height:"100%"}}/>
            </div>);
        },
        componentDidMount: function () {

        }
    });
    return MeRedEnvelopes;
});
