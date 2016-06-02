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
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box'}
            }
        },
        getInitialState : function(){
            this.fontName = "css-font-" + this.getIncId();
            this.fontServer = "http://agoodme.com:3000";
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
         * 下载云字体
         */
        downloadFont : function(){
            var fontserver = this.fontServer;
            var font = this.props.normalStyle.fontFamily;
            var text = this.props.data.content;
            var self = this;
            $.ajax({
                type: 'GET',
                url: fontserver + "/loadfont/?callback=?&r=" + Math.random(),
                data: {"type":"fixed","font":font,"text":text},
                success: self.applyFont,
                error:function(data,status,e){
                    console.log(status);
                },
                dataType: "json"
            });
        },
        /**
         * 设置云字体的font face
         */
        applyFont : function (fontData) {
            var fontName = this.fontName;
            var src = fontData.src;
            var type = fontData.type;
            if(!src || !type || src == 'undefined') return;
            src = this.fontServer + src;
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
            this.downloadFont();
        },
        render: function () {
            //更换云字体样式
            if(this.props.normalStyle.fontFamily){
                this.props.normalStyle.fontFamily = this.fontName;
            }
            return (<div style={_assign(this.props.normalStyle,this.props.commonStyle)} ref="myMeText" dangerouslySetInnerHTML={{__html:this.props.data.content}}></div>);
        },
        componentDidMount: function () {
        }
    });
    return MeText;
});
