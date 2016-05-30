var convFunc = require('./json2jsx.js');
var fs = require('fs');
var process = require('process');
var url = require('url');  
var http = require('http');
function kickoffConvert(tpl,jsonData,cb){
	var jsStatement = "(function(){return " + jsonData + ";})();";
	var jsonData = eval(jsStatement);
	if(jsonData == null) console.log("数据错误");
	var res = convFunc((tpl),jsonData.tplData)
	cb(res);
}


function downloadJson(url,cb){
	var jsonData = "";
	http.get(url,function(res){
		res.on("data",function(data){
				jsonData = jsonData + data;
			})
			.on("end",function(){
				cb(jsonData);
			})
			.on("error",function(){
				console.log("download data error");
			});;
	});
}

var myArgs = process.argv.slice(2);
if(myArgs.length < 3){
	console.log("参数：模板文件 远程文件链接 生成文件");
	return;
}
fs.readFile(myArgs[0],'utf8',function(err,tpl){
	if(!err){
		//http://ac-hf3jpeco.clouddn.com/e3989024061582aebc70.json?1464251726690
		downloadJson(myArgs[1],function(jsonData){
			debugger;
			if(jsonData.length > 10){
				kickoffConvert(tpl,jsonData,function(data){
					if(myArgs.length >= 2 && data != null){
						fs.writeFileSync(myArgs[2],data);
					}
				});
			}
		});
	}
});
