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

var Router = function Router(server, url_api) {
  _classCallCheck(this, Router);

  ///
  ///
  server.post("/v1/membros/aulas/aluno", function (req, res) {
    redirectPostProxy(res, req);
  });
  server.post("/v1/membros/projeto", function (req, res) {
    redirectPostProxy(res, req);
  });
  server.post("/v1/membros/email/recuperar", function (req, res) {
    redirectPostProxy(res, req);
  });
  server.post("/v1/membros/login", function (req, res) {
    redirectPostProxy(res, req);
  });
  server.post("/v1/membros/atualizar", function (req, res) {
    redirectPostProxy(res, req);
  });
  server.get("/v1/membros", function (req, res) {
    redirectPostProxy(res, req);
  });

  function redirectPostProxy(res, req) {
    //   url_back = "http://localhost:5000";
    var myURL = url.parse(req.url);
    var data = {
      url: url_api + "" + myURL.pathname,
      method: req.method,
      json: req.body
    };
    //   console.log(data);
    request(data, function (error, response, body) {
      if (error || response.statusCode != 200) {
        res.status(500).send(body);
        //   console.log(body);
      } else {
          res.send(body);
        }
    });
  }
};

exports["default"] = Router;
module.exports = exports["default"];