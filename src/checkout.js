import * as Util from "./uteis";
var request = require("request");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var url = require("url");
var querystring = require("querystring");
import * as TesteRota from "./teste_rotas";
var html_erro = fs.readFileSync("./public-error/erro.html", "utf8");

import md5 from "md5";

export default class Router {
  constructor(server, url_api) {
    ///
    ///
    server.get("/checkout", (req, res) => {
      // redirectPostProxy(res, req);
      res.redirect(302, "/");
    });

    server.get("/checkout/:id_etapa/:id_oferta", (req, res) => {
      var id_etapa = req.params.id_etapa;
      var id_oferta = req.params.id_oferta;

      var myURL = url.parse(req.url);
      var query = querystring.parse(myURL.query);
      var cidade = TesteRota.getCidade(req);

      var id_lead = 0;
      if (req.query && req.query.idl) id_lead = req.query.idl;

      var data = {
        dominio: req.headers.host,
        url: req.url,
        full_path: myURL.pathname,
        path: myURL.pathname,
        cookies: req.cookies,
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
        robo: TesteRota.testeRobo(req),
      };

      redirectPostProxy(res, req, {
        ...data,
        id_etapa,
        id_oferta,
        host: req.host,
      });
    });

    function redirectPostProxy(res, req, dados) {
      var url_back = url_api + "/rota_dinamica_get/checkout";
      // console.log(url_back)
      //   url_back = "http://localhost:5000";
      // var myURL = url.parse(req.url);
      var data = {
        url: url_back,
        method: "POST",
        json: dados,
      };

      // console.log(data);
      request(data, function (error, response, body) {
        if (error || response.statusCode != 200) {
          res.status(500).send(body);

          //   console.log(body);
        } else if (body.html) {
          try {
            var cidade = TesteRota.getCidade(req);

            if (body && body.cookie_all) res.cookie("all", body.cookie_all);
            if (body && body.cookie_lead) res.cookie("lead", body.cookie_lead);
            if (body && body.cookie_link) res.cookie("link", body.cookie_link);
            if (body && body.cookie_aff) res.cookie("aff", body.cookie_aff);
            if (cidade && cidade.ip) res.cookie("ip", cidade.ip);
            if (cidade && cidade.ip) res.cookie("hasip", md5(cidade.ip));
            if (req.cookies && !req.cookies.hashuser) {
              var user = "";
              for (var i = 0; i < 10; i++) {
                user += Math.random() + "";
              }
              res.cookie("hashuser", md5(user));
            }
            if (req.cookies && !req.cookies.unic_token) {
              var user = "";
              for (var i = 0; i < 10; i++) {
                user += Math.random() + "";
              }
              var unic_token = Util.makeToken({
                unic_token: md5(user),
                ip: cidade.ip,
              });
              res.cookie("unic_token", unic_token);
            }
          } catch (e) {}

          res.write(body.html);
          res.end();
        } else {
          res.write(html_erro);
          res.end();
        }
      });
    }

    ///
    ///
    ////
    ////CHECKOUT
    ////
    ////
    server.post("/v1/checkout", (req, res) => {
      var caminho = "v1/checkout";
      var host = req.headers.host;
      tratarRespostaPostCheckout(req, res, 0, caminho);
    });
    server.post("/v1/checkout/pagar/cartao", (req, res) => {
      var caminho = "v1/checkout/pagar/cartao";
      var host = req.headers.host;
      tratarRespostaPostCheckout(req, res, 0, caminho);
    });
    server.post("/v1/checkout/gerar/boleto", (req, res) => {
      var caminho = "v1/checkout/gerar/boleto";
      var host = req.headers.host;
      tratarRespostaPostCheckout(req, res, 0, caminho);
    });
    server.post("/v1/enderecos/cep", (req, res) => {
      var caminho = "v1/enderecos/cep";
      var host = req.headers.host;
      tratarRespostaPostCheckout(req, res, 0, caminho);
    });

    function tratarRespostaPostCheckout(req, res, id_lead, caminho) {
      var myURL = url.parse(req.url);
      var query = querystring.parse(myURL.query);
      var cidade = TesteRota.getCidade(req);
      var data = {
        formulario: req.body,
        host: req.headers.host,
        dominio: req.headers.host,
        url: req.headers.host + "/" + caminho,
        full_path: myURL.pathname,
        path: caminho,
        cookies: req.cookies,
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
        robo: TesteRota.testeRobo(req),
      };
      request(
        {
          url: url_api + "/checkout",
          method: "POST",
          json: data,
        },
        function (error, response, body) {
          //   console.log("\n\n", body);
          if (error || response.statusCode != 200) {
            res.status(500).send(body);
          } else {
            res.send(body);
          }
        }
      );
      //   res.send(data);
    }
  }
}
