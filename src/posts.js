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
    ///
    ////
    //// DINAMICOS
    ////

    server.post("/", (req, res) => {
      var caminho = req.params.caminho;
      var host = req.headers.host;
      if (!caminho) caminho = "home";
      if (!caminho || caminho == "undefined")
        return res.send({ msg: "no path" });
      // console.log(host, caminho);
      tratarRespostaPost(req, res, 0, caminho);
    });


    server.post("/:caminho", (req, res) => {
      var caminho = req.params.caminho;
      var host = req.headers.host;
      if (!caminho) caminho = "home";
      if (!caminho || caminho == "undefined")
        return res.send({ msg: "no path" });
      tratarRespostaPost(req, res, 0, caminho);
    });

    server.post("/:caminho/a/:id_user", (req, res) => {
      var caminho = req.params.caminho;
      var host = req.headers.host;
      if (!caminho) caminho = "home";
      if (!caminho || caminho == "undefined")
        return res.send({ msg: "no path" });
      tratarRespostaPost(req, res, 0, caminho);
    });

    server.post("/:caminho/e/:id_lead", (req, res) => {
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
        robo: TesteRota.testeRobo(req),
      };
      //   data.dominio = "teste.1mk.digital";
      // console.log({ data, html: null });
      //   url_1mk_post = "http://localhost:5000/gravar_leads";
      request(
        {
          url: url_api + "/rota_dinamica_post",
          method: "POST",
          json: data,
        },
        function (error, response, body) {
          // console.log("body", { body, html: null });

          if (error || response.statusCode != 200)
            return tratarRespostaGetComErro(req, res, id_lead, caminho, true);

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
              return tratarRespostaGetComErro(
                req,
                res,
                id_lead,
                caminho,
                false
              );
            }
          } catch (e) {
            res.write(JSON.stringify(body));
            res.end();
            console.log(e);
          }
        }
      );
      //   res.send(data);
    }

    function tratarRespostaGetComErro(req, res, id_lead, caminho, error) {
      montarDados(req, res, id_lead, caminho, (body) => {
        if (body && body.html) {
          var html = body.html;
          if (error)
            html += "<script>alert('Erro, tente novamente!');</script>";
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
        robo: TesteRota.testeRobo(req),
      };
      // console.log(data);
      carregarHtml(res, data, callback);
    }

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
          if (error || response.statusCode != 200) {
            callback(null, body);
          } else {
            callback(body);
          }
        }
      );
    }

    function gravarCookie(res, id_lead) {
      let token = Util.makeToken({ id_lead: id_lead });
      res.cookie("lead", token);
    }
  }
}
