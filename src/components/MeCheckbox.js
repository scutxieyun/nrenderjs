/** 文件名称: MeCheckbox
 *
 * 创 建 人: fishYu
 * 创建日期: 2015/5/30 16:18
 * 描    述: 多选组件  --- 对应 item_type 21
 */
define("MeCheckbox", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeCheckbox = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', backgroundColor:"transparent"}
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
         * 创建多选组件
         * @returns {string}
         */
        createCheckbox : function(){
            var data = this.props.data;
            var temp = "";
            //属性
            var title = data.title;
            var objectId = data.objectId;
            var options = data.options;
            var backgroundColor = this.props.normalStyle.backgroundColor;
            var border = this.props.normalStyle.borderBottom;
            var color = this.props.normalStyle.color;
            var fontSize = this.props.normalStyle.fontSize;
            //创建标题
            temp += '<div style="width:100%;height:100px;line-height:100px;padding-left:10px;box-sizing:border-box;color:'+color+';font-size:'+fontSize+';background-color:#000;">';
            temp += title+"（可多选）";
            temp += "</div>";
            //创建单选项
            var len =  options.length;
            var checkboxName = "checkbox" + this.getIncId();
            for(var i = 0; i <len; i++){
                var optionTemp = "";
                var optionBorder = "";
                if(border && i !=(len-1) ){
                    optionBorder = border;
                }
                optionTemp += '<div style="width:100%;height:87px;color:#000;line-height:87px;padding-left:10px;box-sizing:border-box;vertical-align:middle;font-size:'+
                    fontSize+';border-bottom:'+optionBorder+';">';
                //单选按钮
                var checkboxId = "checkbox" + this.getIncId();
                optionTemp += '<input data-type="common-check-radio" type="checkbox" name='+checkboxName+' id='+checkboxId+' value='+options[i]+' data-checkbox="user-checkbox" data-objectId='+objectId+' style="display:none;" />';
                optionTemp += '<label for='+checkboxId+' data-type="common-label"  style="display:inline-block;width:80%;height:100%;" >'+options[i]+'</label>'
                optionTemp +="</div>"
                temp += optionTemp;
            }
            return temp;
        },
        componentWillMount: function () {

        },
        render: function () {
            console.log(this.props.normalStyle);
            return (<div style={_assign(this.props.normalStyle,this.props.commonStyle)} ref="myMeCheckbox" dangerouslySetInnerHTML={{__html:this.createCheckbox()}}></div>);
        },
        componentDidMount: function () {

        }
    });
    return MeCheckbox;
});
