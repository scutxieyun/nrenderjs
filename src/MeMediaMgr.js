define("MePageMgr",function(){
	var MePageMgr = function(pageSize){
		this.pageArr = new Array(pageSize);//页面容器，存放page的react对象
	};
	MePageMgr.prototype.registerPage = function(pageInstance){
		if(pageInstance != null){//todo . check 类型是否为react class
			var idx = pageInstance.props.idx;
			if(idx < this.pageArr.length){//Page的对象可能会被重新创建(因为render)，所有存在覆盖,检查是不是重复设置
				if((this.pageArr[idx] != null || this.pageArr[idx] != undefined) && (this.pageArr[idx] != pageInstance)) console.log("warning a new page instance replaced");
				this.pageArr[idx] = pageInstance;
			}else{
			//调整数组长度
				for(var i = this.pageArr.length ;i < idx; i ++){
					this.pageArr.push(null);
				}
				this.pageArr.push(pageInstance);
			}
		}
	};
	MePageMgr.prototype.addPageListener = function(idx,comRef){
		if(idx < this.pageArr.length && this.pageArr[idx] != null){
			this.pageArr[idx].addListener(comRef);
		}
	};
	MePageMgr.prototype.removePageListener = function(id,comRef){
		if(idx < this.pageArr.length && this.pageArr[idx] != null){
			this.pageArr[idx].removeListener(comRef);
		}
	};
	MePageMgr.prototype.getPageInstance = function(idx){
		if(idx < this.pageArr.length) return this.pageArr[idx];
		return null;
	};
	MePageMgr.prototype.registerComponent = function(idx,compId,comRef){
		if(idx < this.pageArr.length && this.pageArr[idx] != null){
			this.pageArr[idx].registerComponent(compId,comRef);
		}
	};
	return MePageMgr;
});