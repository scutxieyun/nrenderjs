/** 文件名称: MeText
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/2 11:44
 * 描    述: 标签组件  --- 对应 item_type 2
 */
define("MeText", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeText = React.createClass({
        mixins:[MeComponentMixin],
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', whiteSpace : "pre-wrap"}
            }
        },
        getInitialState : function(){
            return {};
        },
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
         * 设置云字体的font face
         */
        applyFont : function () {
            var fontName = this.props.data.fontName;
            var tempSrc = this.props.data.src;
			if(tempSrc == undefined || !tempSrc) return;//无效数据
            //没有云字体或者加载失败云字体
            if(tempSrc.indexOf("me-clould-font-cache") > -1){
                return;
            }
            var arr = tempSrc.split("?");
            var src = arr[0];
            var type = arr[1];
            var styleNode = document.createElement("style");
            styleNode.type = "text/css";
            styleNode.id = "style-" + fontName;
            var styletext = "";
            styletext += "@font-face {\n";
            styletext += "  font-family: '" + fontName + "';\n";
            styletext += "  src: url('" + src + "') format('" + type + "');\n";
            styletext += "}\n";
            styleNode.innerHTML = styletext;
            document.head.appendChild(styleNode);
        },
        componentWillMount: function () {
            this.applyFont();
        },
        render: function () {
            //更换云字体样式,有云字体的时候
            if(this.props.data != undefined && this.props.data &&this.props.data.src.indexOf("me-clould-font-cache") < 0){
                this.props.normalStyle.fontFamily = this.props.data.fontName;
            }
            return (<div style={_assign(this.props.normalStyle,this.props.commonStyle)} ref="myMeText" dangerouslySetInnerHTML={{__html:this.props.data.content}}></div>);
        },
        componentDidMount: function () {
        }
    });
    return MeText;
});
