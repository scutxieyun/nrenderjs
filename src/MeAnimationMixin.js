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
		shouldComponentUpdate :function(nextProps, nextState){
			if(nextState.display == true && this.state.display == false){
				setTimeout(0,function(){
										this.setState({animationState:"start",
										animationIndex:0});
							}
				);
			}
			return true;
		}
	}
});