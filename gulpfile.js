var gulp = require('gulp');
//var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var fs = require("fs");
var each = require("gulp-foreach");
var babel = require('gulp-babel');
var webpack = require('gulp-webpack');
var watch=require("gulp-watch");
var rename = require("gulp-rename");
const exec = require('child_process').exec;

var dest_dir = "dist";
var obfuscate_tag = true;
var zip_tag = true;
var source_set = null;
jsx = ["src/MeVPads.js",
	"src/components/MePage.js",
	"src/components/MeAnimation.js",
	"src/components/MeTouchTrigger.js",
	"src/components/MeToolBar.js",
	"src/components/MeMusic.js",
	"src/components/MePanArea.js",
	"src/components/MeSvg.js",
	"samples/mag_1.jsx",
	"samples/mag_2.jsx",
	"samples/mag_page_test.jsx",
	"index.js"
];
gulp.task("babel", function(){
	return gulp.src(jsx).
        pipe(babel({
            plugins: ['transform-react-jsx']
        })).
        pipe(gulp.dest("dist"));
});

gulp.task("pack",["babel"],function(){
	return gulp.src("dist/index.js")
	.pipe(webpack(require("./webpack.config.js")))
	.pipe(gulp.dest("lib"));
});

gulp.task("default",["pack"],function(){
//	watch('src/**/**',['pack']);
//	watch('samples/**',function(){
//		gulp.start('pack')
//	})

});

