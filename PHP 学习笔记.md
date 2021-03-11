?? 运算符由三元运算符进化而来

**(expr1) ? (expr2) : (expr3) **

表达式 (expr1) ? (expr2) : (expr3) 在 expr1 求值为 TRUE 时的值为 expr2，在 expr1 求值为 FALSE 时的值为 expr3。

其中false的值的判断跟 if (expr1)一样，包括空字符串 ''   false   为空empty    null   0   0.0  ‘0’



例子

```$a = $a ? $a : 1;```



**(expr1) ? :(expr2)**   

> 这个是php5.3开始才有的功能

在 expr1 求值为 TRUE 时返回 expr1，否则返回 expr2。



例子

```$a = $a ?: 1;```
它等价于1的例子

 

**(expr1) ? ？(expr2)**  

> 这个是php7才有的功能

它等价于  `$a = isset(expr1) ? expr1 :  expr2`

`$b = isset($a) ? $a : 1;`