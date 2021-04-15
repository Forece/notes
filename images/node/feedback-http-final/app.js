var fs = require('fs')
var http = require('http')
var template = require('art-template')
var url = require('url')


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

http.createServer(function(req, res) {
    var parseObj = url.parse(req.url)
    var pathName = parseObj.pathname
    if (pathName === '/') {
        fs.readFile('./views/index.html', function(err, data) {
            if (err) {
                res.end('404 NOT FOUND')
            }
            htmlStr = template.render(data.toString(), {
                comments: comments
            })
            res.end(htmlStr)
        })
    } else if (pathName.indexOf('/public/') === 0) {
        fs.readfile('.' + pathName, function(err, data) {
            if (err) {
                res.end('404 NOT FOUND')
            }
            res.end(data)
        })
    } else if (pathName === '/post') {
        fs.readfile('./views/post.html', function(err, data) {
            if (err) {
                res.end('404 NOT FOUND')
            }
            res.end(data)
        })
    } else if (pathName === '/pinglun') {
        var comment = parseObj.query
        comment.dateTime = get_dateTime()
        comments.unshift(comment) // 在数组头部添加数据
            // comments.push(comment)  // 在数组尾部添加数据
        res.statusCode = 302
        res.setHeader('location', '/')
        res.end()
    } else {
        fs.readfile('./views/404.html', function(err, data) {
            if (err) {
                res.end('404 NOT FOUND')
            }
            res.end(data)
        })
    }
}).listen(3000, function() {
    console.log('Server is Running...')
})