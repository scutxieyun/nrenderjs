define("MeMediaMgr",function(){
	var MeMediaMgr = function(pageSize){
		this.pageArr = new Array(0);
	};
	MeMediaMgr.prototype.registerPage = function(mediaInstance){
		debugger;
		if(mediaInstance != null){//todo . check 类型是否为react class
			var pageIdx = mediaInstance.props.pageIdx;
				if(this.pageArr[pageIdx] == null || this.pageArr[pageIdx] == undefined){
					this.pageArr[pageIdx] ={};
				}
			this.pageArr[pageIdx][mediaInstance.props.idx]=mediaInstance;
		}
	};
	MeMediaMgr.prototype.pausePage=function(mediaInstance){
		debugger;
		var pageObjs=this.pageArr[mediaInstance.props.pageIdx];
		for(var obj in pageObjs){
			if (obj.props.idx!=mediaInstance.props.idx){
				obj.pause();
			}

		}
	}
	MeMediaMgr.prototype.addPageListener = function(idx,comRef){
		//if(idx < this.pageArr.length && this.pageArr[idx] != null){
		//	this.pageArr[idx].addListener(comRef);
		//}
	};
	MeMediaMgr.prototype.removePageListener = function(id,comRef){
		//if(idx < this.pageArr.length && this.pageArr[idx] != null){
		//	this.pageArr[idx].removeListener(comRef);
		//}
	};
	MeMediaMgr.prototype.getPageInstance = function(idx){
		//if(idx < this.pageArr.length) return this.pageArr[idx];
		//return null;
	};
	MeMediaMgr.prototype.registerComponent = function(idx,compId,comRef){
		//if(idx < this.pageArr.length && this.pageArr[idx] != null){
		//	this.pageArr[idx].registerComponent(compId,comRef);
		//}
	};
	return MeMediaMgr;
});