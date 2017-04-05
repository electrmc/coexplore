'use strict'

var fs = require('fs');
var co = require('co');
var thunkify = require('thunkify');
 
/*
 * co是一个generator函数的自动执行器
 */

/*
 * co 执行thunk函数
 * 1，先把异步方法包装成thunk方法
 * 2，由包装后的thunk方法写成generator
 */ 
var thunkread = thunkify(fs.readFile);
function * genread() {
    console.log('start');
    var r1 = yield thunkread('./file/file1.txt','utf8');
    console.log('r1 : ',r1);
    var r2 = yield thunkread('./file/file1.txt','utf8');
    console.log('r2 : ',r2);
    console.log('end');
}
co(genread);

/*
 * co 执行promise函数
 * 1，先把异步方法包装成promise方法
 * 2，由包装后的promise方法组成generator
 */ 
var promiseread = function(filename){
    return new Promise((resolve,reject)=>{
        fs.readFile(filename,'utf8',(err,data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}
function * genread2 () {
    console.log('start');
    var r1 = yield promiseread('./file/file1.txt');
    console.log('r1 : ',r1);
    var r2 = yield promiseread('./file/file1.txt');
    console.log('r2 : ',r2);
    console.log('end');
}
co(genread2);