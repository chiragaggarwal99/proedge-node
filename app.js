const express = require('express');
const app = express();
var http = require('http');
const cors = require('cors');
var async = require('async');

const port = process.env.PORT || 3000;

app.use(cors());

function callAPI(tasks){
    return new Promise((resolve,reject) => {
        async.parallel(tasks, function(err, obj) {
            resolve(obj);
        });
    });
}

app.get('/result/:rollnos', async (req,res)=>{
    var rollNos = req.params.rollnos.split(',');

    var results = [];

    for(var i=0;i<rollNos.length;i+=5){
        var tasks = {};
        for(var j=i;j<i+5 && j<rollNos.length;j++){
            tasks[rollNos[j]] = function(callback) {
                http.get('http://proedge.me/test.php?rollnumber='+rollNos[j], function(res) {
                    res.setEncoding('utf8');
                    res.on('data', function (data) { 
                        callback(null, data);
                    });
                }).end();
            }
        }
        var obj = await callAPI(tasks);
        for(var id in obj){
            results.push({
                rollNo: id,
                result: obj[id]
            });
        }
    }

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(results));
});

app.listen(port, ()=> console.log("Node API started."));
