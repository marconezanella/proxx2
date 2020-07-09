"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _teste_rotas = require("./teste_rotas");

var TesteRota = _interopRequireWildcard(_teste_rotas);

var _uteis = require("./uteis");

var Util = _interopRequireWildcard(_uteis);

var _eadJs = require("./ead.js");

var _eadJs2 = _interopRequireDefault(_eadJs);

var _checkoutJs = require("./checkout.js");

var _checkoutJs2 = _interopRequireDefault(_checkoutJs);

var _getsJs = require("./gets.js");

var _getsJs2 = _interopRequireDefault(_getsJs);

var _postsJs = require("./posts.js");

var _postsJs2 = _interopRequireDefault(_postsJs);

var fileUpload = require("express-fileupload");
var bodyParser = require("body-parser");
var fs = require("fs");
var http = require("http");
var https = require("https");
var cookieParser = require("cookie-parser");

var server = (0, _express2["default"])();
server.use(_express2["default"]["static"]("public"));
server.use(cookieParser());
var isdebug = process.argv[2] == "debug";
var querystring = require("querystring");
var request = require("request");
var html_erro = fs.readFileSync("./public-error/erro.html", "utf8");

var httpProxy = require("http-proxy");

var PORT = process.env.PORT || 5000;

var proxy = httpProxy.createProxyServer({});
var url = "https://api-site.1mk.digital";

var intervalo = null;

function notSleep(host) {
  intervalo = setInterval(function () {
    var options = {
      method: "GET",
      url: "https://" + host + "/ip"
    };
    request(options, function (error, response, body) {
      console.log(body, error, 3);
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

new _eadJs2["default"](server, url);
new _checkoutJs2["default"](server, url);
new _getsJs2["default"](server, url);
new _postsJs2["default"](server, url);

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

///
///
////
////RESTO
////
////
// server.get("/*", (req, res) => {
//   res.write(html_erro);
//   res.end();
// });
server.get("/*", function (req, res) {
  return res.redirect(302, "/home");
  // res.write(html_erro);
  // res.end();
});

server.post("/*", function (req, res) {
  res.send({ error: "Caminho não mapeado" });
});

//
////
////
////Certificados
////
///

if (isdebug || PORT !== 5000) {
  console.log("server: 5000", url);
  server.listen(PORT);
} else {
  // server.listen(5000);
  console.log = function () {};
  var greenlock = require("greenlock-express").create({
    server: "https://acme-v02.api.letsencrypt.org/directory",
    version: "draft-11",
    configDir: "~/.config/acme/",
    approveDomains: approveDomains,
    app: server,
    communityMember: true,
    renewWithin: 91 * 24 * 60 * 60 * 1000,
    renewBy: 90 * 24 * 60 * 60 * 1000,
    debug: false
  });
  // if (!process.env.PORT) {
  require("http").createServer(greenlock.middleware(require("redirect-https")())).listen(80, function () {
    console.log("Listening for ACME http-01 challenges on", this.address());
  });
  require("https").createServer(greenlock.httpsOptions, greenlock.middleware(server)).listen(443, function () {
    console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
  });
}
// }

function approveDomains(opts, certs, cb) {
  if (certs) {
    opts.domains = certs.altnames;
  } else {
    opts.email = "suporte@1app.com.br";
    opts.agreeTos = true;
  }

  cb(null, { options: opts, certs: certs });
}