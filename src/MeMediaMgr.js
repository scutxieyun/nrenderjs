define("MeMediaMgr",function(){
	var MeMediaMgr = function(pageSize){
		this.pageArr = new Array(0);
	};
	MeMediaMgr.prototype.registerPage = function(mediaInstance){
		if(mediaInstance != null){//todo . check 类型是否为react class
			var pageIdx = mediaInstance.props.pageIdx;
				if(this.pageArr[pageIdx] == null || this.pageArr[pageIdx] == undefined){
					this.pageArr[pageIdx] ={};
				}
			this.pageArr[pageIdx][mediaInstance.props.id]=mediaInstance;
		}
	};
	MeMediaMgr.prototype.pausePageMedia=function(mediaInstance){
		var pageObjs=this.pageArr[mediaInstance.props.pageIdx];
		for(var obj in pageObjs){
			if (pageObjs[obj].props.id!=mediaInstance.props.id){
				pageObjs[obj].pause();
			}

		}
	}
	return MeMediaMgr;
});