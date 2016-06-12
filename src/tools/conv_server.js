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
	try{
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
	}catch(e){
		cb(null);
	}
}


function kickoffConvert(tpl,jsonData,cb){
	var jsStatement = "(function(){return " + jsonData + ";})();";
	var jsonData = null;
	try{
		jsonData = eval(jsStatement);
	}catch(e){
		console.log("json文件不能解释");
		cb(null);
	}
	if(jsonData == null) console.log("数据错误");
	convFunc(tpl,jsonData,function(data){
		if(data != null){
			cb(babel.transform(data, {
				plugins: ["transform-react-jsx"],
				compact:false
			}).code);
		}
	});
}
function convertEntry(req,res,next){
	try{
		console.log(req.query.mag);
		if(req.query.tid != null){
			downloadArticleWithTid(res,req.query.tid,next);
		}
		if(req.query.mag != null){
			return downloadJson((decodeURI(req.query.mag)),function(data){
				parseData(data,function(_js){
					res.send(_js);
					next();
				});
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

function parseData(data,cb){
	if(data == null){
		cb(null);
	}else{
		kickoffConvert(tpl,data,cb);
		return;
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
            //之前处理的时候遇到是表单的情况不去获取静态文件，results.get("tpl_fbstate") != 1 ，由于再次更改数据的时候不会去保存静态文件
            if(results && results.get("json_url")) {
                var jsonurl = results.get("json_url");
                if (isJsonObject(jsonurl)) {
                    jsonurl = JSON.parse(jsonurl);
                    var postfix = jsonurl.postfix || "";
                    url = "http://ac-hf3jpeco.clouddn.com/"+ jsonurl.key + postfix + "?" + Date.now();
                } else {
                    url = "http://ac-hf3jpeco.clouddn.com/" + jsonurl + ".json?" + Date.now();
                }
                return downloadJson(url,function(data){
					parseData(data,function(_js){
						if(_js == null){
							res.send(tid + "作品解析错误");
						}else{
							res.send(_js);
						}
						next();
					});
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


process.on('uncaughtException', function (err) {
    console.log(err);
});

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