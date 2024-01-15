require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverload } = require("./helpers/check.connect");
const app = express();

// init middleware
app.use(morgan("dev"));
/* 
 * morgan('dev')
 - tra ve theo chuan dev (bat trong moi truong development)
  + GET / 200 3.417 ms - 26
 * morgan("combined")
 - tra ve theo chuan apache (bat trong moi truong production)
  + ::ffff:127.0.0.1 - - [29/Dec/2023:08:03:48 +0000] "GET / HTTP/1.1" 200 26 "-" "curl/7.81.0"
 * morgan("common")
 - tra ve theo chuan apache (bat trong moi truong production)
  + ::ffff:127.0.0.1 - - [29/Dec/2023:08:04:13 +0000] "GET / HTTP/1.1" 200 26
 * morgan("short")
  + ::ffff:127.0.0.1 - GET / HTTP/1.1 200 26 - 1.585 ms
 * morgan("tiny")
  + GET / 200 26 - 1.483 ms
*/
app.use(helmet());

/* khi su dung curl http://localhost:3055 --include sẽ biết công nghệ sử dụng là gì ví dụ như express... từ đó kiếm lỗ hổng của famework 
mình sử dụng.
- sử dụng helmet để bảo mật ứng dụng  ko cho bên thứ 3 biết được công nghệ sử dụng
*/

app.use(compression());
/* 
- "compression" có thể đề cập đến một middleware của Node.js giúp nén các phản hồi HTTP.
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//init db
require("./dbs/init.mongodb");
// checkOverload();

// init routes

app.use("/", require("./routes"));

// handle errors

module.exports = app;
