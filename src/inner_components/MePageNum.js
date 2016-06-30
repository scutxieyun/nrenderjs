/** 文件名称: MePageNum
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/23 10:00
 * 描    述: 全局的页码组件
 */
define("MePageNum", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MePageNum = React.createClass({
        getDefaultProps:function(){
            return {
                commonStyle : {position:"absolute",zIndex:2,height:"52px",right:"0px",bottom:"0px",fontSize:"20px",textAlign:"center",
                    background:"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAYAAACXU8ZrAAAAKUlEQVQImWN8JGv0n4EAYGJgYGAkoIaRCcbApQBmEgMOhXA+Ew4JFA0AlasCQnZiwRYAAAAASUVORK5CYII=) 50% 100% no-repeat"}
            }
        },
        getInitialState : function(){
            this.myRef = "myMePageNum";
            return {
                isShow : true,     //动态配置是否显示全局消息组件
                pageIndex : 0
            };
        },
        componentWillMount: function () {

        },
        customEventHandle : function(data){
            this.setState(data);
        },
        render: function () {
            var res = null;
            //分割线
            var divideLine = '-';
            var lineStyle = {};
            if(this.props.pageNumType == 1){
                divideLine = this.pageLength >= 10 ? "—" : "-";
                lineStyle.margin = "2px auto";
                lineStyle.lineHeight = "0";
            }else if(this.props.pageNumType == 2){
                divideLine = "/";
            }
            var pageLength = 1;
            if(this.state.pageLength){
                pageLength = this.state.pageLength;
            }else{
                pageLength = this.props.initPageLength
            }

            if(this.state.isShow || this.props.pageNumType) {
                res = (<div ref={this.myRef}  style={{position:"absolute",zIndex:3,width:"300px",height:"300px",right:"16px",bottom:"16px",pointerEvents:"none"}}>
                    <div  ref={this.myRef} style={_assign(this.props.normalStyle, this.props.commonStyle)}>
                        <div >{this.state.pageIndex + 1}</div>
                        <div style={lineStyle}>{divideLine}</div>
                        <div >{pageLength}</div>
                    </div>
                </div>);
            }
            return res;
        },
        componentDidMount: function () {
            //TODO 监听自定义事件,显示或者隐藏
            this.props.cxt.ee.addListener("show:page:num",this.customEventHandle);
            this.props.cxt.ee.addListener("hide:page:num",this.customEventHandle);
        }
    });
    return MePageNum;
});
