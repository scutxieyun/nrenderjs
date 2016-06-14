define([],function(){
	var cmdTable = {
		"callTo":function(cxt,callee,args){
			
		},
		"sms":function(cxt,callee,args){
			
		},
		"gotoArticle":function(cxt,callee,args){
			if(this.props.cxt.system != undefined){
				var renderjs = this.props.cxt.system;
				var tid = args[0];
				setTimeout(function(){
					renderjs.helper.loadTid(tid);
				},0);
			}
		},
		"gotoLink":function(cxt,calle,args){    //打开链接的方式，分为app内部，app外部
            var target = args[0];
            var type = args[1] || "_blank";
            target = target.replace("&amp;", "&");  //预防& 更换为&amp;
            //区分开到底是APP里面打开还是APP外面打开
            var appVersion = "";
            if(window.app && window.app.VERSION){
                appVersion = window.app.VERSION;
            }
            if(appVersion) { //在App内部
                //作品链接的时候
                if (target.indexOf("tid=") > -1) {
                    //直接以内部链接形式打开,
                    var ref = window.open(target, '_blank');	//内部浏览器打开
                    //跳转链接之后派发关闭主音乐
                    //TODO 关闭音乐
                    if (ref) {
                        ref.addEventListener('exit', function (e) {
                            //TODO 关闭链接之后派发打开主音乐
                            ref = null;
                        });
                    }
                } else {  //其他链接直接以内部链接打开
                    //下载链接
                    if (target.indexOf("http://me.agoodme.com") > -1) {
                        if ((/android/gi).test(navigator.appVersion)) {
                            window.open("http://a.app.qq.com/o/simple.jsp?pkgname=com.gli.cn.me", '_blank');	//内部浏览器打开
                        } else if ((/iphone|ipad/gi).test(navigator.appVersion)) {
                            window.open("https://itunes.apple.com/cn/app/mobigage-ndi/id917062901");	//外部浏览器打开itunes
                        }
                    } else {
                        window.open(target, '_blank');	//内部浏览器打开
                    }
                }
            }else{  //在APP 外部
                //获取userAgent用于判断是否微信
                if(type != "_blank"){
                    window.open(target, '_blank');	//内部浏览器打开
//                    var userAgent = navigator.userAgent.toLowerCase();
//                    if (userAgent.indexOf("micromessenger") > -1){	//判断是否在微信里面
//                        window.location.href = target;
//                    }else if(userAgent.indexOf("qq/") > -1){ //在QQ浏览器里面的时候，为了不能跳转
//                        window.location.href = target;
//                    }else{
//                        window.open(target, '_blank');	//内部浏览器打开
//                    }
                }else {
                    //下面为内部打开链接
                    setTimeout(function(){
                        renderjs.helper.openWithInnerBrowse(target);
                    },0);
                }
            }
		},
		"pageTo:":function(cxt,callee,args){
            //TODO 需要增加根据页ID跳转，和页序号跳转
            if(this.props.cxt.system != undefined){
                var renderjs = this.props.cxt.system;
                console.log(args);
//                var target = args[0];
//                var height = args[1];
//                setTimeout(function(){
//                    renderjs.helper.openWithInnerBrowse(target, height);
//                },0);
            }
		},
		//componentDo(method, element，args...)
		"sendEvent":function(cxt,callee,args){
			
		},
		"openlink":function(cxt,callee,args){
            console.log(args, "openlink");
		},
		"savePairs":function(cxt,callee,args){
			
		},
		"submit":function(cxt,callee,args){
			
		},
		"systemCall":function(){
			
		},
		"phoneFunc":function(cxt,callee,args){
			console.log("phonefunc calls: ",args);
		},
		"componentDo":function(cxt,callee,args){
			var pageInstance = callee.getPageInstance();
			if(pageInstance != null && args.length > 1){
				var el = pageInstance.getComponent(args[1]);
				if(el != null && el.hasOwnProperty(args[0])){
					var compMethod = el[args[0]];
					if(!!(compMethod && compMethod.constructor && compMethod.call && compMethod.apply)){
						compMethod(args.slice(2));
					}
				}
			}
		},
        "openWithIFrame":function(cxt,callee,args){
            if(this.props.cxt.system != undefined){
                var renderjs = this.props.cxt.system;
                var target = args[0];
                var height = args[1];
                setTimeout(function(){
                    renderjs.helper.openWithInnerBrowse(target, height);
                },0);
            }
        }
	};
	var MeCommandMixin ={
		_handleCmd:function(cmd){
			var p = /([\D|_][a-z|A-Z|_|0-9]*)\((.*)\)/;
			var m = p.exec(cmd);
			if(m != null){
				var method = m[1];
				var params = m[2].split(",");
				if(cmdTable[method] != undefined){
					cmdTable[method].apply(this,[this.props.cxt,this,params]);
				}
			}
		},
		callActionMethod:function(actions){
			if((!!actions) && actions.length > 0){
				var propagate = false;
				for(var i = 0;i < actions.length; i ++){
					this._handleCmd(actions[i].action);
					propagate |= actions[i].propagate;
				}
				return propagate;
			}
			return true;
		}
	}
	return MeCommandMixin;
});