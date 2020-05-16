"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _testeDestino = require("./testeDestino");

var testeDestinoVendas = _interopRequireWildcard(_testeDestino);

var _rotas = require("./rotas");

var rotas = _interopRequireWildcard(_rotas);

var http = require("http");
var https = require("https");
var httpProxy = require("http-proxy");
var proxy = httpProxy.createProxyServer({});

var querystring = require("querystring");
var url = require("url");
var request = require("request");

// docker run -d -it -p 80:2368 -e url=http://psique.wiki.br/ ghost
// docker run -d -it -p 3000:2368 -e url=http://psique.wiki.br/ edipaulo/blog-temp
// docker run -it --net=host -v /home/core/data:/etc/letsencrypt/  edipaulo/blog-job:v5 /bin/bash
// docker run -it --net=host -v /home/core/data:/etc/letsencrypt/  edipaulo/blog-job /bin/bash
// docker run -it --net=host -d  -v /home/core/data:/etc/letsencrypt  edipaulo/blog-job:v7  node out/proxy.js
// http://psique.wiki.br/get-rotas?origen=os-beneficios-de-dormir-com-muitas-mulheres&destino=https://mk.1app.com.br/k/kpCjK
//http://psique.wiki.br/get-rotas?origen=mulher-no-controle&destino=https://mk.1app.com.br/page/147/p&tipo=teste
//versoa blog
// docker commit 531a25b384ba temp
// docker tag temp edipaulo/blog-temp:v4
// docker push edipaulo/blog-temp:v4

function redirectPage(res, destino) {
  //   console.log("\nredirect", destino);
  //   res.redirect(destino);
  request(destino.redirect, function (error, response, body) {
    // console.log("error:", error); // Print the error if one occurred
    // console.log("body:", body); // Print the HTML for the Google homepage.
    res.write(body);
    // res.writeHead(302, { Location: destino });
    res.end();
  });
}
function redirect(res, destino) {
  res.writeHead(302, { Location: destino.redirect });
  res.end();
}

function mostrarRotas(res) {
  var data = rotas.carregarFile();
  res.setHeader("Content-Type", "application/json");
  var exemplo = "http://psique.wiki.br/get-rotas?origen= &destino= &tipo=direto/teste";
  res.write("" + JSON.stringify(data, undefined, 4) + "\n" + exemplo);
  res.end();
}

function testarDestino(req, res) {
  //   console.log(req.url);
  var destino = rotas.getRota(req);
  var myURL = url.parse(req.url);
  if (myURL.pathname == "/get-rotas") return mostrarRotas(res);

  if (destino && destino.redirect) {
    if (destino.tipo == "direto") return redirectPage(res, destino);
    if (destino.tipo == "redirect") return redirect(res, destino);
    testeDestinoVendas.verPaginaDeVendas(req, function (confirma, error) {
      console.log(confirma, error);
      if (confirma) {
        redirectPage(res, destino);
      } else {
        proxy.web(req, res, { target: "http://localhost:3000" });
      }
    });
  } else {
    proxy.web(req, res, { target: "http://localhost:3000" });
  }
}

var httpServer = http.createServer(function (req, res) {
  testarDestino(req, res);
});
//  -v /home/core/data:/etc/letsencrypt/live
var uri = "/etc/letsencrypt/live/psique.wiki.br";
if (_fs2["default"].existsSync(uri + "/privkey.pem")) {
  //add certificado
  var privateKey = _fs2["default"].readFileSync(uri + "/privkey.pem", "utf8");
  var certificate = _fs2["default"].readFileSync(uri + "/fullchain.pem", "utf8");
  var credentials = { key: privateKey, cert: certificate };

  var httpsServer = https.createServer(credentials, function (req, res) {
    testarDestino(req, res);
  });
}

httpServer.listen(80);
if (_fs2["default"].existsSync(uri + "/privkey.pem")) httpsServer.listen(443);
// console.log("online");

// function mostrarPagina(res) {
//   fs.readFile("venda.htm", function(err, data) {
//     res.writeHead(200, { "Content-Type": "text/html", "Content-Length": data.length });
//     res.write(data);
//     res.end();
//   });
// }