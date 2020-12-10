const express = require('express');
const app = express();
var http = require('http');
const cors = require('cors');
var async = require('async');

const port = process.env.PORT || 3000;

app.use(cors());

app.get('/result/:rollnos', async (req,res)=>{
    var rollNos = req.params.rollnos.split(',');
    var tasks = {};
    
    rollNos.forEach(rollNo => {
        tasks[rollNo] = function(callback) {
            http.get('http://proedge.me/test.php?rollnumber='+rollNo, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (data) { 
                    callback(null, data);
                });
            }).end();
          }
    })
    
    async.parallel(tasks, function(err, obj) {
        results = [];
        for(var id in obj){
            results.push({
                rollNo: id,
                result: obj[id]
            });
        }
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(results));
      });
});

app.listen(port, ()=> console.log("Node API started."));
