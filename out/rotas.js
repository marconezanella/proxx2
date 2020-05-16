// by 1app
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRota = getRota;
exports.gravarRota = gravarRota;
exports.carregarFile = carregarFile;
exports.contemString = contemString;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var url = require("url");
var querystring = require("querystring");

function getRota(req) {
  var myURL = url.parse(req.url);
  var query = querystring.parse(myURL.query);

  if (query && query.origen) {
    gravarRota(query.origen, query.destino, query.tipo);
  }
  //   console.log(myURL.pathname);

  var rotas = carregarFile();
  if (rotas) {
    //   console.log(req.url, rotas, myURL.query, query);
    //   if (!contemString(req.url, "pdv")) return null;
    for (var i = 0; i < rotas.length; i++) {
      var item = rotas[i];
      if (item.rota == myURL.pathname || "/" + item.rota == myURL.pathname || "/" + item.rota + "/" == myURL.pathname) {
        return item;
      }
    }
  }
  // body...
}

function gravarRota(origen, destino, tipo) {
  console.log(origen, destino);
  var item = { rota: origen, redirect: destino ? destino : "", tipo: tipo };
  var lista = carregarFile();
  removerDaLista(lista, origen);
  if (destino) lista.push(item);
  gravarFile(lista);
}

function removerDaLista(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    var lista = _x,
        origen = _x2;
    _again = false;

    if (!lista) return;
    for (var i = 0; i < lista.length; i++) {
      var item = lista[i];
      if (item.rota == origen) {
        lista.splice(i, 1);
        _x = lista;
        _x2 = origen;
        _again = true;
        i = item = undefined;
        continue _function;
      }
    }
  }
}

function carregarFile() {
  try {
    var uri = "/etc/letsencrypt/config.json";
    var data = [];
    if (_fs2["default"].existsSync(uri)) {
      var text = _fs2["default"].readFileSync(uri, "utf8");
      if (text) data = JSON.parse(text);
      //   console.log(text);
    }
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

function gravarFile(data) {
  try {
    var uri = "/etc/letsencrypt/config.json";
    _fs2["default"].writeFileSync(uri, JSON.stringify(data), "utf8");
    // console.log(data);
  } catch (e) {
    console.log(e);
  }
}

function contemString(string, key) {
  if (!string || !key) {
    return false;
  }
  try {
    key = (key + "").toUpperCase();
    string = (string + "").toUpperCase();
    if (string && string.indexOf(key) >= 0) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}