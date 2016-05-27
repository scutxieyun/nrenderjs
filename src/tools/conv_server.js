var express = require('express');
var fs = require('fs');
var convFunc = require('./json2jsx.js');
var http = require('http');
var _ = require("underscore");
var babel = require("babel-core");

var server = express();

var tpl = (fs.readFileSync('./src/tools/mag_template.js',{encoding:'utf8',flag:'r'}));
if(tpl == null){
	console.log("read tpl file error");
	return;
}


function downloadJson(url,cb){
	var jsonData = "";
	console.log("request get",url);
	http.get(url,function(res){
		res.on("data",function(data){
				jsonData = jsonData + data;
				//console.log(data);
			})
			.on("end",function(){
				cb(jsonData);
			})
			.on("error",function(){
				cb(null);
			});;
	});
}


function kickoffConvert(tpl,jsonData,cb){
	var jsStatement = "(function(){return " + jsonData + ";})();";
	var jsonData = eval(jsStatement);
	if(jsonData == null) console.log("数据错误");
	var res = convFunc(tpl,jsonData.tplData)
	return babel.transform(res, {
		plugins: ["transform-react-jsx"]
	}).code;
}
function convertEntry(req,res,next){
	console.log(req.query.mag);
	downloadJson((decodeURI(req.query.mag)),function(data){
			if(data == null){
				res.send("");
			}else{
				var jsData = kickoffConvert(tpl,data);
				res.send(jsData);
			}
			next();
	});
	//next();
}
// 注册功能模块
server.get('/jsx',convertEntry);
server.get('/test',function(req,res){res.send("asdfdfsd");});


try {
    // 监听端口
    server.listen(3333, function () {
        //if (process.env.NODE_ENV === 'development') {
        console.log('%s listening at %s', server.name, server.url);
        //}
        //console.log(avConfig);
    });
} catch (e) {
    console.err("请输入有效端口！");
}