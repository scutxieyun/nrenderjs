/** 文件名称: MeRadio
 *
 * 创 建 人: fishYu
 * 创建日期: 2015/5/27 15:06
 * 描    述: 单选组件
 */
define("MeRadio", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeRadio = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                normalStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box'}
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
            console.log("active radio");
        },
        /**
         * 移除当前页的时候
         */
        pageDeactive:function(){
            console.log("deactive radio");
        },
        createRadioOptions : function(){
            var data = this.props.dynamicData;
            var temp = "";
            var itemVal = null;
            //预防JSON字符串解析出问题
            try{
                itemVal = JSON.parse(data.item_val);
            }catch (e){
                console.log(e.name + ": " + e.message);
                return;
            }
            if(itemVal == null){
                return;
            }
            //属性
            var title = itemVal.title;
            var options = itemVal.options;
            var bgColor = data.bg_color;
            var bdColor = data.bd_color || "#000000";
            var bdStyle = data.bd_style || "solid";
            var itemBorder = data.item_border;
            var itemColor = data.item_color;
            var fontSize = data.font_size;
            var objectId = data.objectId;
            //创建标题
            temp += '<div style="width:100%;height:100px;line-height:100px;padding-left:10px;box-sizing:border-box;color:'+itemColor+';font-size:'+fontSize+';background:'+bgColor+';">';
            temp += title;
            temp += "</div>";
            //创建单选项
            var len =  options.length;
            var radioName = "radio" + this.getIncId();
            for(var i = 0; i <len; i++){
                var optionTemp = "";
                var optionBorder = "";
                if(itemBorder && i !=(len-1) ){
                    optionBorder = itemBorder + "px " + bdStyle + " " + bdColor;
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
            return (<div style={_assign(this.props.dynamicStyle,this.props.normalStyle)} ref="myMeRadio" dangerouslySetInnerHTML={{__html:this.createRadioOptions()}}></div>);
        },
        componentDidMount: function () {

        }
    });
    return MeRadio;
});
