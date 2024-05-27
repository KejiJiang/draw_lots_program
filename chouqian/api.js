const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const redis = require('redis');


const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'yoursqlsecret',
  database: 'chouqian'
})

connection.connect(err => {
  if (err) {
    console.error('failed to connect to database, error: ', err)
    process.exit(1)
  }
})

const app = express()
app.use(express.json())
app.use(express.static("./"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const redisClient = redis.createClient(6379, '127.0.0.1',)
redisClient.on('error', err => {
  console.log(err)
})

//登录功能
app.get('/login', function (req, res) {
  const thisaccount = req.query.account
  const thispassword = req.query.password
  const sql1 = "SELECT * FROM user_tbl WHERE username='" + thisaccount + "' AND password='" + thispassword + "';"
  connection.query(sql1, (err, result) => {
    if (result.length == 0 || err) {
      res.status(500).json("用户名或密码错误")
    }
    else {//查到该记录，登陆成功
      res.status(200).json(result)
    }
  })
})

//注册
app.post('/register', function (req, res) {
  const newphone = req.body.phone
  const newkey = req.body.password
  var vcode = req.body.vcode
  var vnow;
  redisClient.get('vcodenow', function (err, key) {
    vnow = key;
    if (vnow === null) {
      return res.status(500).json("验证码失效")
    } else if (vnow != vcode) {
      return res.status(500).json("验证码错误")
    }
    var newname = '';
    for (var i = 0; i < newphone.length; i++) {
      var o = String(newphone[i]);
      newname += String.fromCharCode(o.charCodeAt() + 49);
    }
    const sql1 = "INSERT INTO user_tbl ( username,password ) VALUES ( '" + newphone + "', '" + newkey + "');"
    connection.query(sql1, (err, result) => {
      if (err) {
        return res.status(500).json("注册失败")
      }
      res.status(200).json({
        status: 'success',
        data: newphone,
      })
    })
  });
})


//发送验证码功能
app.get('/getvcode', function (req, res) {
  var vnew = ""
  for (var i = 0; i < 4; i++) {
    var num = Math.round(Math.random() * 9);
    vnew += num;
  }
  console.log(vnew);
  redisClient.set('vcodenow', vnew, redis.print);
  setTimeout(() => {
    redisClient.del('vcodenow')
  }, 300000);
  return res.status(200).json(vnew);
})


// 新增抽签信息（总人数等），创建抽签时发送请求
app.post('/newinfo', function (req, res) {
  var theme = req.body.theme;
  var all = req.body.allnums;
  var get = req.body.getnums;
  var joins = req.body.joinnums;
  var owner = req.body.ownername;
  var rall = req.body.remainingall;
  var rward = req.body.remainingward;
  var status=req.body.status;
  const sql = 'INSERT INTO chouqian_tbl (theme,allnums,getnums,joinnums,ownername,remainingall,remainingward,status) VALUES ("' +
    theme + '","' + all + '","' + get + '","' + joins + '","' + owner + '","' + rall + '","' + rward +'","'+ status+'");'
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json("创建抽签失败")
    }
    res.status(201).json({ id: result.insertId})
  })
})


// 从后台获取抽取信息，参加时先发送请求，以及发起者刷新时发送请求
app.get('/information', function (req, res) {
  var thisid = req.query.id;
  const sql = 'select * from chouqian_tbl WHERE id="'+thisid+'";'
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json("获取抽签信息失败")
    }
    res.status(200).json(result);
  })
})

// 从后台获取抽取信息，当查看自己创建的抽签信息时调用
app.get('/myallchouqian', function (req, res) {
  var thisname = req.query.ownername;
  const sql = 'select * from chouqian_tbl WHERE ownername="'+thisname+'";'
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json("获取抽签信息失败")
    }
    res.status(200).json(result);
  })
})

//后台更新抽签信息（包括当前剩余签及签数），抽取后更新
app.put('/renewinfo', function (req, res) {
  var id=req.body.id;
  var theme=req.body.theme;
  var newjoin = req.body.joinnums;
  var newrall = req.body.remainingall;
  var newrward = req.body.remainingward;
  const sql1='use chouqian;'
  const sql2 = 'UPDATE chouqian_tbl SET joinnums="'+newjoin+'",remainingall="'+newrall+'",remainingward="'+newrward+'" WHERE id="'+id+'";'
  connection.query(sql1,(err,result)=>{
    if(err){
      return res.status(500).json("更新失败")
    }
  })
  connection.query(sql2, (err, result) => {
    if (err) {
      return res.status(500).json("更新抽签失败")
    }
    res.status(201).json("更新成功")
  })
})

//后台更新抽签信息（包括当前剩余签及签数），更新状态
app.put('/renewendinfo', function (req, res) {
  var id=req.body.id;
  var status=req.body.status;
  const sql1='use chouqian;'
  const sql2 = 'UPDATE chouqian_tbl SET status="'+status+'" WHERE id="'+id+'";'
  connection.query(sql1,(err,result)=>{
    if(err){
      return res.status(500).json("更新失败")
    }
  })
  connection.query(sql2, (err, result) => {
    if (err) {
      return res.status(500).json("更新状态失败")
    }
    res.status(201).json("结束抽签成功")
  })
})

const server = app.listen(8888, 'localhost', function () {
  const host = server.address().address
  const port = server.address().port
  console.log("Running server at http://%s:%s", host, port)
})