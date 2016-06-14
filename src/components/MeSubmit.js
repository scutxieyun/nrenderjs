/** 文件名称: MeSubmit
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/13 14:25
 * 描    述: 提交组件  --- 对应 item_type 19
 */
define("MeSubmit", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeSubmit = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box'}
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
        clickHandle : function(ev){
            console.log("submit");
            //todo 获取当前页的所有表单数据，保存数据到数据库
        },
        render: function () {
            this.props.normalStyle.lineHeight = this.props.data.lineHeight;
            var content = "";
            if(this.props.data.cnType == 2){
                this.props.normalStyle.background = "url('"+this.props.data.content+"') no-repeat center";
            }else{
                content = this.props.data.content;
            }
            return (<div onClick={this.clickHandle} style={_assign(this.props.normalStyle,this.props.commonStyle)} ref="myMeSubmit">{content}</div>);
        },
        componentDidMount: function () {

        }
    });
    return MeSubmit;
});
