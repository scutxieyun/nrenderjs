var express = require('express');
var fs = require('fs');
var convFunc = require('./json2jsx.js');
var http = require('http');
var _ = require("underscore");
var babel = require("babel-core");
var AV = require("avoscloud-sdk");
var bodyParser = require("body-parser");

var server = express();
server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

var tpl = (fs.readFileSync('./src/tools/mag_template.js', {encoding: 'utf8', flag: 'r'}));
if (tpl == null) {
    console.log("read tpl file error");
    return;
}


function downloadJson(url, cb) {
    var jsonData = "";
    console.log("request get", url);
    try {
        http.get(url, function (res) {
            res.on("data", function (data) {
                jsonData = jsonData + data;
                //console.log(data);
            })
                .on("end", function () {
                    cb(jsonData);
                })
                .on("error", function () {
                    cb(null);
                });
            ;
        });
    } catch (e) {
        cb(null);
    }
}


/**
 * json字符串转对象
 * @since ver 1.0
 * @param {object} json 待转换的json字符串
 * @returns {object} 转换后的对象
 */
function json2object(json) {
    // 类型为对象时，不转换
    if (typeof(json) === "object") {
        return json;
    }
    // 其他情况，转为对象
    else {
        try {
            return JSON.parse(json);
        } catch (err) {
            return json;
        }
    }
}

function kickoffConvert(tpl, jsonData, cb) {
    var jsStatement = "(function(){return " + jsonData + ";})();";
    var jsonData = null;
    try {
        jsonData = eval(jsStatement);
    } catch (e) {
        console.log("json文件不能解释");
        cb(null);
    }
    if (jsonData == null) console.log("数据错误");
    convFunc(tpl, jsonData, function (data) {
        if (data != null) {
            cb(babel.transform(data, {
                plugins: ["transform-react-jsx"],
                compact: false
            }).code);
        }
    });
}
function convertEntry(req, res, next) {
    try {
        console.log(req.query.mag, req.query);
        if (req.query.tid != null && req.query.fmawr != null) {
            downloadArticleWithTid(res, req.query.tid, req.query.fmawr, next);
        }
        if (req.query.mag != null) {
            return downloadJson((decodeURI(req.query.mag)), function (data) {
                parseData(data, function (_js) {
                    res.send(_js);
                    next();
                });
            });
        }
    }
    catch (e) {
        console.log(e);
        res.send(e);
        next();
    }
    //next();
}
function convertJsonData(req, res, next) {
    // 将json字符串转为对象
    var body = req.body;
    //接收的地方为json string
    body = JSON.stringify(body);
    parseData(body,function(_js){
        res.send(_js);
        next();
    });
}

function parseData(data, cb) {
    if (data == null) {
        cb(null);
    } else {
        kickoffConvert(tpl, data, cb);
        return;
    }
}

function downloadArticleWithTid(res, tid, fmawr, next) {
    if (fmawr == "999") {
        //正式服
        AV.initialize("hf3jpecovudrg8t7phw3xbt1osqfrmfhnwu22xs8jo1ia3hn", "b9nndoind1e7tjrhj7owyg4m55d9uyymcqprklb5w9qxo9rr");  //正式服获取数据
        var fileUrlConf = "http://ac-hf3jpeco.clouddn.com/";    //正式服的jsonurl域名
    } else {
        //测试服
        AV.initialize("syrskc2gecvz24qjemgzqk8me6yenon2layp11tdnskosxg9", "c56r8qz274bct8jlb924v2b05xaysxytfmt2ff0vfgulmks7");  //测试服获取数据
        var fileUrlConf = "http://ac-syrskc2g.clouddn.com/";    //测试服的jsonurl域名
    }
    var query = new AV.Query('tplobj');
    query.equalTo('tpl_id', tid);
    query.first().then(function (results) {
        var url = "";
        if (results == null)console.log("bad request for ", tid);
        else console.log(results.get("json_url"), results.get("tpl_fbstate"));
        //之前处理的时候遇到是表单的情况不去获取静态文件，results.get("tpl_fbstate") != 1 ，由于再次更改数据的时候不会去保存静态文件
        if (results && results.get("json_url")) {
            var jsonurl = results.get("json_url");
            if (isJsonObject(jsonurl)) {
                jsonurl = JSON.parse(jsonurl);
                var postfix = jsonurl.postfix || "";
                url = fileUrlConf + jsonurl.key + postfix + "?" + Date.now();
            } else {
                url = fileUrlConf + jsonurl + ".json?" + Date.now();
            }
            return downloadJson(url, function (data) {
                parseData(data, function (_js) {
                    if (_js == null) {
                        res.send(tid + "作品解析错误");
                    } else {
                        res.send(_js);
                    }
                    next();
                });
            });
        }
    }, function (error) {
        console.log('Error: ' + error.code + ' ' + error.message);
        res.send("data error");
        next();
    });

    function isJsonObject(str) {
        if (!str) {
            return false;
        } else if (str.indexOf("{") == 0 && str.lastIndexOf("}") == str.length - 1) {
            return true;
        }
        return false;
    }
}
// 注册功能模块
server.get('/jsx', convertEntry);
server.get('/test', function (req, res) {
    res.send("asdfdfsd");
});
server.post('/jsx', convertJsonData);


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