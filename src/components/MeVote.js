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
    var MeCommandMixin = require("../src/MeCommandMixin.js");
    var MeVote = React.createClass({
        mixins:[MeComponentMixin, MeCommandMixin],
        getDefaultProps:function(){
            //todo 需要动态配置
            return {
                commonStyle : {perspective: '1000px', backfaceVisibility: 'hidden', position: 'relative', boxSizing: 'border-box', border:0}
            }
        },
        getInitialState : function(){
            this.myRef = "myMeVote";
            this._isVote = true;
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
        clickHandle : function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            //用于判断，是否派发全局的点击事件
            window.IsMeElementTap = true;
            if(this._isVote){
                this.setState({voteNum:this.state.voteNum+1});
                //TODO 保存数据库修改数据库数据根据页  ID  this.props.data.pageId,同时需要更改静态文件
                var action = "submit(" + this.props.data.pageId+",2)";
                this._handleCmd(action);
            }else{
                //TODO 派发自定义事件
                this.props.cxt.ee.emitEvent("show:message:box",[{msg:"您已经投过票了",btn:"确定"}]);
            }
            this._isVote = false;
        },
        render: function () {
            //更换云字体样式,有云字体的时候
            var voteNum = this.state.voteNum;
            this.props.normalStyle.fontFamily = "";
            var res = null;
            if(this.isPC()){
                res = (<div onMouseDown={this.clickHandle} data-vote={this.props.data.content} style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef} >{voteNum}</div>);
            }else{
                res = (<div onTouchStart={this.clickHandle} data-vote={this.props.data.content} style={_assign(this.props.normalStyle,this.props.commonStyle)} ref={this.myRef} >{voteNum}</div>);
            }
            return res;
        },
        componentDidMount: function () {
        }
    });
    return MeVote;
});
