var express = require('express');
var fs = require('fs');
var convFunc = require('./json2jsx.js');
var http = require('http');
var _ = require("underscore");
var babel = require("babel-core");
var AV = require("avoscloud-sdk");

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
	try{
		console.log(req.query.mag);
		if(req.query.tid != null){
			downloadArticleWithTid(res,req.query.tid,next);
		}
		if(req.query.mag != null){
			return downloadJson((decodeURI(req.query.mag)),function(data){
				res.send(parseData(data));
				next();
			});
		}
	}
	catch(e){
		console.log(e);
		res.send(e);
		next();
	}
	//next();
}

function parseData(data){
	if(data == null){
				return ""
	}else{
		try{
			var jsData = kickoffConvert(tpl,data);
			return (jsData);
		}catch(e){
			console.log(e);
			return (e.toString());
		}
	}
}

function downloadArticleWithTid(res,tid,next){
	AV.initialize("hf3jpecovudrg8t7phw3xbt1osqfrmfhnwu22xs8jo1ia3hn", "b9nndoind1e7tjrhj7owyg4m55d9uyymcqprklb5w9qxo9rr");
		var query = new AV.Query('tplobj');
        query.equalTo('tpl_id', tid);
        query.first().then(function(results) {
            var url = "";
			if(results == null)console.log("bad request for ",tid);
			else console.log(results.get("json_url"),  results.get("tpl_fbstate"));
            if(results && results.get("json_url") && results.get("tpl_fbstate") != 1) {
                var jsonurl = results.get("json_url");
                if (isJsonObject(jsonurl)) {
                    jsonurl = JSON.parse(jsonurl);
                    var postfix = jsonurl.postfix || "";
                    url = "http://ac-hf3jpeco.clouddn.com/"+ jsonurl.key + postfix + "?" + Date.now();
                } else {
                    url = "http://ac-hf3jpeco.clouddn.com/" + jsonurl + ".json?" + Date.now();
                }
                return downloadJson(url,function(data){
					res.send(parseData(data));
					next();
				});
            }
        },function(error) {
            console.log('Error: ' + error.code + ' ' + error.message);
			res.send("data error");
			next();
        });

        function isJsonObject (str) {
            if(!str){
                return false;
            }else if(str.indexOf("{") == 0 && str.lastIndexOf("}") == str.length - 1){
                return true;
            }
            return false;
        }
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