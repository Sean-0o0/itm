/* eslint-disable */
var e = function () {
  return (e = Object.assign || function (e) {
    for (var n, t = 1, r = arguments.length; t < r; t++) for (var o in n = arguments[t]) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
    return e
  }).apply(this, arguments)
};

function n(e, n, t, r) {
  return new (t || (t = Promise))(function (o, a) {
    function i(e) {
      try {
        s(r.next(e))
      } catch (e) {
        a(e)
      }
    }

    function c(e) {
      try {
        s(r.throw(e))
      } catch (e) {
        a(e)
      }
    }

    function s(e) {
      e.done ? o(e.value) : new t(function (n) {
        n(e.value)
      }).then(i, c)
    }

    s((r = r.apply(e, n || [])).next())
  })
}

function t(e, n) {
  var t, r, o, a, i = {
    label: 0, sent: function () {
      if (1 & o[0]) throw o[1];
      return o[1]
    }, trys: [], ops: []
  };
  return a = {
    next: c(0),
    throw: c(1),
    return: c(2)
  }, "function" == typeof Symbol && (a[Symbol.iterator] = function () {
    return this
  }), a;

  function c(a) {
    return function (c) {
      return function (a) {
        if (t) throw new TypeError("Generator is already executing.");
        for (; i;) try {
          if (t = 1, r && (o = 2 & a[0] ? r.return : a[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, a[1])).done) return o;
          switch (r = 0, o && (a = [2 & a[0], o.value]), a[0]) {
            case 0:
            case 1:
              o = a;
              break;
            case 4:
              return i.label++, {value: a[1], done: !1};
            case 5:
              i.label++, r = a[1], a = [0];
              continue;
            case 7:
              a = i.ops.pop(), i.trys.pop();
              continue;
            default:
              if (!(o = (o = i.trys).length > 0 && o[o.length - 1]) && (6 === a[0] || 2 === a[0])) {
                i = 0;
                continue
              }
              if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                i.label = a[1];
                break
              }
              if (6 === a[0] && i.label < o[1]) {
                i.label = o[1], o = a;
                break
              }
              if (o && i.label < o[2]) {
                i.label = o[2], i.ops.push(a);
                break
              }
              o[2] && i.ops.pop(), i.trys.pop();
              continue
          }
          a = n.call(e, i)
        } catch (e) {
          a = [6, e], r = 0
        } finally {
          t = o = 0
        }
        if (5 & a[0]) throw a[1];
        return {value: a[0] ? a[1] : void 0, done: !0}
      }([a, c])
    }
  }
}

var r = function () {
  function e() {
  }

  return e.add = function (n) {
    e._handleList.push(n), window.addEventListener("message", n, !1)
  }, e.remove = function (n) {
    var t = e._handleList.indexOf(n);
    t >= 0 && e._handleList.splice(t, 1), window.removeEventListener("message", n, !1)
  }, e.empty = function () {
    for (; e._handleList.length;) window.removeEventListener("message", e._handleList.shift(), !1)
  }, e.parse = function (e) {
    return "object" == typeof e ? e : JSON.parse(e)
  }, e._handleList = [], e
}();
var o, a, i, c = this;
!function (e) {
  e.unknown = "unknown", e.spreadsheet = "s", e.writer = "w", e.presentation = "p", e.pdf = "f"
}(o || (o = {})), function (e) {
  e.wps = "w", e.et = "s", e.presentation = "p", e.pdf = "f"
}(a || (a = {})), function (e) {
  e.nomal = "nomal", e.simple = "simple"
}(i || (i = {}));
var s, u, p = (s = 0, function () {
  return ++s
}), l = (u = null, function (e, n) {
  if (!u) {
    u = document.createElement("iframe");
    var t = {
      id: "wps-iframe",
      src: e,
      scrolling: "no",
      frameborder: "0",
      allowfullscreen: "allowfullscreen",
      webkitallowfullscreen: "true",
      mozallowfullscreen: "true",
      className: "web-office-iframe",
      height: 'auto',
      width: '100%'
    };
    for (var r in t) u.setAttribute(r, t[r]);
    n ? n.appendChild(u) : document.body.appendChild(u), u.destroy = function () {
      u.parentNode.removeChild(u), u = null
    }
  }
  return u
}), f = function (e) {
  l().contentWindow.postMessage(JSON.stringify(e), "*")
}, d = function (e) {
  return new Promise(function (n) {
    var t = p();
    e.type = x();
    var o = function (e) {
      var a = r.parse(e.data);
      "wps.api.reply" === a.eventName && a.msgId === t && (n(a.data), r.remove(o))
    };
    r.add(o), f({eventName: "wps.jssdk.api", data: e, msgId: t})
  })
}, v = null, b = [], m = [], h = !1, w = !1, y = !1, g = function () {
  b = [], m = [], h = !1, w = !1, y = !1
}, j = function (o, a, i) {
  return n(c, void 0, void 0, function () {
    var c, s, u, l, d, g, j, I, k, O;
    return t(this, function () {
      return c = h ? m : b, s = p(), a.type = x(), d = new Promise(function (e, n) {
        u = e, l = n
      }), g = {}, a.args && (j = function (e) {
        var n = {};
        return [e = e.map(function (e) {
          if (function (e) {
            if (!e) return !1;
            for (var n = e; null !== Object.getPrototypeOf(n);) n = Object.getPrototypeOf(n);
            return Object.getPrototypeOf(e) === n
          }(e)) {
            var t = {};
            for (var r in e) {
              var o = e[r];
              if ("function" == typeof o) {
                var a = p();
                n[a] = o, o = {callbackId: a}
              }
              t[r] = o
            }
            return t
          }
          return "function" == typeof e ? (a = p(), n[a] = e, {callbackId: a}) : e
        }), n]
      }(a.args), I = j[0], k = j[1], a.args = I, g = k), O = function () {
        var e = this, a = function (p) {
          return n(e, void 0, void 0, function () {
            var e, n, d;
            return t(this, function (t) {
              switch (t.label) {
                case 0:
                  return "api.callback" === (e = r.parse(p.data)).eventName && e.callbackId && g[e.callbackId] ? (h = !0, [4, g[e.callbackId].apply(g, e.data.args)]) : [3, 2];
                case 1:
                  n = t.sent(), f({
                    eventName: "api.callback.reply",
                    result: n,
                    callbackId: e.callbackId
                  }), t.label = 2;
                  return;
                case 2:
                  if (e.eventName === o + ".reply" && e.msgId === s) {
                    if (e.error) {
                      for ((d = new Error("")).stack = e.error + "\n" + i; c.length;) c.shift();
                      h ? y = !1 : w = !1, l(d)
                    } else u(e.result);
                    r.remove(a)
                  }
                  return [2];
              }
            })
          })
        };
        return r.add(a), d
      }, c.push([{eventName: o, data: a, msgId: s}, O]), function r(o) {
        return n(this, void 0, void 0, function () {
          var a, i = this;
          return t(this, function () {
            return a = h, !(h ? y : w) && o.length ? [2, v = new Promise(function () {
              return n(i, void 0, void 0, function () {
                var n, i, c;
                return t(this, function (t) {
                  switch (t.label) {
                    case 0:
                      h ? y = !0 : w = !0, t.label = 1;
                      return;
                    case 1:
                      return o.length ? (n = o.shift(), i = n[0], c = n[1], "function" == typeof (i = e({}, i)).data && (i.data = i.data()), f(i), [4, c()]) : [3, 3];
                    case 2:
                      return t.sent(), [3, 1];
                    case 3:
                      return h ? y = !1 : w = !1, a && (h = !1), [2, r(a ? b : m)]
                  }
                })
              })
            })] : [2]
          })
        })
      }(c), [2, d]
    })
  })
};

function I() {
  return n(this, void 0, void 0, function () {
    return t(this, function (e) {
      switch (e.label) {
        case 0:
          return w || y ? [4, v] : [3, 2];
        case 1:
          e.sent(), e.label = 2;
          return;
        case 2:
          return v = null, h = !0, [2]
      }
    })
  })
}

var k, O, _ = function (n, t) {
    void 0 === t && (t = !0);
    var r = e({}, n), o = r.headers, a = void 0 === o ? {} : o, c = r.subscriptions, s = void 0 === c ? {} : c,
      u = r.mode, p = void 0 === u ? i.nomal : u, l = a.backBtn, f = void 0 === l ? {} : l, d = a.shareBtn,
      v = void 0 === d ? {} : d, b = a.otherMenuBtn, m = void 0 === b ? {} : b, h = function (e, n) {
        e.subscribe && "function" == typeof e.subscribe && (e.callback = n, s[n] = e.subscribe, t && delete e.subscribe)
      };
    if (h(f, "wpsconfig_back_btn"), h(v, "wpsconfig_share_btn"), h(m, "wpsconfig_other_menu_btn"), m.items && Array.isArray(m.items)) {
      var w = [];
      m.items.forEach(function (e, n) {
        switch (void 0 === e && (e = {}), e.type) {
          case"export_img":
            e.type = 1, e.callback = "export_img";
            break;
          case"export_pdf":
            e.type = 1, e.callback = "export_pdf";
            break;
          case"save_version":
            e.type = 1, e.callback = "save_version";
            break;
          case"about_wps":
            e.type = 1, e.callback = "about_wps";
            break;
          case"split_line":
            e.type = 2;
            break;
          case"custom":
            e.type = 3, h(e, "wpsconfig_other_menu_btn_" + n), w.push(e)
        }
      }), w.length && (P || N) && (m.items = w)
    }
    if (p === i.simple && (r.wpsUrl && (r.wpsUrl += "&simple&hidecmb"), r.url && (r.url += "&simple&hidecmb")), r.debug && (r.wpsUrl && (r.wpsUrl += "&debugger"), r.url && (r.url += "&debugger")), r.wordOptions && (r.wpsOptions = r.wordOptions), r.excelOptions && (r.etOptions = r.excelOptions), r.pptOptions && (r.wppOptions = r.pptOptions), "object" == typeof s.print) {
      var y = "wpsconfig_print";
      "function" == typeof s.print.subscribe && (s[y] = s.print.subscribe, r.print = {callback: y}, void 0 !== s.print.custom && (r.print.custom = s.print.custom)), delete s.print
    }
    "function" == typeof s.exportPdf && (s[y = "wpsconfig_export_pdf"] = s.exportPdf, r.exportPdf = {callback: y}, delete s.exportPdf);
    return e({}, r, {subscriptions: s})
  }, x = (k = "", function (e) {
    if (void 0 === e && (e = ""), !k && e) {
      var n = e.toLowerCase();
      -1 !== n.indexOf("/office/s/") && (k = o.spreadsheet), -1 !== n.indexOf("/office/w/") && (k = o.writer), -1 !== n.indexOf("/office/p/") && (k = o.presentation), -1 !== n.indexOf("/office/f/") && (k = o.pdf)
    }
    if (!k) {
      var t = e.match(/[\\?&]type=([a-z]+)/) || [];
      k = a[t[1]] || ""
    }
    return k
  }), E = window.navigator.userAgent.toLowerCase(), P = /Android|webOS|iPhone|iPod|BlackBerry|iPad/i.test(E),
  N = function () {
    try {
      return -1 !== window._parent.location.search.indexOf("from=wxminiprogram")
    } catch (e) {
      return !1
    }
  }();

function C(e) {
  return e = e || Object.create(null), {
    on: function (n, t) {
      (e[n] || (e[n] = [])).push(t)
    }, off: function (n, t) {
      e[n] && e[n].splice(e[n].indexOf(t) >>> 0, 1)
    }, emit: function (n, t) {
      (e[n] || []).slice().map(function (e) {
        e(t)
      }), (e["*"] || []).slice().map(function (e) {
        e(n, t)
      })
    }
  }
}

!function (e) {
  e[e.msoFalse = 0] = "msoFalse", e[e.msoTrue = -1] = "msoTrue"
}(O || (O = {}));
var A = 0, S = new Set;

function B(e) {
  return ++A, !e && function (e) {
    S.forEach(function (n) {
      return n(e)
    })
  }(A), A
}

function L(a, i) {
  var c, s = this, u = i.Events, p = i.Enum, l = i.Props, d = l[0], v = l[1], b = {objId: A};
  switch (function n(t, r, o) {
    r = r.slice(0);
    var a = function () {
      var a = r.shift();
      !a.alias && ~T.indexOf(a.prop) && r.push(e({}, a, {alias: a.prop + "Async"})), Object.defineProperty(t, a.alias || a.prop, {
        get: function () {
          var r = 1 === a.cache, i = r && this["__" + a.prop + "CacheValue"];
          if (i) return i;
          var c = new Error(""), s = c.stack.split("\n").slice(2).join("\n"), u = B(r), p = function () {
            for (var n, r = [], i = 0; i < arguments.length; i++) r[i] = arguments[i];
            void 0 !== a.caller ? function n(t, r, o) {
              r = r.slice(0);
              var a = function () {
                var a = r.shift();
                !a.alias && ~T.indexOf(a.prop) && r.push(e({}, a, {alias: a.prop + "Async"})), Object.defineProperty(t, a.alias || a.prop, {
                  get: function () {
                    var e = 1 === a.cache, r = e && this["__" + a.prop + "CacheValue"];
                    if (r) return r;
                    var i = new Error(""), c = i.stack.split("\n").slice(2).join("\n"), s = B(e),
                      u = function () {
                        for (var e, r = [], i = 0; i < arguments.length; i++) r[i] = arguments[i];
                        void 0 !== a.caller ? n(e = {objId: B()}, o[a.caller], o) : e = {};
                        return V(e, "api.caller", function () {
                          return {obj: u, parentObjId: t.objId, args: r, prop: a.prop}
                        }, c), e
                      };
                    return u.objId = -1, void 0 !== a.getter && (u.objId = s, n(u, o[a.getter], o)), V(u, "api.getter", function () {
                      return {parentObjId: t.objId, objId: u.objId, prop: a.prop}
                    }, c), e && (this["__" + a.prop + "CacheValue"] = u), u
                  }, set: function (e) {
                    var n = new Error(""), r = n.stack.split("\n").slice(2).join("\n");
                    V({}, "api.setter", function () {
                      return {parentObjId: t.objId, objId: -1, prop: a.prop, value: e}
                    }, r)
                  }
                })
              };
              for (; r.length;) a()
            }(n = {objId: B()}, o[a.caller], o) : n = {};
            return V(n, "api.caller", function () {
              return {obj: p, parentObjId: t.objId, args: r, prop: a.prop}
            }, s), n
          };
          return p.objId = -1, void 0 !== a.getter && (p.objId = u, n(p, o[a.getter], o)), V(p, "api.getter", function () {
            return {parentObjId: t.objId, objId: p.objId, prop: a.prop}
          }, s), r && (this["__" + a.prop + "CacheValue"] = p), p
        }, set: function (e) {
          var n = new Error(""), r = n.stack.split("\n").slice(2).join("\n");
          V({}, "api.setter", function () {
            return {parentObjId: t.objId, objId: -1, prop: a.prop, value: e}
          }, r)
        }
      })
    };
    for (; r.length;) a()
  }(b, d, v), b.Events = u, b.Enum = p, a.Enum = b.Enum, a.Events = b.Events, x(a.url)) {
    case o.writer:
      a.WordApplication = a.WpsApplication = function () {
        return b
      };
      break;
    case o.spreadsheet:
      a.ExcelApplication = a.EtApplication = function () {
        return b
      };
      break;
    case o.presentation:
      a.PPTApplication = a.WppApplication = function () {
        return b
      };
      break;
    case o.pdf:
      a.PDFApplication = function () {
        return b
      }
  }
  a.Application = b, a.Free = function (e) {
    return j("api.free", {objId: e}, "")
  }, a.Stack = b.Stack = (c = function (e) {
    return a.Free(e)
  }, function () {
    var e = [], n = function (n) {
      e.push(n)
    };
    return S.add(n), {
      End: function () {
        c(e), S.delete(n)
      }
    }
  });
  var m = {};
  r.add(function (e) {
    return n(s, void 0, void 0, function () {
      var n, o, a, i, c;
      return t(this, function (t) {
        switch (t.label) {
          case 0:
            return "api.event" === (n = r.parse(e.data)).eventName && n.data ? (o = n.data, a = o.eventName, i = o.data, o.objIds, c = m[a] ? [4, I()] : [3, 2]) : [3, 2];
          case 1:
            t.sent(), c(i), t.label = 2;
            return;
          case 2:
            return [2]
        }
      })
    })
  }), b.Sub = {}, Object.values(u).forEach(function (e) {
    Object.defineProperty(b.Sub, e, {
      set: function (n) {
        m[e] = n, f({eventName: "api.event.register", data: {eventName: e, register: !!n, objId: ++A}})
      }
    })
  })
}

var D,
  T = ["ExportAsFixedFormat", "GetOperatorsInfo", "ImportDataIntoFields", "ReplaceText", "ReplaceBookmark", "GetBookmarkText", "GetComments"];

function V(e, n, t, r) {
  var o = j(n, t, r).then(function (n) {
    return n && n.objId ? (e.then = void 0, e.objId = n.objId, e) : n
  });
  e.then = function (e, n) {
    return o.then(e, n)
  }, e.Destroy = function () {
    return j("api.free", {objId: e.objId}, "")
  }
}

var R = "fileOpen", U = function (e) {
  return "api.ready" === e
}, W = function (e, n) {
  void 0 === e && (e = {});
  r.add(function (t) {
    var o = r.parse(t.data), a = o.eventName, i = void 0 === a ? "" : a, c = o.data, s = void 0 === c ? null : c,
      u = o.url, p = void 0 === u ? null : u;
    -1 === ["wps.jssdk.api"].indexOf(i) && ("ready" === i ? (f({
      eventName: "setConfig",
      data: e
    }), D.tokenData && f({
      eventName: "setToken",
      data: D.tokenData
    }), D.commandBars && f({
      eventName: "setCommandBars",
      data: D.commandBars
    }), D.iframeReady = !0) : "open.result" === i ? D.emit(R, s) : "api.ready" === i && L(D, s), "function" == typeof n[i] && n[i](D, p || s))
  })
};

function G(n) {
  void 0 === n && (n = {}), D && D.destroy();
  try {
    var t, o = _(n), a = o.wpsUrl, i = o.subscriptions, c = void 0 === i ? {} : i, s = o.mount,
      u = void 0 === s ? null : s, p = o.url, v = a || p, b = l(v, u);
    return delete o.mount, a && delete o.wpsUrl, p && delete o.url, delete o.subscriptions, D = {
      url: v,
      version: "1.1.1",
      iframe: b,
      Enum: e({}, O),
      iframeReady: !1,
      tokenData: null,
      commandBars: null,
      setToken: function (e) {
        D.tokenData = e, D.iframeReady && f({eventName: "setToken", data: e})
      },
      ready: function () {
        return t || (t = new Promise(function (e) {
          var n = function (t) {
            var o = r.parse(t.data).eventName;
            U(o) && (e(), r.remove(n))
          };
          r.add(n)
        }))
      },
      destroy: function () {
        b.destroy(), r.empty(), D = null, g(), S = new Set
      },
      save: function () {
        return d({api: "save"})
      },
      setCommandBars: function (e) {
        D.commandBars = e, D.iframeReady && f({eventName: "setCommandBars", data: e})
      },
      updateConfig: function (e) {
        void 0 === e && (e = {});
        var n = _(e, !1), t = n.subscriptions, o = void 0 === t ? {} : t;
        r.empty(), W(n, o), n && f({eventName: "setConfig", data: n})
      }
    }, D = e({}, D, new C.prototype.constructor), W(o, c), D.ready(), D
  } catch (e) {
    this.console.log(e)
  }
}

var z = Object.freeze({Listener: W, config: G});
window.WPS = z;
var J = G;
export default {config: G};
export {J as config};
