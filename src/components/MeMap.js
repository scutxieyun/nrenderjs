/** 文件名称: MeMap
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/13 14:25
 * 描    述: 地图组件  --- 对应 item_type 15
 */
define("MeMap", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeMap = React.createClass({
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', border:"none"}
            }
        },
        getInitialState : function(){
            this.myRef = "myMeLongPress";
            return {};
        },
        mixins:[MeComponentMixin, MeCommandMixin],
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
        clickHandle : function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            //用于判断，是否派发全局的点击事件
            window.IsMeElementTap = true;
//            console.log("map");
            var src = "http://www.agoodme.com/views/map.html?lng=" + this.props.data.lng + "&lat=" + this.props.data.lat + "&zoom=" + this.props.data.zoom;
            var action = "openWithIFrame(" + src+")";
            this._handleCmd(action);
        },
        render: function () {
            var width = this.props.normalStyle.width;
            width = parseInt(width);
            var height = this.props.normalStyle.height;
            height = parseInt(height);
            var src = "http://api.map.baidu.com/staticimage/v2?ak=VzFAGGC7tDTFzqKKIsTI7GRV&copyright=1&center=" + this.props.data.lng + "," + this.props.data.lat + "&zoom=" + this.props.data.zoom + "&markers="
                + this.props.data.lng + "," + this.props.data.lat + "&width=" + width + "&height=" + height;
            var res = null;
            if(this.isPC()){
                res = (<img onMouseDown={this.clickHandle} src={src} style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef} />);
            }else{
                res = (<img onTouchStart={this.clickHandle} src={src} style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef} />);
            }
            return res;
        },
        componentDidMount: function () {

        }
    });
    return MeMap;
});
