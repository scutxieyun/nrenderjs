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
		"pageTo":function(cxt,callee,args){
            console.log("pageTo calls: ",args);
            //TODO 需要增加根据页ID跳转，和页序号跳转
            if(this.props.cxt.system != undefined){
                var renderjs = this.props.cxt.system;
				var L1Pos = -1;
				var L2Pos = -1;
				if(args.length <= 0) return;
				if(args.length == 1){
					L2Pos = parseInt(args[0]);
					L1Pos = -1;//代表当前组
				}
				if(args.length == 2){
					L1Pos = parseInt(args[0]);
					L2Pos = parseInt(args[1]);
				}
				renderjs.helper.gotoPos(L1Pos,L2Pos); //
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
            if(this.props.cxt.system != undefined){
                var renderjs = this.props.cxt.system;
                var data = args[0];
                var type = args[1];     //1 -- 表单数据  ，  2 --- 投票数据
                setTimeout(function(){
                    renderjs.helper.submitDataToCloud(data, type);
                },0);
            }
		},
		"systemCall":function(){
			
		},
		"phoneFunc":function(cxt,callee,args){
			console.log("phonefunc calls: ",args);
            var option = args[0];
            var target = args[1];
            target = "tel:"+target;
            window.open(target);
		},
		"componentDo":function(cxt,callee,args){
			var pageInstance = callee.getPageInstance();
			if(pageInstance != null && args.length > 1){
                //用于处理animate
                if(args[0] == "animate" || args[0] == "move"){
                    var option = utils["toJSON"](args[1]);
                    for(var i = 0; i < option.length; i++){
                        var obj = option[i];
                        var comId = obj.id;
                        cmdTable["componentDoHandle"](pageInstance, args[0], comId,obj);
                    }
                }
                cmdTable["componentDoHandle"](pageInstance, args[0], args[1],args.slice(2));
//				var el = pageInstance.getComponent(args[1]);
//				if(el != null && el.hasOwnProperty(args[0])){
//					var compMethod = el[args[0]];
//					if(!!(compMethod && compMethod.constructor && compMethod.call && compMethod.apply)){
//						compMethod(args.slice(2));
//					}
//				}
			}
		},
        "componentDoHandle": function(pageInstance, funName, comId, option){
            //TODO 这里获取不到el
            var el = pageInstance.getComponent(comId);
            if(el != null && el.hasOwnProperty(funName)){
                var compMethod = el[funName];
                if(!!(compMethod && compMethod.constructor && compMethod.call && compMethod.apply)){
                    compMethod(option);
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
    /**
     * 工具类--把json字符串转换成json
     * @type {{toJSON: "toJSON"}}
     */
    var utils = {
        "toJSON" : function(jsonStr){
            return (new Function("", "return " + jsonStr))();
        }
    };
	var MeCommandMixin ={
		_handleCmd:function(cmd){
			var p = /([\D|_][a-z|A-Z|_|0-9]*)\((.*)\)/;
			var m = p.exec(cmd);
			if(m != null){
				var method = m[1];
                var params = [];
                if(method == "submit"){
                    if(m[2].indexOf("{") > -1){
                        params = (utils["toJSON"])("["+m[2]+"]");
                    }else{
                        params = m[2].split(",");
                    }
                }else{
                    params = m[2].split(",");
                    //TODO 需要区分animate这个脚本 "animate,[{'name':'zoomInUp','delay':1,'duration':1,'infinite':1,'type':'in','id':'14791081'},{'name':'zoomInUp','delay':1,'duration':1,'infinite':1,'type':'in','id':'19905875'}]"
                    if(params[0] == "animate" || params[0] == "move"){
                        //去掉animate,  只包含具体操作的脚本
                        params[1] = m[2].substr(m[2].indexOf(",") +1, m[2].length);
                    }
                }
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