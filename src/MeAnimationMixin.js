define("MeAnimationMixin",function(){
	return {
		getInitialState:function(){
			return{
				animationState:"no start"
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
		animationActive:function(evt){
			this.setState({animationState:"start"});
		},
		animationDeactive:function(evt){
			this.setState({animationState:"no start"});

		},
	}
});