/** 文件名称: MeRadio
 *
 * 创 建 人: fishYu
 * 创建日期: 2015/5/27 15:06
 * 描    述: 单选组件  --- 对应 item_type 20
 */
define("MeRadio", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeRadio = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', backgroundColor:"transparent"}
            }
        },
        getInitialState : function(){
            this.myRef = "myMeRadio";
            return {};
        },
        mixins:[MeComponentMixin],
        /**
         * 显示当前页的时候
         */
        pageActive:function(){
            console.log("active radio");
        },
        /**
         * 移除当前页的时候
         */
        pageDeactive:function(){
            console.log("deactive radio");
        },
        /**
         * 创建单选组件
         * @returns {string}
         */
        createRadio : function(){
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
            temp += title;
            temp += "</div>";
            //创建单选项
            var len =  options.length;
            var radioName = "radio" + this.getIncId();
            for(var i = 0; i <len; i++){
                var optionTemp = "";
                var optionBorder = "";
                if(border && i !=(len-1) ){
                    optionBorder = border;
                }
                optionTemp += '<div style="width:100%;height:87px;color:#000;line-height:87px;padding-left:10px;box-sizing:border-box;vertical-align:middle;font-size:'+
                    fontSize+';border-bottom:'+optionBorder+';">';
                //单选按钮
                var radioId = "radio" + this.getIncId();
                optionTemp += '<input data-type="common-check-radio" type="radio" name='+radioName+' id='+radioId+' value='+options[i]+' data-radio="user-radio" data-objectId='+objectId+' style="display:none;" />';
                optionTemp += '<label for='+radioId+' data-type="common-label"  style="display:inline-block;width:80%;height:100%;" >'+options[i]+'</label>'
                optionTemp +="</div>"
                temp += optionTemp;
            }
            return temp;
        },
        componentWillMount: function () {

        },
        render: function () {
            return (<div style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef} dangerouslySetInnerHTML={{__html:this.createRadio()}}></div>);
        },
        componentDidMount: function () {

        }
    });
    return MeRadio;
});
