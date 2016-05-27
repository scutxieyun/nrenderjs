define("MeComponentMixin",function(){
	/**非Page组件*/
	/** 关于display的考虑：
		display只是提供一个信息参考，如何影响控件的显示，由上层控件决定。这样让上层控件去考虑冲突问题
	**/
var selfIncCounter = 0;

	return {
		pageInstance:null,
		getIncId:function(){
				return selfIncCounter ++;
			},
		getInitialState:function(){
			return {
				display:true
			};//React会将调用chain中的数据进行合并
		},
		componentWillMount:function(){
			if(this.props.id == undefined && this.props.autoActive){  //autoActive说明这个元素需要注册pageActive
				this._cid = "MeComponentMixin" + this.getIncId();
			}
		},
		componentDidMount:function(){
			//if(this.props.display != )
			var cId = this.props.id != undefined ? this.props.id : this._cid;
			if(this.props.pageIdx != undefined && cId != undefined){//只有定义了id，才需要注册
				
				this.pageInstance = this.props.cxt.pageMgr.registerComponent(this.props.pageIdx,cId,this);	//登记组件
			}
		},
		getPageInstance:function(){
			if(this.pageInstance != null) return this.pageInstance;
			if(this.props.pageIdx != undefined){
				return this.props.cxt.pageMgr.getPageInstance(this.props.pageIdx);
			}
			return null;
		},
		show:function(){
			this.setState({display:true});
		},
		hide:function(){
			
			this.setState({dislay:false});
		},
		addClass:function(str){
		}
	};
});