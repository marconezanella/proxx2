"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _uteis = require("./uteis");

var Util = _interopRequireWildcard(_uteis);

var _teste_rotas = require("./teste_rotas");

var TesteRota = _interopRequireWildcard(_teste_rotas);

var request = require("request");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var url = require("url");
var querystring = require("querystring");

var html_erro = fs.readFileSync("./public-error/erro.html", "utf8");

var Router = function Router(server, url_api) {
  _classCallCheck(this, Router);

  ///
  ///
  ///
  server.get("/*.css", function (req, res) {
    res.status(500).send('nao');
  });
  server.get("/*.html", function (req, res) {
    res.status(500).send('nao');
  });
  server.get("/*.js", function (req, res) {
    res.status(500).send('nao');
  });
  server.get("/*.ico", function (req, res) {
    res.status(500).send('nao');
  });
  server.get("/*.png", function (req, res) {
    res.status(500).send('nao');
  });
  server.get("/*.json", function (req, res) {
    res.status(500).send('nao');
  });
  server.get("/*.jpeg", function (req, res) {
    res.status(500).send('nao');
  });
  server.get("/*.jpg", function (req, res) {
    res.status(500).send('nao');
  });

  ////
  //// DINAMICOS
  ////

  server.get("/", function (req, res) {
    var caminho = req.params.caminho;
    console.log("caminho");
    var host = req.headers.host;
    if (!caminho) caminho = "home";
    if (!caminho || caminho == "undefined") return res.send({ msg: "no path" });
    tratarResposta(req, res, 0, caminho);
  });
  server.get("/:caminho", function (req, res) {
    var caminho = req.params.caminho;
    //   console.log(caminho);
    var host = req.headers.host;
    if (!caminho) caminho = "home";
    if (!caminho || caminho == "undefined") return res.send({ msg: "no path" });
    tratarResposta(req, res, 0, caminho);
  });
  server.get("/key/:id_link/:caminho", function (req, res) {
    var caminho = "key";
    //   var id_link = req.params.id_link;
    console.log(caminho);
    var host = req.headers.host;
    if (!caminho || caminho == "undefined") return res.send({ msg: "no path" });
    tratarResposta(req, res, 0, caminho, req.params.id_link);
  });
  server.get("/key/:id_link", function (req, res) {
    var caminho = "key";
    //   var id_link = req.params.id_link;
    // console.log(caminho);
    var host = req.headers.host;
    if (!caminho || caminho == "undefined") return res.send({ msg: "no path" });
    tratarResposta(req, res, 0, caminho, req.params.id_link);
  });
  server.get("/:caminho/e/:id_lead", function (req, res) {
    // console.log(caminho);
    var host = req.headers.host;
    //   host = "1mk.live";
    var caminho = req.params.caminho;
    var id_lead = req.params.id_lead;
    if (!caminho || caminho == "undefined") return res.send({ msg: "no path" });
    if (!id_lead || id_lead == "undefined") return res.send({ msg: "no id_evento" });
    //   console.log("\n\n\n eee> ", req.headers.host, id_lead, host);
    if (!caminho) caminho = "home";
    tratarResposta(req, res, id_lead, caminho);
  });

  function montarDados(req, res, id_lead, caminho, callback) {
    var myURL = url.parse(req.url);
    //   console.log(myURL.query);
    var query = querystring.parse(myURL.query);

    var cidade = TesteRota.getCidade(req);
    var data = {
      host: req.headers.host,
      dominio: req.headers.host,
      url: req.headers.host + "/" + caminho,
      full_path: myURL.pathname,
      path: caminho,
      id_lead: id_lead,
      query: query,
      cidade_data: cidade,
      estado: cidade.region ? cidade.region : "",
      pais: cidade.country ? cidade.country : "",
      cidade: cidade.city ? cidade.city : "",
      ip: cidade ? cidade.ip : "",
      brasil: cidade && cidade.country == "BR" ? true : false,
      mobile: TesteRota.hasMobiel(req),
      device: TesteRota.deviceMobiel(req),
      robo: TesteRota.testeRobo(req)
    };
    // console.log(data);
    carregarHtml(res, data, callback);
  }
  function tratarResposta(req, res, id_lead, caminho, id_link) {
    montarDados(req, res, id_lead, caminho, function (body) {
      // console.log({ ...body, html: null, html_publico: null });
      ///
      // if (body && !body.html_publico) body.html = body.html_publico;
      if (body && body.redirect) {
        res.redirect(302, body.redirect);
      } else if (body && body.html) {
        try {
          if (req.originalUrl && req.originalUrl.indexOf(".js") > 0) {
            res.header("Content-Type", "application/javascript; charset=UTF-8");
          } else if (req.originalUrl && req.originalUrl.indexOf(".json") > 0) {
            res.header("Content-Type", "application/json; charset=UTF-8");
          } else {
            res.header("Content-Type", "text/html; charset=utf-8");
          }
        } catch (e) {
          console.log(e);
        }
        res.write(body.html);
        res.end();
      } else {
        res.write(html_erro);
        res.end();
      }
    });
    //   res.send(data);
  }

  function carregarHtml(res, data, callback) {
    //   url_1mk_get = "http://localhost:5000/rota_dinamica";
    //   console.log(url_1mk_get)
    request({
      url: url_api + "/rota_dinamica_get",
      method: "POST",
      json: data
    }, function (error, response, body) {
      // console.log({body,html:" carregarHtml get",html_publico:""});
      if (error || response.statusCode != 200) {
        callback(null, body);
      } else {
        callback(body);
      }
    });
  }
};

exports["default"] = Router;
module.exports = exports["default"];