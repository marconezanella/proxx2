import express from "express";
var fileUpload = require("express-fileupload");
var bodyParser = require("body-parser");
var fs = require("fs");
var http = require("http");
var https = require("https");
var cookieParser = require("cookie-parser");
import * as TesteRota from "./teste_rotas";
var server = express();
server.use(express.static("public"));
server.use(cookieParser());
let isdebug=process.argv[2] == "debug";
var querystring = require("querystring");
var request = require("request");
var html_erro = fs.readFileSync("./public-error/erro.html", "utf8");
import * as Util from "./uteis";
var httpProxy = require("http-proxy");
import Ead from "./ead.js";
import Checkout from "./checkout.js";
import Gets from "./gets.js";
import Posts from "./posts.js";
const PORT = process.env.PORT || 5000;

var proxy = httpProxy.createProxyServer({});
var url = "https://api-site.1mk.digital";

let intervalo = null;

function notSleep(host) {
  intervalo = setInterval(() => {
    var options = {
      method: "GET",
      url: "https://" + host + "/ip"
    };
    request(options, (error, response, body) => {
      console.log(body, error);
    });
  }, 1000 * 60 * 14);
}

server.get("/start", function(req, res) {
  notSleep(req.headers.host);
  res.send("start setInterval host: " + req.headers.host);
});
server.get("/end", function(req, res) {
  clearInterval(intervalo);
  res.send("end setInterval host: " + req.headers.host);
});

server.use(
  fileUpload({
    limits: {
      fileSize: 50 * 1024 * 1024 * 10,
      safeFileNames: true
    }
  })
);
server.use(
  bodyParser({
    limit: "50mb"
  })
);

server.use("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-request-id,Content-Type,Accept,token-user"
  );
  return next();
});

server.get("/teste-ip", function(req, res) {
  res.send({
    cidade: TesteRota.getCidade(req),
    ip: req.ip,
    // header: req.headers,
    remoteAddress: req.connection.remoteAddress
  });
});

server.get("/robots.txt", (req, res) => {
  var dominio = req.query.dominio;
  //   dominio = "cx-sed.club";
  if (!dominio) dominio = req.host;
  var data = "User-Agent: *\n";
  data += "Disallow:\n\n";
  data += "Sitemap: https://" + dominio + "/site_map.xml";
  res.set("Content-Type", "text/txt");
  res.send(data);
});

server.get("/manifest.json", (req, res) => {
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

new Ead(server, url);
new Checkout(server, url);
new Gets(server, url);
new Posts(server, url);

server.get("/site_map.xml", (req, res) => {
  var dominio = req.host;
  var url_back = url + "/site_map.xml?dominio=" + encodeURI(dominio);
  //   url_back = "http://localhost:5000";
  var data = {
    url: url_back,
    method: "GET"
  };
  //   console.log(data);
  request(data, function(error, response, body) {
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
server.get("/*", (req, res) => {
  res.write(html_erro);
  res.end();
});

server.post("/*", (req, res) => {
  res.send({ error: "Caminho não mapeado" });
});

//
////
////
////Certificados
////
///

if (isdebug) {
  console.log("server: 5000", url);
  server.listen(PORT);
} else {
  // server.listen(5000);
  console.log = () => {};
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
    require("http")
      .createServer(greenlock.middleware(require("redirect-https")()))
      .listen(80, function() {
        console.log("Listening for ACME http-01 challenges on", this.address());
      });
    require("https")
      .createServer(greenlock.httpsOptions, greenlock.middleware(server))
      .listen(443, function() {
        console.log(
          "Listening for ACME tls-sni-01 challenges and serve app on",
          this.address()
        );
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
