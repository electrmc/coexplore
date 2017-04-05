'use strict'
var fs = require('fs');
// generator 异步执行的核心就是将callback移到generator外面，并在callback中调用g.next()
// 此处是把fs.readfile方法包装成promise对象。promise的resolve中执行g.next()
function readFile (filename) {
    return new Promise((resolve,reject) => {
        fs.readFile(filename,'utf8',(err,data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

function * gen () {
    console.log('start');
    var r1 = yield readFile('./file/file1.txt');
    console.log('r1 : ',r1);
    var r2 = yield readFile('./file/file2.txt');
    console.log('r2 : ',r2);
}

var g = gen();
g.next().value.then((data) => {
    g.next(data).value.then((data) => {
        g.next(data);
    });
});


// promise写一个自动执行器
function run (fn) {
    var gen = fn();
    function continueX(data) {
        var result = gen.next(data);
        if (result.done) return;
        gen.next().value.then(continueX);
    }
    continueX();
}

run(gen);

