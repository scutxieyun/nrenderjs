/** 文件名称: MePhone
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/13 14:27
 * 描    述: 电话组件  --- 对应 item_type 12
 */
define("MePhone", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeInput = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative',display:"inline-block", boxSizing: 'border-box', outline:"none", backgroundPosition:"center", backgroundRepeat:"no-repeat", overFlow:"hidden"}
            }
        },
        getInitialState : function(){
            this.myRef = "myMePhone";
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
            var content = this.props.data.content || "";
            var dataType = "";
            this.props.normalStyle.lineHeight = this.props.data.lineHeight;
            //兼容用户自定义一键拨号的图片
            var extAttr = this.props.data.extAttr;
            if(!extAttr){
                this.props.normalStyle.textDecoration = "none";
                dataType = "me-dialing";
                if(!content){
                    dataType = "me-dialing-cancel-content";
                }
                this.props.normalStyle.textIndent = "-5px";
            }else{
                this.props.normalStyle.backgroundImage = "url('"+extAttr+"')";
            }
            return (<a style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef} data-type={dataType} href={this.props.data.tel}>{content}</a>);
        },
        componentDidMount: function () {

        }
    });
    return MeInput;
});
