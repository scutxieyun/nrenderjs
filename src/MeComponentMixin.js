define("MeComponentMixin",function(){
	/**非Page组件*/
	/** 关于display的考虑：
		display只是提供一个信息参考，如何影响控件的显示，由上层控件决定。这样让上层控件去考虑冲突问题
	**/
var selfIncCounter = 0;
	/**
		改变策略，所有控件都分配ID，如果定义是没有分配，则Component进行分配
		作品生成器或者制作软件需要注意创建component的开销，如果素材没有交互要求，请不要使用Component，
		直接使用H5元素
	**/
	return {
		pageInstance:null,
		getIncId:function(){
				return selfIncCounter ++;
			},
		getInitialState:function(){
			return {
				display:true,
				innerXOffset:0,
				interYOffset:0,
			};//React会将调用chain中的数据进行合并
		},
		componentWillMount:function(){
			if(this.props.id == undefined || this.props.id == null){ 
				this._cid = "MeComponentMixin" + this.getIncId();
			}
		},
		componentPageActive:function(){
			if(this.props.displayType == 1) //缺省隐藏的,这样才能不影响预加载
				this.setState({display:false});
		},
		componentPageDeactive:function(){
			//reserve
		},
		componentDidMount:function(){
			//if(this.props.display != )
			var cId = this.getId();
			if(this.props.pageIdx != undefined && cId != undefined){
				this.pageInstance = this.props.cxt.pageMgr.registerComponent(this.props.pageIdx,cId,this);	
			}
		},
		getId:function(){
			return this.props.id != undefined ? this.props.id : this._cid;
		},
		isPageActive:function(){
			if(this.pageInstance == null) return false;
			return this.pageInstance.state.active;
		},
		updateStyleForDisplay:function(_style){//任何控件最后显示时，调用这个函数更新下
			if(this.state.display == false){
				_style.display = "none";
			}
			else if(_style.display == "none"){
				_style.display = "block";
			}
			return _style;
		},
		getPageInstance:function(){
			if(this.pageInstance != null) return this.pageInstance;
			if(this.props.pageIdx != undefined){
				return this.props.cxt.pageMgr.getPageInstance(this.props.pageIdx);
			}
			return null;
		},
        /**
         * 根据各自的refs,获取dom对象
         * @returns {*}
         */
        getRef:function(){
            if(this.myRef) return this.refs[this.myRef];
            return null;
        },
		show:function(){
			this.setState({display:true});
		},
		hide:function(){
			this.setState({display:false});
		},
		move:function(param){
            //TODO 根据dom对象来实现动画, 依赖jquery
            if(param) {
                var paramObj = param;
                var elId = paramObj.id;
                var displayObject = document.getElementById(elId);
                if (displayObject) {
                    var $element = $(displayObject);
                    var left = parseInt($element.css("left"));
                    var top = parseInt($element.css("top"));
                    var toX = paramObj.to.x;
                    var toY = paramObj.to.y;
                    var obj = {};
                    //add by fishYu 20164-12 9:29增加
                    var position = paramObj.position;
                    if (position == "relative") {
                        //有可能是0， 负数，正数
                        toX = parseFloat(toX) + left;
                        obj.left = toX;

                        toY = parseFloat(toY) + top;
                        obj.top = toY;
                    } else if (position == "absolute") {
                        //有可能是0， 负数，正数
                        obj.left = parseFloat(toX);
                        obj.top = parseFloat(toY);
                    }
                    var speed = paramObj.speed || 0.5;
                    var ease = paramObj.easing || "linear";
                    speed = speed * 1000;
                    var delay = paramObj.delay || 0;
                    delay = delay * 1000;
                    $element.stop(true, true).delay(delay).animate(obj, {
                        duration: speed,
                        easing: ease,
                        complete : function(){
                            console.log("complete");
                        },
                        step : function(param){
//                            console.log('56666', param);
                        }
                    });
                }
            }
			
		},
		addClass:function(str){
		},
        /**
         * 动画执行脚本
         * @param option
         */
        animate:function(param){
            //TODO 根据dom对象来实现动画
            if(param) {
                var obj = param;
                var paramObj = param;
                var elId = paramObj.id;
                var displayObject = document.getElementById(elId);
                if (displayObject) {
                    displayObject.className = "";
                    var style = displayObject.style;
                    var animateName = obj.name;
                    displayObject.className = animateName + " animated";
                    //modify by fishYu 2016-4-29 11:22增加播放动画的类型
                    var type = obj.type || "in";
                    //动画持续时间
                    if (obj.duration) {
                        style["WebkitAnimationDuration"] = obj.duration + "s";
                        style["animationDuration"] = obj.duration + "s";
                    }
                    //动画次数
                    if (obj.infinite) {
                        style["WebkitAnimationIterationCount"] = obj.infinite;
                        style["animationIterationCount"] = obj.infinite;
                    } else {
                        style["WebkitAnimationIterationCount"] = 1;
                        style["animationIterationCount"] = 1;
                    }
                    //延迟时间
                    if (obj.delay) {
                        style["WebkitAnimationDelay"] = obj.delay + "s";
                        style["animationDelay"] = obj.delay + "s";
                    }else{
                        style["WebkitAnimationDelay"] = "0.3s";
                        style["animationDelay"] =  "0.3s";
                    }
                    $(displayObject).on("webkitAnimationEnd",function(){
                        $(this).off("webkitAnimationEnd");
                        if(type != "out"){
                            this.className = "";
                        }
                    });
                }
            }
        },
        isPC:function(){    //判断是否是浏览器平台
            var userAgentInfo = navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
            }
            return flag;
        }
	};
});