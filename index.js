// import {add,sub} from './math-utils.js';
// console.log("1st node");
// console.log(add(12,13));
// console.log(sub(10,348));

const http=require("http");
const server=http.createServer((req,res)=>{
    res.writeHead(200,{'content-type':'text/plain'});
    res.end('Hello!');
})

server.listen(3000,()=>{
    console.log("running");
})
const chalk=require("chalk");
console.log(chalk.blue("Hi"));
console.log(chalk.red("Error!"));

const fs=require("fs");
const { connect } = require("http2");
fs.readFile('file.txt','utf-8',(err,data)=>{
    if(err)
        console.error("Error reading",err);
    console.log("File content:",data);
})
fs.writeFile('file.txt','hello',(e)=>{
    console.log("Error",e);
    console.log("Done");
})

console.log("EVENT LOOP");
setTimeout(()=>{
    console.log("Timeout Executed");
},2000)
setTimeout(()=>{
    console.log("time executed 2");
},300)

console.log("Event ended");