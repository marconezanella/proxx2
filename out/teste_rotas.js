// by 1app
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testeRobo = testeRobo;
exports.diviseNaoMobile = diviseNaoMobile;
exports.hasMobiel = hasMobiel;
exports.deviceMobiel = deviceMobiel;
exports.foraDoBrasilIp = foraDoBrasilIp;
exports.getCidade = getCidade;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _require = require("detect-browser");

var detect = _require.detect;

var geoip = require("geoip-lite");
var MobileDetect = require("mobile-detect");
var seo_bot_detect = require("seo-bot-detect");
var detector = require("spider-detector");
// https://ipinfo.io/AS63293

function testeRobo(req) {
  var google = seo_bot_detect(req);
  var agente = req.headers["user-agent"];
  var spider = detector.isSpider(agente);
  //   console.log("robo", google, spider);
  if (google || spider) return true;
  return false;
}

function diviseNaoMobile(req, callback) {
  var md = new MobileDetect(req.headers["user-agent"]);
  //   console.log(md);
  if (md.mobile()) return false;
  return true;
}

function hasMobiel(req) {
  var md = new MobileDetect(req.headers["user-agent"]);
  //   console.log(md);
  if (md.is("iPhone")) return true;
  if (md.os() == "AndroidOS") return true;

  //   if (md.mobile()) return true;
  return false;
}

function deviceMobiel(req) {
  var md = new MobileDetect(req.headers["user-agent"]);
  //   console.log(md);
  if (md.is("iPhone")) return "ios";
  if (md.os() == "AndroidOS") return "android";
  if (md.mobile()) return "android";
  return "web";
}

function foraDoBrasilIp(req, callback) {
  var ip = getIp(req);

  var cidade = geoip.lookup(ip);
  //   console.log(cidade, ip);
  if (!cidade || !cidade.region) return true;
  if (cidade.country == "BR") false;
  return true;
}

function getCidade(req) {
  var ip = getIp(req);
  //   ip = "179.124.177.100";
  var cidade = geoip.lookup(ip);
  if (cidade) cidade.ip = ip;
  if (!cidade) cidade = { ip: ip };
  return cidade;
}

function getIp(req) {
  //  return "45.168.10.210";
  var ip = (req.headers["x-forwarded-for"] || "").split(",").pop() || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  return ip;
}