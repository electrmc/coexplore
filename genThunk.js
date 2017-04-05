'use strict'
var fs = require('fs');
var thunkify = require('thunkify');

function *read () {
    console.log('start');
    var r1 = yield thunkRead('./file/file1.txt','utf8');
    console.log('r1 : ',r1);
    var r2 = yield thunkRead('./file/file2.txt','utf8');
    console.log('r2 : ',r2);
}

var thunkRead = thunkify(fs.readFile);

// 手动执行generator + thunk 函数
// 下面代码发现，要执行的仅是在callback中把程序执行权交给generator
var rd = read();
rd.next().value((err,data) => {
    rd.next(data).value((err,data) => {
        rd.next(data);
    });
});

// 根据thunk函数的generator自动执行器模型
function run (fn) {
    var gen = fn();
    function continueX(err,data){
        var result = gen.next(data);
        if (result.done) return;
        result.value(continueX);
    }
    continueX();
}
run(read);