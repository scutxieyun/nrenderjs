define("MeMediaMixin",function(){
	var MeMediaMgr = require("../src/MeMediaMgr.js");
	return {
		getInitialState:function(){
			if(this.props.cxt.mediaMgr == undefined){
				this.props.cxt.mediaMgr = new MeMediaMgr();
			}
			return {
				isPlay:false
			}
		},
		play:function(){
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
			if (this.state.isPlay) {
				this.pause()
			}
			else {
				this.play();
			}
		}
	}
});