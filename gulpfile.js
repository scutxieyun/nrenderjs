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
var gulpSequence = require('gulp-sequence');

var dest_dir = "dist";
var obfuscate_tag = true;
var zip_tag = true;
var source_set = null;
jsx = ["src/MeVPads.js",
    "src/components/*.js",
    "src/inner_components/*.js",
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

gulp.task("concat", function(){
    return gulp.src(["lib/renderjs.js", "lib/comment.min.js"])
        .pipe(concat("render.js"))
        .pipe(uglify())
        .pipe(gulp.dest("lib"));
});

gulp.task('release', gulpSequence('pack', ['concat']));

gulp.task("default",["pack"],function(){

	watch(['samples/**','src/**'],function(){
		gulp.start('pack')
	})




});

