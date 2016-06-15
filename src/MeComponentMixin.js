define("MeComponentMixin",function(){
	/**非Page组件*/
	/** 关于display的考虑：
		display只是提供一个信息参考，如何影响控件的显示，由上层控件决定。这样让上层控件去考虑冲突问题
	**/
var selfIncCounter = 0;
	/**
		改变策略，所有控件都分配ID，如果定义是没有分配，则Component进行分配
		作品生成器或者制作软件需要注意创建component的开销，如果素材没有交互要求，请不要使用Component，
		直接使用H5元素
	**/
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
			if(this.props.id == undefined || this.props.id == null){ 
				this._cid = "MeComponentMixin" + this.getIncId();
			}
		},
		componentPageActive:function(){
			if(this.props.displayType == 1) //缺省隐藏的,这样才能不影响预加载
				this.setState({display:false});
		},
		componentPageDeactive:function(){
			//reserve
		},
		componentDidMount:function(){
			//if(this.props.display != )
			var cId = this.getId();
			if(this.props.pageIdx != undefined && cId != undefined){
				this.pageInstance = this.props.cxt.pageMgr.registerComponent(this.props.pageIdx,cId,this);	
			}
		},
		getId:function(){
			return this.props.id != undefined ? this.props.id : this._cid;
		},
		isPageActive:function(){
			if(this.pageInstance == null) return false;
			return this.pageInstance.state.active;
		},
		updateStyleForDisplay:function(_style){//任何控件最后显示时，调用这个函数更新下
			if(this.state.display == false){
				_style.display = "none";
			}
			else if(_style.display == "none"){
				_style.display = "block";
			}
			return _style;
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
			this.setState({display:false});
		},
		addClass:function(str){
		},
        isPC:function(){    //判断是否是浏览器平台
            var userAgentInfo = navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
            }
            return flag;
        }
	};
});