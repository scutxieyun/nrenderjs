/** 文件名称: MeInput
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/13 14:25
 * 描    述: 输入组件  --- 对应 item_type 14
 */
define("MeInput", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeInput = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', paddingLeft:"10px", outline:"none", resize:"none", verticalAlign:"middle"}
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
        render: function () {
            this.props.normalStyle.backgroundColor = this.props.normalStyle.backgroundColor || "transparent";
            this.props.normalStyle.lineHeight = this.props.normalStyle.height;
            return (<input style={_assign(this.props.normalStyle,this.props.commonStyle)}
                dtat-input={"user-input"} data-objectId={this.props.data.objectId} placeholder={this.props.data.placeholder} />);
        },
        componentDidMount: function () {

        }
    });
    return MeInput;
});
