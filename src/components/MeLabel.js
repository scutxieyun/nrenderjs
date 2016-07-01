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
            this.myRef = "myMeLabel";
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
            var content = data.content; //标签内容
            var typeImg = data.typeImg; //类型的图片，前面的小图标
            var direction = data.direction;      //左或者右
            var width = this.props.normalStyle.width;
            var height = this.props.normalStyle.height;
            var fontSize = this.props.normalStyle.fontSize;
            var color = this.props.normalStyle.color;
            //动画层
            temp += '<div style="position:relative;width:32px;height:'+height+';float:'+direction+';">';
            temp += '<div style="position:absolute;z-index:2;width:100%;height:100%;background:url('+typeImg+') no-repeat center">';
            temp += '</div>';
            temp += '<div style="position:absolute;z-index:1;width:32px;height:32px;' +
                'top:calc(50% - 16px);top:-webkit-calc(50% - 16px);left:calc(50% - 16px);left:-webkit-calc(50% - 16px);' +
                'background:rgba(0,0,0,.7);margin:0 auto;-webkit-animation-name:player-button;-webkit-animation-duration:1.6s;' +
                '-webkit-animation-iteration-count:infinite;-webkit-animation-timing-function:linear;border-radius:100%;">';
            temp += '</div></div>';
            //标签内容层
            var contentFloat = "";
            var contentClass = "";
            var bottomRadius = "";
            var topRadius = "";
            if(direction == "left"){
                contentFloat = "right";
                contentClass = "label-text-left";
                bottomRadius = "border-bottom-right-radius";
                topRadius = "border-top-right-radius";
            }else if(direction == "right"){
                contentFloat = "left";
                contentClass = "label-text-right";
                bottomRadius = "border-bottom-left-radius";
                topRadius = "border-top-left-radius";
            }
            temp += '<div style="border:none;text-align:center;width:'+(parseFloat(width) - 33)+'px;height:'+height+';font-size:'+fontSize
                +';color:'+color+';float:'+contentFloat+';'+bottomRadius+':10px;'+topRadius+':10px;line-height:'+height+';" class='+contentClass+'>';
            temp += content;
            temp += '</div>';
            return temp;
        },
        componentWillMount: function () {

        },
        render: function () {
            return (<div style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef} dangerouslySetInnerHTML={{__html:this.createLabel()}}></div>);
        },
        componentDidMount: function () {

        }
    });
    return MeLabel;
});
