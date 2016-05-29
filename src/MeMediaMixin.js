define("MeAnimationMixin",function(){
	return {
		pageActive(){
			this.componentPageActive();
			if(this.props.cxt.pageMgr != null){
				this.props.cxt.mediaMgr.registerPage(this); //开始，将这个操作放在componentDidMount，但是对于后续加载的页面，都没有调用，怀疑react认为是老的页面，只是调用了update
			}
		},
		pageDeactive(){
			this.componentPageDeactive();
			console.log("media pageDeactive");
		},
		togglePlay(){
			if (this.state.isPlay) {
				this.pause()
			}
			else {
				this.props.cxt.mediaMgr.pausePageMedia(this);
				//var pageActEvt = "page[" + this.props.pageIdx+","+this.props.idx+ "]:play";
				//this.props.cxt.ee.emitEvent(pageActEvt,[{target:this,isPlay:true}]);
				this.play();
			}
			this.setState({isPlay:!this.state.isPlay})
		}
	}
});