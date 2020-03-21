"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _teste_rotas = require("./teste_rotas");

var TesteRota = _interopRequireWildcard(_teste_rotas);

var express = require("express");
var fileUpload = require("express-fileupload");
var bodyParser = require("body-parser");
var fs = require("fs");
var html_erro = fs.readFileSync("./public-error/erro.html", "utf8");
var Gets = require("./gets.js");
var PORT = process.env.PORT || 5000;
var cookieParser = require("cookie-parser");

var server = express();
server.use(express["static"]("public"));
server.use(cookieParser());
var url = "https://api-site.1mk.digital";

var intervalo = null;

function notSleep(host) {
  intervalo = setInterval(function () {
    var options = {
      method: "GET",
      url: "https://" + host + "/ip"
    };
    request(options, function (error, response, body) {
      console.log(body, error);
    });
  }, 1000 * 60 * 14);
}

server.get("/start", function (req, res) {
  notSleep(req.headers.host);
  res.send("start setInterval host: " + req.headers.host);
});
server.get("/end", function (req, res) {
  clearInterval(intervalo);
  res.send("end setInterval host: " + req.headers.host);
});
server.use(fileUpload({
  limits: {
    fileSize: 50 * 1024 * 1024 * 10,
    safeFileNames: true
  }
}));
server.use(bodyParser({
  limit: "50mb"
}));

server.use("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "x-request-id,Content-Type,Accept,token-user");
  return next();
});

server.get("/teste-ip", function (req, res) {
  res.send({
    cidade: TesteRota.getCidade(req),
    ip: req.ip,
    // header: req.headers,
    remoteAddress: req.connection.remoteAddress
  });
});

server.get("/robots.txt", function (req, res) {
  var dominio = req.query.dominio;
  //   dominio = "cx-sed.club";
  if (!dominio) dominio = req.host;
  var data = "User-Agent: *\n";
  data += "Disallow:\n\n";
  data += "Sitemap: https://" + dominio + "/site_map.xml";
  res.set("Content-Type", "text/txt");
  res.send(data);
});

server.get("/manifest.json", function (req, res) {
  var data = {
    name: "Site Pessoal",
    short_name: "Blog",
    start_url: ".",
    display: "standalone",
    background_color: "#fff",
    description: "Blog"
  };
  res.send(data);
});

server.get("/site_map.xml", function (req, res) {
  var dominio = req.host;
  var url_back = url + "/site_map.xml?dominio=" + encodeURI(dominio);
  //   url_back = "http://localhost:5000";
  var data = {
    url: url_back,
    method: "GET"
  };
  //   console.log(data);
  request(data, function (error, response, body) {
    if (error || response.statusCode != 200) {
      res.status(500).send(body);
      //   console.log(body);
    } else {
        res.set("Content-Type", "text/xml");
        res.send(body);
      }
  });
});

new Gets(server, url);

server.listen(PORT);