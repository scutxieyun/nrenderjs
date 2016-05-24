var React = require("react");
var ReactDOM = require("react-dom");
define("MePage",function(){
	var MePage  = React.createClass({
		getInitialState:function(){
			this.compRegisters = {};//让页面内的组件进行注册
			this.pageListener = [];
			return{
				active:false
			};
		},
		addListener:function(comRef){
			if(comRef != null){// @todo 应该做重复检查
				this.pageListener.push(comRef);
			}
		},
		removeListener:function(comRef){
			if(comRef != null){
				var i = 0;
				for(i = 0;i < this.pageListener.length;i ++){
					if(this.pageListener[i] == comRef)break;
				}
				if(i < this.pageListener.length){
					this.pageListener.splice(i,1);
				}
			}
		},
		notifyPageEvent:function(){
			var i = 0;
			for(i = 0;i < this.pageListener.length;i ++){
				if(this.pageListener[i] != null){
					if(this.state.active){
						this.pageListener[i].pageActive(this);
					}else{
						this.pageListener[i].pageDeactive(this);
					}
				}
			}
		},
		componentDidMount:function(){
			//需要检查下是否did update被调用
		},
		componentDidUpdate:function(prevProps,prevState){
			if(prevState.active != this.state.active){
				var pageActEvt = "page[" + this.props.idx + "]:" + (this.state.active ? "active":"deactive");
				this.props.cxt.ee.emitEvent(pageActEvt,[{target:this,active:this.state.active}]);
				this.notifyPageEvent();
				console.log("send out " + pageActEvt);
			}
		},
		componentWillUnmount:function(){
			console.log("mepage will be unmounted",this);
		},
		render:function(){
			if(this.props.cxt.pageMgr != null){
				this.props.cxt.pageMgr.registerPage(this); //开始，将这个操作放在componentDidMount，但是对于后续加载的页面，都没有调用，怀疑react认为是老的页面，只是调用了update
			}
			return <div className="me-page" id={"page" + this.props.idx} style={this.props.normalStyle} >{this.props.children}</div>;
		}});
	return MePage;
});

