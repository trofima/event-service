'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jasmine = require('gulp-jasmine');

function throwPluginError(err){
    console.error('ERROR:\nplugin %s has thrown an error: %s', err.plugin, err.message);

    return process.exit(1);
}

function compileTs(){
    const tsProject = ts.createProject('tsconfig.json');

    return tsProject
        .src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest('./compiled'));
}

function minJs() {
    return gulp.src('./compiled/src/**/*.js')
        .pipe(concat('eventService.min.js')
            .on('error', throwPluginError))
        .pipe(uglify()
            .on('error', throwPluginError))
        .pipe(gulp.dest('./dist/'));
}

function declareTs() {
    return gulp.src('./src/**/*.ts')
        .pipe(ts({
            declaration: true
        })).dts.pipe(gulp.dest('./dist/'));
}

function test(){
    return gulp.src('./compiled/spec/**/*.spec.js')
        .pipe(jasmine().on('error', throwPluginError))
}

gulp
    .task('compile-ts', compileTs)
    .task('build-js', ['compile-ts'], minJs)
    .task('declare-ts', declareTs)

    .task('test', ['compile-ts'], test)

    .task('default', ['build-js', 'declare-ts']);
