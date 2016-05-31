/** 文件名称: MeLabel
 *
 * 创 建 人: fishYu
 * 创建日期: 2015/5/30 16:18
 * 描    述: 标签组件  --- 对应 item_type 38
 */
define("MeLabel", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeLabel = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', border:"none"}
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
        /**
         * 创建标签
         * @returns {string}
         */
        createLabel : function(){
            var data = this.props.data;
            var temp = "";
            //属性
            return temp;
        },
        componentWillMount: function () {

        },
        render: function () {
            return (<div style={_assign(this.props.normalStyle,this.props.commonStyle)} ref="myMeLabel" dangerouslySetInnerHTML={{__html:this.createLabel()}}></div>);
        },
        componentDidMount: function () {

        }
    });
    return MeLabel;
});
