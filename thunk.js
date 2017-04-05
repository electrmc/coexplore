'use strict'
var fs  = require('fs');
var thunkify = require('thunkify');

// thunk函数的模型的和兴是把callback和其他参数分开
function thunkReadFile(filename){
    return (cb) => {
        fs.readFile(filename,'utf8',cb);
    }
}
var myRead = thunkReadFile('./file/file1.txt');
myRead((err,data) => {
    if (err) throw err;
    console.log('my simple thunk : ',data);
});

// ES6版本的Thunk
var Thunk = function(fn){
    return function(...args) {
        return function(cb) {
            fn.call(this,...args,cb);
        }
    }
}
var es6Read = Thunk(fs.readFile);
es6Read('./file/file1.txt','utf8')((err,data)=>{
    if (err) throw err;
    console.log('es6 thunk : ',data);
})

// thunkify 版本
var thunkifyRead = thunkify(fs.readFile);
thunkReadFile('./file/file1.txt','utf8')((err,data) => {
    if (err) throw err;
    console.log('thunkify : ',data);
});


