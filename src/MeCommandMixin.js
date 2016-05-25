define([],function(){
	var cmdTable = {
		"callTo":function(cxt,callee,args){
			
		},
		"sms":function(cxt,callee,args){
			
		},
		"pageTo:":function(cxt,callee,args){
			
		},
		//componentDo(componentName, method, args...)
		"componentDo":function(cxt,callee,args){
			var pageInstance = callee.getPageInstance();
			if(pageInstance != null && args.length > 1){
				var el = pageInstance.getComponent(args[0]);
				if(el != null && el.hasOwnProperty(args[1])){
					var compMethod = el[args[1]];
					if(!!(compMethod && compMethod.constructor && compMethod.call && compMethod.apply)){
						compMethod(args.slice(2));
					}
				}
			}
		},
		"openlink":function(cxt,callee,args){
			
		},
		"saveParis":function(cxt,callee,args){
			
		},
		"submit":function(cxt,callee,args){
			
		}
	};
	var MeCommandMixin ={
		handleCmd:function(cmd){
			var p = /([\D|_][a-z|A-Z|_|0-9]*)\(([a-z|A-Z|_|0-9|,]*)\)/;
			var m = p.exec(cmd);
			if(m != null){
				var method = m[1];
				var params = m[2].split(",");
				if(cmdTable[method] != undefined){
					cmdTable[method].apply(this,[this.props.cxt,this,params]);
				}
			}
		}
	}
	return MeCommandMixin;
});