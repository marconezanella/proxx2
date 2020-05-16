import * as Util from "./uteis";
var request = require("request");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var url = require("url");
var querystring = require("querystring");
import * as TesteRota from "./teste_rotas";

export default class Router {
  constructor(server, url_api) {
    ///
    ///
    server.post("/v1/membros/aulas/aluno", (req, res) => {
      redirectPostProxy(res, req);
    });
    server.post("/v1/membros/projeto", (req, res) => {
      redirectPostProxy(res, req);
    });
    server.post("/v1/membros/email/recuperar", (req, res) => {
      redirectPostProxy(res, req);
    });
    server.post("/v1/membros/login", (req, res) => {
      redirectPostProxy(res, req);
    });
    server.post("/v1/membros/atualizar", (req, res) => {
      redirectPostProxy(res, req);
    });
    server.get("/v1/membros", (req, res) => {
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
      request(data, function(error, response, body) {
        if (error || response.statusCode != 200) {
          res.status(500).send(body);
          //   console.log(body);
        } else {
          res.send(body);
        }
      });
    }
  }
}
