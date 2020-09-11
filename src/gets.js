import * as Util from "./uteis";
var request = require("request");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var url = require("url");
var querystring = require("querystring");
import md5 from "md5";
import * as TesteRota from "./teste_rotas";
var html_erro = fs.readFileSync("./public-error/erro.html", "utf8");

export default class Router {
  constructor(server, url_api) {
    ///
    ///
    ///
    server.get("/*.css", (req, res) => {
      res.status(500).send("nao");
    });
    server.get("/*.html", (req, res) => {
      res.status(500).send("nao");
    });
    server.get("/*.js", (req, res) => {
      res.status(500).send("nao");
    });
    server.get("/*.ico", (req, res) => {
      res.status(500).send("nao");
    });
    server.get("/*.png", (req, res) => {
      res.status(500).send("nao");
    });
    server.get("/*.json", (req, res) => {
      res.status(500).send("nao");
    });
    server.get("/*.jpeg", (req, res) => {
      res.status(500).send("nao");
    });
    server.get("/*.jpg", (req, res) => {
      res.status(500).send("nao");
    });

    ////
    //// DINAMICOS
    ////
    server.get("/formulario/v1/:id_etapa", (req, res) => {
      // console.log("\n\n\n\n/formulario/v1/:id_etapa\n\n\n\n");
      var caminho = "/form/a";
      var id_etapa = req.params.id_etapa;
      // console.log("\n\n", caminho, id_etapa);
      var host = req.headers.host;
      if (!caminho) caminho = "home";
      if (!caminho || caminho == "undefined")
        return res.send({ msg: "no path" });
      tratarResposta(req, res, 0, caminho, id_etapa);
    });

    server.get("/", (req, res) => {
      var caminho = req.params.caminho;
      // console.log("caminho");
      var host = req.headers.host;
      if (!caminho) caminho = "home";
      if (!caminho || caminho == "undefined")
        return res.send({ msg: "no path" });
      tratarResposta(req, res, 0, caminho);
    });
    server.get("/:caminho", (req, res) => {
      var caminho = req.params.caminho;
      //   console.log(caminho);
      var host = req.headers.host;
      if (!caminho) caminho = "home";
      if (!caminho || caminho == "undefined")
        return res.send({ msg: "no path" });
      tratarResposta(req, res, 0, caminho);
    });

    server.get("/:caminho/a/:id_user", (req, res) => {
      var caminho = req.params.caminho;
      //   console.log(caminho);
      var host = req.headers.host;
      if (!caminho) caminho = "home";
      if (!caminho || caminho == "undefined")
        return res.send({ msg: "no path" });
      tratarResposta(req, res, 0, caminho);
    });
    server.get("/pay/fatura/:id_pagamento", (req, res) => {
      var caminho = "/pay/fatura";
      var id_pagamento = req.params.id_pagamento;
      console.log(caminho);
      var host = req.headers.host;
      if (!caminho) caminho = "home";
      if (!caminho || caminho == "undefined")
        return res.send({ msg: "no path" });
      tratarResposta(req, res, 0, caminho, id_pagamento);
    });
    server.get("/key/:id_link/:caminho", (req, res) => {
      var caminho = "key";
      //   var id_link = req.params.id_link;
      // console.log(caminho);
      var host = req.headers.host;
      if (!caminho || caminho == "undefined")
        return res.send({ msg: "no path" });
      tratarResposta(req, res, 0, caminho, req.params.id_link);
    });
    server.get("/key/:id_link", (req, res) => {
      var caminho = "key";
      //   var id_link = req.params.id_link;
      // console.log(caminho);
      var host = req.headers.host;
      if (!caminho || caminho == "undefined")
        return res.send({ msg: "no path" });
      tratarResposta(req, res, 0, caminho, req.params.id_link);
    });
    server.get("/:caminho/e/:id_lead", (req, res) => {
      // console.log(caminho);
      var host = req.headers.host;
      //   host = "1mk.live";
      var caminho = req.params.caminho;
      var id_lead = req.params.id_lead;
      if (!caminho || caminho == "undefined")
        return res.send({ msg: "no path" });
      if (!id_lead || id_lead == "undefined")
        return res.send({ msg: "no id_evento" });
      //   console.log("\n\n\n eee> ", req.headers.host, id_lead, host);
      if (!caminho) caminho = "home";
      tratarResposta(req, res, id_lead, caminho);
    });

    function montarDados(req, res, id_lead, caminho, id_link, callback) {
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
        id_link,
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
        robo: TesteRota.testeRobo(req),
      };
      // console.log(data);
      carregarHtml(res, data, callback);
    }
    function tratarResposta(req, res, id_lead, caminho, id_link) {
      montarDados(req, res, id_lead, caminho, id_link, (body) => {
        // console.log({ ...body, html: null, html_publico: null });
        ///
        // if (body && !body.html_publico) body.html = body.html_publico;
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

        // console.log(caminho, "nao encontrou");
        if (body && body.redirect) {
          console.log(caminho, "REDIRECT");
          res.redirect(302, body.redirect);
        } else if (body && body.html) {
          console.log(caminho, "HTML");
          try {
            console.log(caminho, "HTML2");
            if (req.originalUrl && req.originalUrl.indexOf(".js") > 0) {
              res.header(
                "Content-Type",
                "application/javascript; charset=UTF-8"
              );
            } else if (
              req.originalUrl &&
              req.originalUrl.indexOf(".json") > 0
            ) {
              res.header("Content-Type", "application/json; charset=UTF-8");
            } else {
              res.header("Content-Type", "text/html; charset=utf-8");
            }
          } catch (e) {
            console.log(caminho, "HTML3");

            console.log(e);
          }
          res.write(body.html);
          res.end();
        } else {
          // console.log(caminho,"nao encontrou")
          // if (caminho != "home") return res.redirect(302, "/home");
          res.write(html_erro);
          res.end();
        }
      });
      //   res.send(data);
    }
    ///cockies ip
    //rdirecioner erro home
    function carregarHtml(res, data, callback) {
      //   url_1mk_get = "http://localhost:5000/rota_dinamica";
      //   console.log(url_1mk_get)
      request(
        {
          url: url_api + "/rota_dinamica_get",
          method: "POST",
          json: data,
        },
        function (error, response, body) {
          // console.log(body);
          try {
            if (error || response.statusCode != 200) {
              callback(null, body);
            } else {
              callback(body);
            }
          } catch (e) {
            console.log(e);
          }
        }
      );
    }
  }
}
