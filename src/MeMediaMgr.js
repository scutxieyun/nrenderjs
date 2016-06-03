define("MeMediaMgr",function(){
	/*var MeMediaMgr = function(pageSize){
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
	}*/
	var MeMediaMgr = function(){
		this.workMediaSource = null;
	}
	MeMediaMgr.prototype.pause = function(){
		if(this.workMediaSource)
			this.workMediaSource.pause();
	}
	MeMediaMgr.prototype.register = function(source){
		if(this.workMediaSource != null && this.workMediaSource != source){
			this.workMediaSource.pause();
		}
		this.workMediaSource = source;
	}
	MeMediaMgr.prototype.unregister = function(source){
		if(source == this.workMediaSource){
			this.workMediaSource = null;
		}
	}
	return MeMediaMgr;
});