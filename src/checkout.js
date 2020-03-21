import * as Util from "./uteis";
var request = require("request");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var url = require("url");
var querystring = require("querystring");
import * as TesteRota from "./teste_rotas";
var html_erro = fs.readFileSync("./public-error/erro.html", "utf8");

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

      redirectPostProxy(res, req, { id_etapa, id_oferta, host: req.host });
    });

    function redirectPostProxy(res, req, dados) {
      var url_back = url_api + "/rota_dinamica_get/checkout";
      // console.log(url_back)
      //   url_back = "http://localhost:5000";
      // var myURL = url.parse(req.url);
      var data = {
        url: url_back,
        method: "POST",
        json: dados
      };
      // console.log(data);
      request(data, function(error, response, body) {
        if (error || response.statusCode != 200) {
          res.status(500).send(body);
          //   console.log(body);
        } else if (body.html) {
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
      request(
        {
          url: url_api + "/checkout",
          method: "POST",
          json: data
        },
        function(error, response, body) {
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
