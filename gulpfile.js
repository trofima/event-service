'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jasmine = require('gulp-jasmine');

function throwPluginError(err){
    console.error('ERROR:\nplugin %s has thrown an error: %s', err.plugin, err.message);
    process.exit(1);
}

function compileTs(){
    const tsProject = ts.createProject('tsconfig.json');

    tsProject
        .src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest('./'));
}

function minimifyJs() {
    gulp.src('app/src/**/*.js')
        .pipe(concat('eventService.min.js').on('error', throwPluginError))
        .pipe(uglify().on('error', throwPluginError))
        .pipe(gulp.dest('app/target/'));
}

function test(){
    gulp.src('app/spec/**/*.spec.js')
        .pipe(jasmine().on('error', throwPluginError))
}

gulp
    .task('compile-ts', compileTs)
    .task('build-js', ['compile-ts'], minimifyJs)
    .task('test', ['compile-ts'], test)

    .task('default', ['build-js']);
