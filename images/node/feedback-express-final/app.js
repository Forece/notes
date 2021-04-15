var fs = require('fs')
var express = require('express')
var template = require('express-art-template')


var comments = [{
        name: '张三1',
        message: '你好',
        dateTime: '2021-04-05'
    },
    {
        name: '张三2',
        message: '你好',
        dateTime: '2021-04-05'
    },
    {
        name: '张三3',
        message: '你好',
        dateTime: '2021-04-05'
    }
]

function get_dateTime() {
    var d = new Date(),
        str = '';
    str += d.getFullYear() + '年'; //获取当前年份 
    str += d.getMonth() + 1 + '月'; //获取当前月份（0——11） 
    str += d.getDate() + '日';
    str += d.getHours() + '时';
    str += d.getMinutes() + '分';
    str += d.getSeconds() + '秒';
    return str;
}

var app = express()

app.get('/public/', express.static('./public/'))

app.get('/', function(req, res) {
    res.render('index.html', {
        comments: comments
    })
})

app.get('/post', function(req, res) {
    res.render('post.html')
})

app.get('/pinglun', function(req, res) {
    var comment = res.query
    comment.dateTime = get_dateTime()
    comments.unshift(comment) // 在数组头部添加数据
        // comments.push(comment)  // 在数组尾部添加数据
    res.redirect('/')
})

app.listen(3000, function() {
    console.log('Server is Running...')
})