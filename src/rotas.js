// by 1app
import fs from "fs";
const url = require("url");
var querystring = require("querystring");

export function getRota(req) {
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
    for (let i = 0; i < rotas.length; i++) {
      let item = rotas[i];
      if (item.rota == myURL.pathname || "/" + item.rota == myURL.pathname || "/" + item.rota + "/" == myURL.pathname) {
        return item;
      }
    }
  }
  // body...
}

export function gravarRota(origen, destino, tipo) {
  console.log(origen, destino);
  var item = { rota: origen, redirect: destino ? destino : "", tipo: tipo };
  var lista = carregarFile();
  removerDaLista(lista, origen);
  if (destino) lista.push(item);
  gravarFile(lista);
}

function removerDaLista(lista, origen) {
  if (!lista) return;
  for (let i = 0; i < lista.length; i++) {
    let item = lista[i];
    if (item.rota == origen) {
      lista.splice(i, 1);
      return removerDaLista(lista, origen);
    }
  }
}

export function carregarFile() {
  try {
    var uri = "/etc/letsencrypt/config.json";
    var data = [];
    if (fs.existsSync(uri)) {
      var text = fs.readFileSync(uri, "utf8");
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
    fs.writeFileSync(uri, JSON.stringify(data), "utf8");
    // console.log(data);
  } catch (e) {
    console.log(e);
  }
}

export function contemString(string, key) {
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
