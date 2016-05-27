define("MeAnimationMixin",function(){
	return {
		getInitialState:function(){
			return{
				animationState:"no start"
			}
		},
		getDefaultProps:function(){
			return{
			}
		},
		getDefaultProps:function(){
			return {
				animationClass:"fadeIn",
				item_animation:{
					animationIterationCount:"1",
					animationDelay:"0s",
					animationDuration:"1s"
				},
			};
		},
		pageActive:function(){
			if(this.props.autoActive)
				this.animationActive();
		},
		pageDeactive:function(){
			this.animationDeactive();//无论是否自动启动, 都将动画设为禁止
		},
		animationActive:function(evt){
			this.setState({animationState:"start"});
		},
		animationDeactive:function(evt){
			this.setState({animationState:"no start"});

		},
		getAnimationClass:function(){
			var className = (this.state.animationState == "start" ? "animated " + this.props.animationClass:"hidden");
			return className;
		}
	}
});