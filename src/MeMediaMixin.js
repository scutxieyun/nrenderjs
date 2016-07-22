define("MeMediaMixin",function(){
	var MeMediaMgr = require("../src/MeMediaMgr.js");
	return {
		getInitialState:function(){
			if(this.props.cxt != undefined && this.props.cxt.mediaMgr == undefined){//为了作品性兼容
				this.props.cxt.mediaMgr = new MeMediaMgr();
			}
			return {
				isPlay:false
			}
		},
		play:function(){

			if(this.props.cxt == undefined) return;
			this.props.cxt.mediaMgr.pause();
			if(this.refs.mediaPlay){
				this.refs.mediaPlay.play();
			}
			this.props.cxt.mediaMgr.register(this)
			this.setState({
				isPlay:true
			})
		},
		pause:function(){
			if(this.refs.mediaPlay){
				this.refs.mediaPlay.pause();
			}
			this.props.cxt.mediaMgr.unregister(this);
			this.setState({
				isPlay:false
			})
		},
		togglePlay:function(){
            //用于判断，是否派发全局的点击事件
            window.IsMeElementTap = true;
			if((!!this.props.src) == false) return;//不存在数据就不enable togglePlay
			if (this.state.isPlay) {
				this.pause()
			}
			else {
				this.play();
			}
		}
	}
});