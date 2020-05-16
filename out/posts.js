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
  ////
  //// DINAMICOS
  ////

  server.post("/", function (req, res) {
    var caminho = req.params.caminho;
    var host = req.headers.host;
    if (!caminho) caminho = "home";
    if (!caminho || caminho == "undefined") return res.send({ msg: "no path" });
    // console.log(host, caminho);
    tratarRespostaPost(req, res, 0, caminho);
  });

  server.post("/:caminho", function (req, res) {
    var caminho = req.params.caminho;
    var host = req.headers.host;
    if (!caminho) caminho = "home";
    if (!caminho || caminho == "undefined") return res.send({ msg: "no path" });
    tratarRespostaPost(req, res, 0, caminho);
  });

  server.post("/:caminho/a/:id_user", function (req, res) {
    var caminho = req.params.caminho;
    var host = req.headers.host;
    if (!caminho) caminho = "home";
    if (!caminho || caminho == "undefined") return res.send({ msg: "no path" });
    tratarRespostaPost(req, res, 0, caminho);
  });

  server.post("/:caminho/e/:id_lead", function (req, res) {
    var host = req.headers.host;
    //   host = "1mk.live";
    var caminho = req.params.caminho;
    var id_lead = req.params.id_lead;
    if (!caminho || caminho == "undefined") return res.send({ msg: "no path" });
    if (!id_lead || id_lead == "undefined") return res.send({ msg: "no id_evento" });
    //   console.log("\n\n\n eee> ", req.headers.host, id_lead, host);
    if (!caminho) caminho = "home";
    tratarRespostaPost(req, res, id_lead, caminho);
  });

  function tratarRespostaPost(req, res, id_lead, caminho) {
    var myURL = url.parse(req.url);
    var query = querystring.parse(myURL.query);
    var cidade = TesteRota.getCidade(req);
    var data = {
      formulario: req.body,
      dominio: req.headers.host,
      url: req.headers.host + "/" + caminho,
      full_path: myURL.pathname,
      path: caminho,
      id_lead: id_lead,
      cookies: req.cookies,
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
    //   data.dominio = "teste.1mk.digital";
    // console.log({ data, html: null });
    //   url_1mk_post = "http://localhost:5000/gravar_leads";
    request({
      url: url_api + "/rota_dinamica_post",
      method: "POST",
      json: data
    }, function (error, response, body) {
      // console.log("body", { body, html: null });

      if (error || response.statusCode != 200) return tratarRespostaGetComErro(req, res, id_lead, caminho, true);

      if (body && body.cookie_lead) res.cookie("lead", body.cookie_lead);
      if (body && body.cookie_aff) res.cookie("aff", body.cookie_aff);

      // res.write(JSON.stringify(body));
      try {
        // if (body.id_lead) gravarCookie(res, body.id_lead);
        if (body.html) {
          res.write(body.html);
          res.end();
        } else if (body.redirect) {
          res.redirect(302, body.redirect);
        } else {
          return tratarRespostaGetComErro(req, res, id_lead, caminho, false);
        }
      } catch (e) {
        res.write(JSON.stringify(body));
        res.end();
        console.log(e);
      }
    });
    //   res.send(data);
  }

  function tratarRespostaGetComErro(req, res, id_lead, caminho, error) {
    montarDados(req, res, id_lead, caminho, function (body) {
      if (body && body.html) {
        var html = body.html;
        if (error) html += "<script>alert('Erro, tente novamente!');</script>";
        res.write(html);
      } else {
        res.write(html_erro);
      }
      res.end();
    });
    //   res.send(data);
  }

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

  function carregarHtml(res, data, callback) {
    //   url_1mk_get = "http://localhost:5000/rota_dinamica";
    //   console.log(url_1mk_get)
    request({
      url: url_api + "/rota_dinamica_get",
      method: "POST",
      json: data
    }, function (error, response, body) {
      // console.log(body);
      if (error || response.statusCode != 200) {
        callback(null, body);
      } else {
        callback(body);
      }
    });
  }

  function gravarCookie(res, id_lead) {
    var token = Util.makeToken({ id_lead: id_lead });
    res.cookie("lead", token);
  }
};

exports["default"] = Router;
module.exports = exports["default"];