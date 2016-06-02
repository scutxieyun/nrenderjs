define("MeArtical",[],function(){
	var MeArticle = function(art){
		this.article = art;
	};
	
	
	MeArticle.prototype.getPageIdxInLayout = function(posXIdx,posYIdx){
		var innerXId = posXIdx + 1;
		if(innerXId < this.article.layout.length){
			var xPages = this.article.layout[innerXId];
			if(xPages instanceof Array){
				var innerYId = posYIdx + 1;
				if(innerYId < xPages.length){
					return xPages[innerYId];
				}
			}else{
				return xPages;//忽略Y
			}
		}
		return -1;
	}
	MeArticle.prototype.getNbrPageIdx = function(dir,idx,idy){
		var innerIdx = idx + 1;				//避免边界检查
		if(innerIdx <= 0 || innerIdx >= this.article.layout.length) return -1;//超出边界
		var L1Data = null;
		var result = -1;
		if(dir === "L1Next"){
			L1Data = this.article.layout[innerIdx+1];
		}
		if(dir === "L1Prev"){
			L1Data = this.article.layout[innerIdx-1];
		}
		if(L1Data != null){
			if(L1Data instanceof Array){
				result = L1Data[1];		//切换到新作品的第一页,也是避免边界检查，从1开始
			}else{
				result = L1Data;//单页模式
			}
			return result;
		}
		//二级翻页
		L1Data = this.article.layout[innerIdx];
		if(L1Data instanceof Array){
			var innerIdy = idy + 1;
			if(innerIdy <= 0 || innerIdy >= L1Data.length) return -1;
			if(dir == "L2Prev"){
				result = L1Data[innerIdy - 1];
			}
			if(dir == "L2Next"){
				result = L1Data[innerIdy + 1];
			}
			return result;
		}
		return -1;
	};
	MeArticle.prototype.getCurPage = function(){
		return this.getPage(this.article.reading_page_index[this.reading_point]);
	};
	
	MeArticle.prototype.getPageByIdx = function(idx){
		if(idx < 0 || idx >= this.article.pages.length) return null;
		return this.article.pages[idx];
	};
	MeArticle.prototype.getPageInstanceByIdx = function(idx){
		return this.article.cxt.pageMgr.getPageInstance(idx);
	};
	MeArticle.prototype.getPage = function(key){
		var page = null;
		if(typeof key === "number"){
			page = this.article.pages[key];
		}
		if(typeof key === "string"){
			var keys = key.split(":");
			if(keys.length == 1){
				page = this.article[key];
			}else{
				page = this.article[keys[0]][keys[1]];
			}
		}
		return page;
	};
	MeArticle.prototype.getL1Num = function(){
		return this.article.layout.length - 2; //忽略layout前后的-1
	}
	MeArticle.prototype.getNumOfPage = function(){
		return this.article.pages.length;
	};
	MeArticle.prototype.getCxt = function(){
		return this.article.cxt;
	}
	MeArticle.prototype.getToolBar = function(){
		return this.article.toolBar;
	}
	return MeArticle;
});