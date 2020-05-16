// by 1app
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verPaginaDeVendas = verPaginaDeVendas;
exports.contemString = contemString;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _require = require("detect-browser");

var detect = _require.detect;

var geoip = require("geoip-lite");
var MobileDetect = require("mobile-detect");
var seo_bot_detect = require("seo-bot-detect");
var detector = require("spider-detector");
var ipInfo = require("ipinfo");
var requestIp = require("request-ip");
var estados = ["RS", "SC"];

function verPaginaDeVendas(req, callback) {
  //   if (!contemString(req.url, "pdv")) return callback(null, { msg: "not pdv" });
  if (testeRobo(req)) return callback(null, { msg: "robo" });
  var ip = getIp(req);
  console.log("ip", ip);
  //   var ip = "179.124.177.100";
  //   var ip = "31.13.64.0";
  testarCidade(ip, function (permitir, error) {
    if (!permitir) return callback(permitir, error);
    testeMobile(req, function (permitir, error) {
      callback(permitir, error);
    });
  });
}

function testeRobo(req, callback) {
  var google = seo_bot_detect(req);
  var agente = req.headers["user-agent"];
  var spider = detector.isSpider(agente);
  //   console.log("robo", google, spider);
  if (google || spider) return true;
}
function testeMobile(req, callback) {
  var md = new MobileDetect(req.headers["user-agent"]);
  //   console.log(md);
  if (md.mobile()) return callback(true, null);
  return callback(null, { msg: "not mobile" });
}
function testarCidade(ip, callback) {
  var cidade = geoip.lookup(ip);
  //   console.log(cidade);
  if (!cidade || !cidade.region) return callback(null, { msg: "not ip:" + ip });
  //   if (cidade.country != "BR") return callback(null, { msg: "not brazil" });
  //testar lugares
  //   for (let i = 0; i < estados.length; i++) {
  //     let lugar = estados[i].toUpperCase();
  //     if (cidade.region.toUpperCase() == lugar) return callback(true, null);
  //     if (cidade.city && cidade.city.toUpperCase() == lugar) return callback(true, null);
  //   }
  if (cidade.country == "BR") return callback(true, null);

  return callback(false, { msg: "nao esta na lista de lugares" });
}

function testarEmpresa(ip, callback) {
  ipInfo(ip, function (err, cLoc) {
    console.log(err || cLoc, ip);
    var cidade = cLoc;
    if (!cidade || !cidade.org) return callback(true, { msg: "not" });
    if (contemString(cidade.org, "Google")) return callback(null, { msg: "Google" });
    if (contemString(cidade.org, "Facebook")) return callback(null, { msg: "Google" });
    // AS15169 Google Inc.
    callback(cidade, err);
  });
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

function getIp(req) {
  var ip = (req.headers["x-forwarded-for"] || "").split(",").pop() || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  return ip;
}