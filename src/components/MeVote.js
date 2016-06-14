/** 文件名称: MeVote
 *
 * 创 建 人: fishYu
 * 创建日期: 2016/6/14 10:39
 * 描    述: 标签组件  --- 对应 item_type 22
 */
define("MeVote", function () {
    var React = require("react");
    var _assign = require("object-assign");
    var MeComponentMixin = require("../src/MeComponentMixin");
    var MeVote = React.createClass({
        mixins:[MeComponentMixin],
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', border:0}
            }
        },
        getInitialState : function(){
            return {
                voteNum:0
            };
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
        componentWillMount: function () {
            this.setState({voteNum:this.props.data.voteNum});
        },
        clickHandle : function(){
            this.setState({voteNum:this.state.voteNum+1});
            //TODO 保存数据库修改数据库数据根据页  ID  this.props.data.pageId,同时需要更改静态文件
        },
        render: function () {
            //更换云字体样式,有云字体的时候
            var voteNum = this.state.voteNum;
            this.props.normalStyle.fontFamily = "";
            return (<div onClick={this.clickHandle} data-vote={this.props.data.content} style={_assign(this.props.normalStyle,this.props.commonStyle)} ref="myMeVote" >{voteNum}</div>);
        },
        componentDidMount: function () {
        }
    });
    return MeVote;
});
