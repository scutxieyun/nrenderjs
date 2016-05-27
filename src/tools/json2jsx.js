var _ = require("underscore");
var fs = require('fs');
var process = require('process');
var url = require('url');  
var http = require('http')

function main(tpl,mag){
var MePageT = _.template("<MePage idx={<%= idx %>} cxt={cxt} >\n<%= children%>\n</MePage>");
var NoTypeDefinedT = _.template('<div cxt={cxt} style={{<%= style%>}}> No Such Type defined <%= item_type %></div>');
var posStyleTemplate = _.template('top:"<%= item_top%>px",left:"<%= item_left%>px",zIndex:<%= item_layer%>');
var sizeStyleTemplate = _.template('height:"<%= item_height%>px",width:"<%= item_width%>px",position:"absolute"');
var fontStyleTemplate = _.template('fontSize:"<%= font_size%>", color:"<%= item_color%>",fontFamily:"<%= font_family %>"');
var imgTemplate = _.template('<img src="<%= src%>" style={{<%= style %>}}></img>');
var divTemplate = _.template('<div style={{<%= style %>}}><%= content%></div>')
var animationTemplate = _.template('<MeAnimation pageIdx={<%= pageIdx %>} cxt={cxt} animationClass="<%= animationClass%>" animation={<%= animation%>} normalStyle={{<%= normalStyle%>}}><%= children %></MeAnimation>')	

var itemFuncMap = {
	"1":imgRenderItem,
	"2":textRenderItem,
	"3":imgRenderItem,
	"18":imgRenderItem,
};

var gId = 0;

var defaultAnimation = 	'{animationIterationCount:"1",animationDelay:"0s",animationDuration:"1s"}';


	var index = [];
	index.push(-1);
	var pageContent = [];
	var pages = mag.pages;
 	for(var i = 0;i < pages.length;i ++){
		pages[i].idx = i;
		pageContent.push(renderPage(pages[i]));
		index.push(i);
	}
	index.push(-1);
	return (_.template(tpl))({pages:pageContent.join(","),layout:index.toString(),music_src:mag.tpl_music});
function renderPage(page){
	var items = [];
	for(var i = 0;i < page.item_object.length;i ++){
		items.push(renderItem(page,page.item_object[i]));
	}
	page.children = items.join("\n");
	return (MePageT(page) + "\n");
}

function noTypeDefined(page,item){
	var _style = [posStyleTemplate(item),sizeStyleTemplate(item)];
	return NoTypeDefinedT({item_type:item.item_type,style:_style});
}

function imgRenderItem(page,item){
	var _style = [posStyleTemplate(item),sizeStyleTemplate(item)];
	var otherStyle = [];
	if(item.item_opacity != 100){}
	
	if(item.item_animation == null || item.item_animation === "" || item.item_animation === "none"){
		return imgTemplate({src:item.item_val,style:_style.join(",")});
	}else{
		var animation = item.item_animation_val != "" ? item.item_animation_val
				.replace(/delay/,"animationDelay")
				.replace(/duration/,"animationDuration")
				.replace(/infinite/,"animationIterationCount") : defaultAnimation;
		children = imgTemplate({src:item.item_val,style:""})
		return animationTemplate({animationClass:item.item_animation,
								  chilren:children,
								  animation:animation,
								  normalStyle:_style.join(","),
								  pageIdx:page.idx,
								  id:gId ++});
	}
}

function textRenderItem(page,item){
	var _style = [posStyleTemplate(item),sizeStyleTemplate(item)];
	if(item.item_opacity != 100){}
	if(item.item_animation == null || item.item_animation === "" || item.item_animation === "none"){
		_stype.push(fontStyleTemplate(item));
		return divTemplate({content:item.item_val,style:_style.join(",")});
	}else{
		var animation = item.item_animation_val != "" ? item.item_animation_val
				.replace(/delay/,"animationDelay")
				.replace(/duration/,"animationDuration")
				.replace(/infinite/,"animationIterationCount") : defaultAnimation;
		children = divTemplate({content:item.item_val,style:fontStyleTemplate(item)});
		return animationTemplate({animationClass:item.item_animation,
								  chilren:children,
								  animation:animation,
								  normalStyle:_style.join(","),
								  pageIdx:page.idx,
								  id:gId ++});
	}
}
function renderItem(page,item){

	var funcKey = item.item_type.toString();
	item.pageIdx = page.idx;
	if(itemFuncMap[funcKey] != undefined ){
		return itemFuncMap[funcKey](page,item);
	}
	return noTypeDefined(page,item);
}
	
	
}

module.exports = main;



