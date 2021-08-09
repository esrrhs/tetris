/*! For license information please see beacon_web.min.js.LICENSE.txt */
!function (e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.BeaconAction = t() : e.BeaconAction = t()
}(window, (function () {
    return function (e) {
        var t = {};

        function n(r) {
            if (t[r]) return t[r].exports;
            var o = t[r] = {i: r, l: !1, exports: {}};
            return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
        }

        return n.m = e, n.c = t, n.d = function (e, t, r) {
            n.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: r})
        }, n.r = function (e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
        }, n.t = function (e, t) {
            if (1 & t && (e = n(e)), 8 & t) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var r = Object.create(null);
            if (n.r(r), Object.defineProperty(r, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e) for (var o in e) n.d(r, o, function (t) {
                return e[t]
            }.bind(null, o));
            return r
        }, n.n = function (e) {
            var t = e && e.__esModule ? function () {
                return e.default
            } : function () {
                return e
            };
            return n.d(t, "a", t), t
        }, n.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, n.p = "", n(n.s = 39)
    }([function (e, t, n) {
        "use strict";
        var r = n(8), o = Object.prototype.toString;

        function i(e) {
            return "[object Array]" === o.call(e)
        }

        function a(e) {
            return void 0 === e
        }

        function s(e) {
            return null !== e && "object" == typeof e
        }

        function u(e) {
            if ("[object Object]" !== o.call(e)) return !1;
            var t = Object.getPrototypeOf(e);
            return null === t || t === Object.prototype
        }

        function c(e) {
            return "[object Function]" === o.call(e)
        }

        function f(e, t) {
            if (null != e) if ("object" != typeof e && (e = [e]), i(e)) for (var n = 0, r = e.length; n < r; n++) t.call(null, e[n], n, e); else for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && t.call(null, e[o], o, e)
        }

        e.exports = {
            isArray: i, isArrayBuffer: function (e) {
                return "[object ArrayBuffer]" === o.call(e)
            }, isBuffer: function (e) {
                return null !== e && !a(e) && null !== e.constructor && !a(e.constructor) && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
            }, isFormData: function (e) {
                return "undefined" != typeof FormData && e instanceof FormData
            }, isArrayBufferView: function (e) {
                return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && e.buffer instanceof ArrayBuffer
            }, isString: function (e) {
                return "string" == typeof e
            }, isNumber: function (e) {
                return "number" == typeof e
            }, isObject: s, isPlainObject: u, isUndefined: a, isDate: function (e) {
                return "[object Date]" === o.call(e)
            }, isFile: function (e) {
                return "[object File]" === o.call(e)
            }, isBlob: function (e) {
                return "[object Blob]" === o.call(e)
            }, isFunction: c, isStream: function (e) {
                return s(e) && c(e.pipe)
            }, isURLSearchParams: function (e) {
                return "undefined" != typeof URLSearchParams && e instanceof URLSearchParams
            }, isStandardBrowserEnv: function () {
                return ("undefined" == typeof navigator || "ReactNative" !== navigator.product && "NativeScript" !== navigator.product && "NS" !== navigator.product) && ("undefined" != typeof window && "undefined" != typeof document)
            }, forEach: f, merge: function e() {
                var t = {};

                function n(n, r) {
                    u(t[r]) && u(n) ? t[r] = e(t[r], n) : u(n) ? t[r] = e({}, n) : i(n) ? t[r] = n.slice() : t[r] = n
                }

                for (var r = 0, o = arguments.length; r < o; r++) f(arguments[r], n);
                return t
            }, extend: function (e, t, n) {
                return f(t, (function (t, o) {
                    e[o] = n && "function" == typeof t ? r(t, n) : t
                })), e
            }, trim: function (e) {
                return e.replace(/^\s*/, "").replace(/\s*$/, "")
            }, stripBOM: function (e) {
                return 65279 === e.charCodeAt(0) && (e = e.slice(1)), e
            }
        }
    }, function (e, t, n) {
        e.exports = n(18)
    }, function (e, t, n) {
        "use strict";
        n.d(t, "a", (function () {
            return r
        })), n.d(t, "b", (function () {
            return o
        }));
        var r = function () {
            function e() {
                var e = this;
                this.emit = function (t, n) {
                    if (e) {
                        var r, o = e.__EventsList[t];
                        if (null == o ? void 0 : o.length) {
                            o = o.slice();
                            for (var i = 0; i < o.length; i++) {
                                r = o[i];
                                try {
                                    var a = r.callback.apply(e, [n]);
                                    if (1 === r.type && e.remove(t, r.callback), !1 === a) break
                                } catch (e) {
                                    throw e
                                }
                            }
                        }
                        return e
                    }
                }, this.__EventsList = {}
            }

            return e.prototype.indexOf = function (e, t) {
                for (var n = 0; n < e.length; n++) if (e[n].callback === t) return n;
                return -1
            }, e.prototype.on = function (e, t, n) {
                if (void 0 === n && (n = 0), this) {
                    var r = this.__EventsList[e];
                    if (r || (r = this.__EventsList[e] = []), -1 === this.indexOf(r, t)) {
                        var o = {name: e, type: n || 0, callback: t};
                        return r.push(o), this
                    }
                    return this
                }
            }, e.prototype.one = function (e, t) {
                this.on(e, t, 1)
            }, e.prototype.remove = function (e, t) {
                if (this) {
                    var n = this.__EventsList[e];
                    if (!n) return null;
                    if (!t) {
                        try {
                            delete this.__EventsList[e]
                        } catch (e) {
                        }
                        return null
                    }
                    if (n.length) {
                        var r = this.indexOf(n, t);
                        n.splice(r, 1)
                    }
                    return this
                }
            }, e
        }();

        function o(e, t) {
            if (!e) throw t instanceof Error ? t : new Error(t)
        }
    }, function (e, t, n) {
        (function (t) {
            e.exports = function e(t, n, r) {
                function o(a, s) {
                    if (!n[a]) {
                        if (!t[a]) {
                            if (i) return i(a, !0);
                            var u = new Error("Cannot find module '" + a + "'");
                            throw u.code = "MODULE_NOT_FOUND", u
                        }
                        var c = n[a] = {exports: {}};
                        t[a][0].call(c.exports, (function (e) {
                            var n = t[a][1][e];
                            return o(n || e)
                        }), c, c.exports, e, t, n, r)
                    }
                    return n[a].exports
                }

                for (var i = !1, a = 0; a < r.length; a++) o(r[a]);
                return o
            }({
                1: [function (e, n, r) {
                    (function (e) {
                        "use strict";
                        var t, r, o = e.MutationObserver || e.WebKitMutationObserver;
                        if (o) {
                            var i = 0, a = new o(f), s = e.document.createTextNode("");
                            a.observe(s, {characterData: !0}), t = function () {
                                s.data = i = ++i % 2
                            }
                        } else if (e.setImmediate || void 0 === e.MessageChannel) t = "document" in e && "onreadystatechange" in e.document.createElement("script") ? function () {
                            var t = e.document.createElement("script");
                            t.onreadystatechange = function () {
                                f(), t.onreadystatechange = null, t.parentNode.removeChild(t), t = null
                            }, e.document.documentElement.appendChild(t)
                        } : function () {
                            setTimeout(f, 0)
                        }; else {
                            var u = new e.MessageChannel;
                            u.port1.onmessage = f, t = function () {
                                u.port2.postMessage(0)
                            }
                        }
                        var c = [];

                        function f() {
                            var e, t;
                            r = !0;
                            for (var n = c.length; n;) {
                                for (t = c, c = [], e = -1; ++e < n;) t[e]();
                                n = c.length
                            }
                            r = !1
                        }

                        n.exports = function (e) {
                            1 !== c.push(e) || r || t()
                        }
                    }).call(this, void 0 !== t ? t : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {}], 2: [function (e, t, n) {
                    "use strict";
                    var r = e(1);

                    function o() {
                    }

                    var i = {}, a = ["REJECTED"], s = ["FULFILLED"], u = ["PENDING"];

                    function c(e) {
                        if ("function" != typeof e) throw new TypeError("resolver must be a function");
                        this.state = u, this.queue = [], this.outcome = void 0, e !== o && p(this, e)
                    }

                    function f(e, t, n) {
                        this.promise = e, "function" == typeof t && (this.onFulfilled = t, this.callFulfilled = this.otherCallFulfilled), "function" == typeof n && (this.onRejected = n, this.callRejected = this.otherCallRejected)
                    }

                    function l(e, t, n) {
                        r((function () {
                            var r;
                            try {
                                r = t(n)
                            } catch (t) {
                                return i.reject(e, t)
                            }
                            r === e ? i.reject(e, new TypeError("Cannot resolve promise with itself")) : i.resolve(e, r)
                        }))
                    }

                    function d(e) {
                        var t = e && e.then;
                        if (e && ("object" == typeof e || "function" == typeof e) && "function" == typeof t) return function () {
                            t.apply(e, arguments)
                        }
                    }

                    function p(e, t) {
                        var n = !1;

                        function r(t) {
                            n || (n = !0, i.reject(e, t))
                        }

                        function o(t) {
                            n || (n = !0, i.resolve(e, t))
                        }

                        var a = h((function () {
                            t(o, r)
                        }));
                        "error" === a.status && r(a.value)
                    }

                    function h(e, t) {
                        var n = {};
                        try {
                            n.value = e(t), n.status = "success"
                        } catch (e) {
                            n.status = "error", n.value = e
                        }
                        return n
                    }

                    t.exports = c, c.prototype.catch = function (e) {
                        return this.then(null, e)
                    }, c.prototype.then = function (e, t) {
                        if ("function" != typeof e && this.state === s || "function" != typeof t && this.state === a) return this;
                        var n = new this.constructor(o);
                        return this.state !== u ? l(n, this.state === s ? e : t, this.outcome) : this.queue.push(new f(n, e, t)), n
                    }, f.prototype.callFulfilled = function (e) {
                        i.resolve(this.promise, e)
                    }, f.prototype.otherCallFulfilled = function (e) {
                        l(this.promise, this.onFulfilled, e)
                    }, f.prototype.callRejected = function (e) {
                        i.reject(this.promise, e)
                    }, f.prototype.otherCallRejected = function (e) {
                        l(this.promise, this.onRejected, e)
                    }, i.resolve = function (e, t) {
                        var n = h(d, t);
                        if ("error" === n.status) return i.reject(e, n.value);
                        var r = n.value;
                        if (r) p(e, r); else {
                            e.state = s, e.outcome = t;
                            for (var o = -1, a = e.queue.length; ++o < a;) e.queue[o].callFulfilled(t)
                        }
                        return e
                    }, i.reject = function (e, t) {
                        e.state = a, e.outcome = t;
                        for (var n = -1, r = e.queue.length; ++n < r;) e.queue[n].callRejected(t);
                        return e
                    }, c.resolve = function (e) {
                        return e instanceof this ? e : i.resolve(new this(o), e)
                    }, c.reject = function (e) {
                        var t = new this(o);
                        return i.reject(t, e)
                    }, c.all = function (e) {
                        var t = this;
                        if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array"));
                        var n = e.length, r = !1;
                        if (!n) return this.resolve([]);
                        for (var a = new Array(n), s = 0, u = -1, c = new this(o); ++u < n;) f(e[u], u);
                        return c;

                        function f(e, o) {
                            t.resolve(e).then((function (e) {
                                a[o] = e, ++s !== n || r || (r = !0, i.resolve(c, a))
                            }), (function (e) {
                                r || (r = !0, i.reject(c, e))
                            }))
                        }
                    }, c.race = function (e) {
                        var t = this;
                        if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array"));
                        var n = e.length, r = !1;
                        if (!n) return this.resolve([]);
                        for (var a, s = -1, u = new this(o); ++s < n;) a = e[s], t.resolve(a).then((function (e) {
                            r || (r = !0, i.resolve(u, e))
                        }), (function (e) {
                            r || (r = !0, i.reject(u, e))
                        }));
                        return u
                    }
                }, {1: 1}], 3: [function (e, n, r) {
                    (function (t) {
                        "use strict";
                        "function" != typeof t.Promise && (t.Promise = e(2))
                    }).call(this, void 0 !== t ? t : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {2: 2}], 4: [function (e, t, n) {
                    "use strict";
                    var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                        return typeof e
                    } : function (e) {
                        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                    }, o = function () {
                        try {
                            if ("undefined" != typeof indexedDB) return indexedDB;
                            if ("undefined" != typeof webkitIndexedDB) return webkitIndexedDB;
                            if ("undefined" != typeof mozIndexedDB) return mozIndexedDB;
                            if ("undefined" != typeof OIndexedDB) return OIndexedDB;
                            if ("undefined" != typeof msIndexedDB) return msIndexedDB
                        } catch (e) {
                            return
                        }
                    }();

                    function i(e, t) {
                        e = e || [], t = t || {};
                        try {
                            return new Blob(e, t)
                        } catch (o) {
                            if ("TypeError" !== o.name) throw o;
                            for (var n = new ("undefined" != typeof BlobBuilder ? BlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : WebKitBlobBuilder), r = 0; r < e.length; r += 1) n.append(e[r]);
                            return n.getBlob(t.type)
                        }
                    }

                    "undefined" == typeof Promise && e(3);
                    var a = Promise;

                    function s(e, t) {
                        t && e.then((function (e) {
                            t(null, e)
                        }), (function (e) {
                            t(e)
                        }))
                    }

                    function u(e, t, n) {
                        "function" == typeof t && e.then(t), "function" == typeof n && e.catch(n)
                    }

                    function c(e) {
                        return "string" != typeof e && (e = String(e)), e
                    }

                    function f() {
                        if (arguments.length && "function" == typeof arguments[arguments.length - 1]) return arguments[arguments.length - 1]
                    }

                    var l = void 0, d = {}, p = Object.prototype.toString;

                    function h(e) {
                        return "boolean" == typeof l ? a.resolve(l) : function (e) {
                            return new a((function (t) {
                                var n = e.transaction("local-forage-detect-blob-support", "readwrite"), r = i([""]);
                                n.objectStore("local-forage-detect-blob-support").put(r, "key"), n.onabort = function (e) {
                                    e.preventDefault(), e.stopPropagation(), t(!1)
                                }, n.oncomplete = function () {
                                    var e = navigator.userAgent.match(/Chrome\/(\d+)/),
                                        n = navigator.userAgent.match(/Edge\//);
                                    t(n || !e || parseInt(e[1], 10) >= 43)
                                }
                            })).catch((function () {
                                return !1
                            }))
                        }(e).then((function (e) {
                            return l = e
                        }))
                    }

                    function v(e) {
                        var t = d[e.name], n = {};
                        n.promise = new a((function (e, t) {
                            n.resolve = e, n.reject = t
                        })), t.deferredOperations.push(n), t.dbReady ? t.dbReady = t.dbReady.then((function () {
                            return n.promise
                        })) : t.dbReady = n.promise
                    }

                    function y(e) {
                        var t = d[e.name].deferredOperations.pop();
                        if (t) return t.resolve(), t.promise
                    }

                    function m(e, t) {
                        var n = d[e.name].deferredOperations.pop();
                        if (n) return n.reject(t), n.promise
                    }

                    function g(e, t) {
                        return new a((function (n, r) {
                            if (d[e.name] = d[e.name] || {
                                forages: [],
                                db: null,
                                dbReady: null,
                                deferredOperations: []
                            }, e.db) {
                                if (!t) return n(e.db);
                                v(e), e.db.close()
                            }
                            var i = [e.name];
                            t && i.push(e.version);
                            var a = o.open.apply(o, i);
                            t && (a.onupgradeneeded = function (t) {
                                var n = a.result;
                                try {
                                    n.createObjectStore(e.storeName), t.oldVersion <= 1 && n.createObjectStore("local-forage-detect-blob-support")
                                } catch (e) {
                                    if ("ConstraintError" !== e.name) throw e
                                }
                            }), a.onerror = function (e) {
                                e.preventDefault(), r(a.error)
                            }, a.onsuccess = function () {
                                n(a.result), y(e)
                            }
                        }))
                    }

                    function b(e) {
                        return g(e, !1)
                    }

                    function _(e) {
                        return g(e, !0)
                    }

                    function E(e, t) {
                        if (!e.db) return !0;
                        var n = !e.db.objectStoreNames.contains(e.storeName), r = e.version < e.db.version,
                            o = e.version > e.db.version;
                        if (r && (e.version, e.version = e.db.version), o || n) {
                            if (n) {
                                var i = e.db.version + 1;
                                i > e.version && (e.version = i)
                            }
                            return !0
                        }
                        return !1
                    }

                    function w(e) {
                        return i([function (e) {
                            for (var t = e.length, n = new ArrayBuffer(t), r = new Uint8Array(n), o = 0; o < t; o++) r[o] = e.charCodeAt(o);
                            return n
                        }(atob(e.data))], {type: e.type})
                    }

                    function I(e) {
                        return e && e.__local_forage_encoded_blob
                    }

                    function S(e) {
                        var t = this, n = t._initReady().then((function () {
                            var e = d[t._dbInfo.name];
                            if (e && e.dbReady) return e.dbReady
                        }));
                        return u(n, e, e), n
                    }

                    function O(e, t, n, r) {
                        void 0 === r && (r = 1);
                        try {
                            var o = e.db.transaction(e.storeName, t);
                            n(null, o)
                        } catch (o) {
                            if (r > 0 && (!e.db || "InvalidStateError" === o.name || "NotFoundError" === o.name)) return a.resolve().then((function () {
                                if (!e.db || "NotFoundError" === o.name && !e.db.objectStoreNames.contains(e.storeName) && e.version <= e.db.version) return e.db && (e.version = e.db.version + 1), _(e)
                            })).then((function () {
                                return function (e) {
                                    v(e);
                                    for (var t = d[e.name], n = t.forages, r = 0; r < n.length; r++) {
                                        var o = n[r];
                                        o._dbInfo.db && (o._dbInfo.db.close(), o._dbInfo.db = null)
                                    }
                                    return e.db = null, b(e).then((function (t) {
                                        return e.db = t, E(e) ? _(e) : t
                                    })).then((function (r) {
                                        e.db = t.db = r;
                                        for (var o = 0; o < n.length; o++) n[o]._dbInfo.db = r
                                    })).catch((function (t) {
                                        throw m(e, t), t
                                    }))
                                }(e).then((function () {
                                    O(e, t, n, r - 1)
                                }))
                            })).catch(n);
                            n(o)
                        }
                    }

                    var R = {
                            _driver: "asyncStorage", _initStorage: function (e) {
                                var t = this, n = {db: null};
                                if (e) for (var r in e) n[r] = e[r];
                                var o = d[n.name];
                                o || (o = {
                                    forages: [],
                                    db: null,
                                    dbReady: null,
                                    deferredOperations: []
                                }, d[n.name] = o), o.forages.push(t), t._initReady || (t._initReady = t.ready, t.ready = S);
                                var i = [];

                                function s() {
                                    return a.resolve()
                                }

                                for (var u = 0; u < o.forages.length; u++) {
                                    var c = o.forages[u];
                                    c !== t && i.push(c._initReady().catch(s))
                                }
                                var f = o.forages.slice(0);
                                return a.all(i).then((function () {
                                    return n.db = o.db, b(n)
                                })).then((function (e) {
                                    return n.db = e, E(n, t._defaultConfig.version) ? _(n) : e
                                })).then((function (e) {
                                    n.db = o.db = e, t._dbInfo = n;
                                    for (var r = 0; r < f.length; r++) {
                                        var i = f[r];
                                        i !== t && (i._dbInfo.db = n.db, i._dbInfo.version = n.version)
                                    }
                                }))
                            }, _support: function () {
                                try {
                                    if (!o || !o.open) return !1;
                                    var e = "undefined" != typeof openDatabase && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform),
                                        t = "function" == typeof fetch && -1 !== fetch.toString().indexOf("[native code");
                                    return (!e || t) && "undefined" != typeof indexedDB && "undefined" != typeof IDBKeyRange
                                } catch (e) {
                                    return !1
                                }
                            }(), iterate: function (e, t) {
                                var n = this, r = new a((function (t, r) {
                                    n.ready().then((function () {
                                        O(n._dbInfo, "readonly", (function (o, i) {
                                            if (o) return r(o);
                                            try {
                                                var a = i.objectStore(n._dbInfo.storeName).openCursor(), s = 1;
                                                a.onsuccess = function () {
                                                    var n = a.result;
                                                    if (n) {
                                                        var r = n.value;
                                                        I(r) && (r = w(r));
                                                        var o = e(r, n.key, s++);
                                                        void 0 !== o ? t(o) : n.continue()
                                                    } else t()
                                                }, a.onerror = function () {
                                                    r(a.error)
                                                }
                                            } catch (e) {
                                                r(e)
                                            }
                                        }))
                                    })).catch(r)
                                }));
                                return s(r, t), r
                            }, getItem: function (e, t) {
                                var n = this;
                                e = c(e);
                                var r = new a((function (t, r) {
                                    n.ready().then((function () {
                                        O(n._dbInfo, "readonly", (function (o, i) {
                                            if (o) return r(o);
                                            try {
                                                var a = i.objectStore(n._dbInfo.storeName).get(e);
                                                a.onsuccess = function () {
                                                    var e = a.result;
                                                    void 0 === e && (e = null), I(e) && (e = w(e)), t(e)
                                                }, a.onerror = function () {
                                                    r(a.error)
                                                }
                                            } catch (e) {
                                                r(e)
                                            }
                                        }))
                                    })).catch(r)
                                }));
                                return s(r, t), r
                            }, setItem: function (e, t, n) {
                                var r = this;
                                e = c(e);
                                var o = new a((function (n, o) {
                                    var i;
                                    r.ready().then((function () {
                                        return i = r._dbInfo, "[object Blob]" === p.call(t) ? h(i.db).then((function (e) {
                                            return e ? t : (n = t, new a((function (e, t) {
                                                var r = new FileReader;
                                                r.onerror = t, r.onloadend = function (t) {
                                                    var r = btoa(t.target.result || "");
                                                    e({__local_forage_encoded_blob: !0, data: r, type: n.type})
                                                }, r.readAsBinaryString(n)
                                            })));
                                            var n
                                        })) : t
                                    })).then((function (t) {
                                        O(r._dbInfo, "readwrite", (function (i, a) {
                                            if (i) return o(i);
                                            try {
                                                var s = a.objectStore(r._dbInfo.storeName);
                                                null === t && (t = void 0);
                                                var u = s.put(t, e);
                                                a.oncomplete = function () {
                                                    void 0 === t && (t = null), n(t)
                                                }, a.onabort = a.onerror = function () {
                                                    var e = u.error ? u.error : u.transaction.error;
                                                    o(e)
                                                }
                                            } catch (e) {
                                                o(e)
                                            }
                                        }))
                                    })).catch(o)
                                }));
                                return s(o, n), o
                            }, removeItem: function (e, t) {
                                var n = this;
                                e = c(e);
                                var r = new a((function (t, r) {
                                    n.ready().then((function () {
                                        O(n._dbInfo, "readwrite", (function (o, i) {
                                            if (o) return r(o);
                                            try {
                                                var a = i.objectStore(n._dbInfo.storeName).delete(e);
                                                i.oncomplete = function () {
                                                    t()
                                                }, i.onerror = function () {
                                                    r(a.error)
                                                }, i.onabort = function () {
                                                    var e = a.error ? a.error : a.transaction.error;
                                                    r(e)
                                                }
                                            } catch (e) {
                                                r(e)
                                            }
                                        }))
                                    })).catch(r)
                                }));
                                return s(r, t), r
                            }, clear: function (e) {
                                var t = this, n = new a((function (e, n) {
                                    t.ready().then((function () {
                                        O(t._dbInfo, "readwrite", (function (r, o) {
                                            if (r) return n(r);
                                            try {
                                                var i = o.objectStore(t._dbInfo.storeName).clear();
                                                o.oncomplete = function () {
                                                    e()
                                                }, o.onabort = o.onerror = function () {
                                                    var e = i.error ? i.error : i.transaction.error;
                                                    n(e)
                                                }
                                            } catch (e) {
                                                n(e)
                                            }
                                        }))
                                    })).catch(n)
                                }));
                                return s(n, e), n
                            }, length: function (e) {
                                var t = this, n = new a((function (e, n) {
                                    t.ready().then((function () {
                                        O(t._dbInfo, "readonly", (function (r, o) {
                                            if (r) return n(r);
                                            try {
                                                var i = o.objectStore(t._dbInfo.storeName).count();
                                                i.onsuccess = function () {
                                                    e(i.result)
                                                }, i.onerror = function () {
                                                    n(i.error)
                                                }
                                            } catch (e) {
                                                n(e)
                                            }
                                        }))
                                    })).catch(n)
                                }));
                                return s(n, e), n
                            }, key: function (e, t) {
                                var n = this, r = new a((function (t, r) {
                                    e < 0 ? t(null) : n.ready().then((function () {
                                        O(n._dbInfo, "readonly", (function (o, i) {
                                            if (o) return r(o);
                                            try {
                                                var a = i.objectStore(n._dbInfo.storeName), s = !1, u = a.openKeyCursor();
                                                u.onsuccess = function () {
                                                    var n = u.result;
                                                    n ? 0 === e || s ? t(n.key) : (s = !0, n.advance(e)) : t(null)
                                                }, u.onerror = function () {
                                                    r(u.error)
                                                }
                                            } catch (e) {
                                                r(e)
                                            }
                                        }))
                                    })).catch(r)
                                }));
                                return s(r, t), r
                            }, keys: function (e) {
                                var t = this, n = new a((function (e, n) {
                                    t.ready().then((function () {
                                        O(t._dbInfo, "readonly", (function (r, o) {
                                            if (r) return n(r);
                                            try {
                                                var i = o.objectStore(t._dbInfo.storeName).openKeyCursor(), a = [];
                                                i.onsuccess = function () {
                                                    var t = i.result;
                                                    t ? (a.push(t.key), t.continue()) : e(a)
                                                }, i.onerror = function () {
                                                    n(i.error)
                                                }
                                            } catch (e) {
                                                n(e)
                                            }
                                        }))
                                    })).catch(n)
                                }));
                                return s(n, e), n
                            }, dropInstance: function (e, t) {
                                t = f.apply(this, arguments);
                                var n = this.config();
                                (e = "function" != typeof e && e || {}).name || (e.name = e.name || n.name, e.storeName = e.storeName || n.storeName);
                                var r, i = this;
                                if (e.name) {
                                    var u = e.name === n.name && i._dbInfo.db,
                                        c = u ? a.resolve(i._dbInfo.db) : b(e).then((function (t) {
                                            var n = d[e.name], r = n.forages;
                                            n.db = t;
                                            for (var o = 0; o < r.length; o++) r[o]._dbInfo.db = t;
                                            return t
                                        }));
                                    r = e.storeName ? c.then((function (t) {
                                        if (t.objectStoreNames.contains(e.storeName)) {
                                            var n = t.version + 1;
                                            v(e);
                                            var r = d[e.name], i = r.forages;
                                            t.close();
                                            for (var s = 0; s < i.length; s++) {
                                                var u = i[s];
                                                u._dbInfo.db = null, u._dbInfo.version = n
                                            }
                                            return new a((function (t, r) {
                                                var i = o.open(e.name, n);
                                                i.onerror = function (e) {
                                                    i.result.close(), r(e)
                                                }, i.onupgradeneeded = function () {
                                                    i.result.deleteObjectStore(e.storeName)
                                                }, i.onsuccess = function () {
                                                    var e = i.result;
                                                    e.close(), t(e)
                                                }
                                            })).then((function (e) {
                                                r.db = e;
                                                for (var t = 0; t < i.length; t++) {
                                                    var n = i[t];
                                                    n._dbInfo.db = e, y(n._dbInfo)
                                                }
                                            })).catch((function (t) {
                                                throw(m(e, t) || a.resolve()).catch((function () {
                                                })), t
                                            }))
                                        }
                                    })) : c.then((function (t) {
                                        v(e);
                                        var n = d[e.name], r = n.forages;
                                        t.close();
                                        for (var i = 0; i < r.length; i++) r[i]._dbInfo.db = null;
                                        return new a((function (t, n) {
                                            var r = o.deleteDatabase(e.name);
                                            r.onerror = r.onblocked = function (e) {
                                                var t = r.result;
                                                t && t.close(), n(e)
                                            }, r.onsuccess = function () {
                                                var e = r.result;
                                                e && e.close(), t(e)
                                            }
                                        })).then((function (e) {
                                            n.db = e;
                                            for (var t = 0; t < r.length; t++) y(r[t]._dbInfo)
                                        })).catch((function (t) {
                                            throw(m(e, t) || a.resolve()).catch((function () {
                                            })), t
                                        }))
                                    }))
                                } else r = a.reject("Invalid arguments");
                                return s(r, t), r
                            }
                        }, N = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                        T = /^~~local_forage_type~([^~]+)~/, A = "__lfsc__:".length, x = A + "arbf".length,
                        C = Object.prototype.toString;

                    function D(e) {
                        var t, n, r, o, i, a = .75 * e.length, s = e.length, u = 0;
                        "=" === e[e.length - 1] && (a--, "=" === e[e.length - 2] && a--);
                        var c = new ArrayBuffer(a), f = new Uint8Array(c);
                        for (t = 0; t < s; t += 4) n = N.indexOf(e[t]), r = N.indexOf(e[t + 1]), o = N.indexOf(e[t + 2]), i = N.indexOf(e[t + 3]), f[u++] = n << 2 | r >> 4, f[u++] = (15 & r) << 4 | o >> 2, f[u++] = (3 & o) << 6 | 63 & i;
                        return c
                    }

                    function j(e) {
                        var t, n = new Uint8Array(e), r = "";
                        for (t = 0; t < n.length; t += 3) r += N[n[t] >> 2], r += N[(3 & n[t]) << 4 | n[t + 1] >> 4], r += N[(15 & n[t + 1]) << 2 | n[t + 2] >> 6], r += N[63 & n[t + 2]];
                        return n.length % 3 == 2 ? r = r.substring(0, r.length - 1) + "=" : n.length % 3 == 1 && (r = r.substring(0, r.length - 2) + "=="), r
                    }

                    var k = {
                        serialize: function (e, t) {
                            var n = "";
                            if (e && (n = C.call(e)), e && ("[object ArrayBuffer]" === n || e.buffer && "[object ArrayBuffer]" === C.call(e.buffer))) {
                                var r, o = "__lfsc__:";
                                e instanceof ArrayBuffer ? (r = e, o += "arbf") : (r = e.buffer, "[object Int8Array]" === n ? o += "si08" : "[object Uint8Array]" === n ? o += "ui08" : "[object Uint8ClampedArray]" === n ? o += "uic8" : "[object Int16Array]" === n ? o += "si16" : "[object Uint16Array]" === n ? o += "ur16" : "[object Int32Array]" === n ? o += "si32" : "[object Uint32Array]" === n ? o += "ui32" : "[object Float32Array]" === n ? o += "fl32" : "[object Float64Array]" === n ? o += "fl64" : t(new Error("Failed to get type for BinaryArray"))), t(o + j(r))
                            } else if ("[object Blob]" === n) {
                                var i = new FileReader;
                                i.onload = function () {
                                    var n = "~~local_forage_type~" + e.type + "~" + j(this.result);
                                    t("__lfsc__:blob" + n)
                                }, i.readAsArrayBuffer(e)
                            } else try {
                                t(JSON.stringify(e))
                            } catch (e) {
                                t(null, e)
                            }
                        }, deserialize: function (e) {
                            if ("__lfsc__:" !== e.substring(0, A)) return JSON.parse(e);
                            var t, n = e.substring(x), r = e.substring(A, x);
                            if ("blob" === r && T.test(n)) {
                                var o = n.match(T);
                                t = o[1], n = n.substring(o[0].length)
                            }
                            var a = D(n);
                            switch (r) {
                                case"arbf":
                                    return a;
                                case"blob":
                                    return i([a], {type: t});
                                case"si08":
                                    return new Int8Array(a);
                                case"ui08":
                                    return new Uint8Array(a);
                                case"uic8":
                                    return new Uint8ClampedArray(a);
                                case"si16":
                                    return new Int16Array(a);
                                case"ur16":
                                    return new Uint16Array(a);
                                case"si32":
                                    return new Int32Array(a);
                                case"ui32":
                                    return new Uint32Array(a);
                                case"fl32":
                                    return new Float32Array(a);
                                case"fl64":
                                    return new Float64Array(a);
                                default:
                                    throw new Error("Unkown type: " + r)
                            }
                        }, stringToBuffer: D, bufferToString: j
                    };

                    function U(e, t, n, r) {
                        e.executeSql("CREATE TABLE IF NOT EXISTS " + t.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], n, r)
                    }

                    function B(e, t, n, r, o, i) {
                        e.executeSql(n, r, o, (function (e, a) {
                            a.code === a.SYNTAX_ERR ? e.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [t.storeName], (function (e, s) {
                                s.rows.length ? i(e, a) : U(e, t, (function () {
                                    e.executeSql(n, r, o, i)
                                }), i)
                            }), i) : i(e, a)
                        }), i)
                    }

                    function P(e, t, n, r) {
                        var o = this;
                        e = c(e);
                        var i = new a((function (i, a) {
                            o.ready().then((function () {
                                void 0 === t && (t = null);
                                var s = t, u = o._dbInfo;
                                u.serializer.serialize(t, (function (t, c) {
                                    c ? a(c) : u.db.transaction((function (n) {
                                        B(n, u, "INSERT OR REPLACE INTO " + u.storeName + " (key, value) VALUES (?, ?)", [e, t], (function () {
                                            i(s)
                                        }), (function (e, t) {
                                            a(t)
                                        }))
                                    }), (function (t) {
                                        if (t.code === t.QUOTA_ERR) {
                                            if (r > 0) return void i(P.apply(o, [e, s, n, r - 1]));
                                            a(t)
                                        }
                                    }))
                                }))
                            })).catch(a)
                        }));
                        return s(i, n), i
                    }

                    function L(e) {
                        return new a((function (t, n) {
                            e.transaction((function (r) {
                                r.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], (function (n, r) {
                                    for (var o = [], i = 0; i < r.rows.length; i++) o.push(r.rows.item(i).name);
                                    t({db: e, storeNames: o})
                                }), (function (e, t) {
                                    n(t)
                                }))
                            }), (function (e) {
                                n(e)
                            }))
                        }))
                    }

                    var q = {
                        _driver: "webSQLStorage", _initStorage: function (e) {
                            var t = this, n = {db: null};
                            if (e) for (var r in e) n[r] = "string" != typeof e[r] ? e[r].toString() : e[r];
                            var o = new a((function (e, r) {
                                try {
                                    n.db = openDatabase(n.name, String(n.version), n.description, n.size)
                                } catch (e) {
                                    return r(e)
                                }
                                n.db.transaction((function (o) {
                                    U(o, n, (function () {
                                        t._dbInfo = n, e()
                                    }), (function (e, t) {
                                        r(t)
                                    }))
                                }), r)
                            }));
                            return n.serializer = k, o
                        }, _support: "function" == typeof openDatabase, iterate: function (e, t) {
                            var n = this, r = new a((function (t, r) {
                                n.ready().then((function () {
                                    var o = n._dbInfo;
                                    o.db.transaction((function (n) {
                                        B(n, o, "SELECT * FROM " + o.storeName, [], (function (n, r) {
                                            for (var i = r.rows, a = i.length, s = 0; s < a; s++) {
                                                var u = i.item(s), c = u.value;
                                                if (c && (c = o.serializer.deserialize(c)), void 0 !== (c = e(c, u.key, s + 1))) return void t(c)
                                            }
                                            t()
                                        }), (function (e, t) {
                                            r(t)
                                        }))
                                    }))
                                })).catch(r)
                            }));
                            return s(r, t), r
                        }, getItem: function (e, t) {
                            var n = this;
                            e = c(e);
                            var r = new a((function (t, r) {
                                n.ready().then((function () {
                                    var o = n._dbInfo;
                                    o.db.transaction((function (n) {
                                        B(n, o, "SELECT * FROM " + o.storeName + " WHERE key = ? LIMIT 1", [e], (function (e, n) {
                                            var r = n.rows.length ? n.rows.item(0).value : null;
                                            r && (r = o.serializer.deserialize(r)), t(r)
                                        }), (function (e, t) {
                                            r(t)
                                        }))
                                    }))
                                })).catch(r)
                            }));
                            return s(r, t), r
                        }, setItem: function (e, t, n) {
                            return P.apply(this, [e, t, n, 1])
                        }, removeItem: function (e, t) {
                            var n = this;
                            e = c(e);
                            var r = new a((function (t, r) {
                                n.ready().then((function () {
                                    var o = n._dbInfo;
                                    o.db.transaction((function (n) {
                                        B(n, o, "DELETE FROM " + o.storeName + " WHERE key = ?", [e], (function () {
                                            t()
                                        }), (function (e, t) {
                                            r(t)
                                        }))
                                    }))
                                })).catch(r)
                            }));
                            return s(r, t), r
                        }, clear: function (e) {
                            var t = this, n = new a((function (e, n) {
                                t.ready().then((function () {
                                    var r = t._dbInfo;
                                    r.db.transaction((function (t) {
                                        B(t, r, "DELETE FROM " + r.storeName, [], (function () {
                                            e()
                                        }), (function (e, t) {
                                            n(t)
                                        }))
                                    }))
                                })).catch(n)
                            }));
                            return s(n, e), n
                        }, length: function (e) {
                            var t = this, n = new a((function (e, n) {
                                t.ready().then((function () {
                                    var r = t._dbInfo;
                                    r.db.transaction((function (t) {
                                        B(t, r, "SELECT COUNT(key) as c FROM " + r.storeName, [], (function (t, n) {
                                            var r = n.rows.item(0).c;
                                            e(r)
                                        }), (function (e, t) {
                                            n(t)
                                        }))
                                    }))
                                })).catch(n)
                            }));
                            return s(n, e), n
                        }, key: function (e, t) {
                            var n = this, r = new a((function (t, r) {
                                n.ready().then((function () {
                                    var o = n._dbInfo;
                                    o.db.transaction((function (n) {
                                        B(n, o, "SELECT key FROM " + o.storeName + " WHERE id = ? LIMIT 1", [e + 1], (function (e, n) {
                                            var r = n.rows.length ? n.rows.item(0).key : null;
                                            t(r)
                                        }), (function (e, t) {
                                            r(t)
                                        }))
                                    }))
                                })).catch(r)
                            }));
                            return s(r, t), r
                        }, keys: function (e) {
                            var t = this, n = new a((function (e, n) {
                                t.ready().then((function () {
                                    var r = t._dbInfo;
                                    r.db.transaction((function (t) {
                                        B(t, r, "SELECT key FROM " + r.storeName, [], (function (t, n) {
                                            for (var r = [], o = 0; o < n.rows.length; o++) r.push(n.rows.item(o).key);
                                            e(r)
                                        }), (function (e, t) {
                                            n(t)
                                        }))
                                    }))
                                })).catch(n)
                            }));
                            return s(n, e), n
                        }, dropInstance: function (e, t) {
                            t = f.apply(this, arguments);
                            var n = this.config();
                            (e = "function" != typeof e && e || {}).name || (e.name = e.name || n.name, e.storeName = e.storeName || n.storeName);
                            var r, o = this;
                            return s(r = e.name ? new a((function (t) {
                                var r;
                                r = e.name === n.name ? o._dbInfo.db : openDatabase(e.name, "", "", 0), e.storeName ? t({
                                    db: r,
                                    storeNames: [e.storeName]
                                }) : t(L(r))
                            })).then((function (e) {
                                return new a((function (t, n) {
                                    e.db.transaction((function (r) {
                                        function o(e) {
                                            return new a((function (t, n) {
                                                r.executeSql("DROP TABLE IF EXISTS " + e, [], (function () {
                                                    t()
                                                }), (function (e, t) {
                                                    n(t)
                                                }))
                                            }))
                                        }

                                        for (var i = [], s = 0, u = e.storeNames.length; s < u; s++) i.push(o(e.storeNames[s]));
                                        a.all(i).then((function () {
                                            t()
                                        })).catch((function (e) {
                                            n(e)
                                        }))
                                    }), (function (e) {
                                        n(e)
                                    }))
                                }))
                            })) : a.reject("Invalid arguments"), t), r
                        }
                    };

                    function F(e, t) {
                        var n = e.name + "/";
                        return e.storeName !== t.storeName && (n += e.storeName + "/"), n
                    }

                    function M() {
                        return !function () {
                            try {
                                return localStorage.setItem("_localforage_support_test", !0), localStorage.removeItem("_localforage_support_test"), !1
                            } catch (e) {
                                return !0
                            }
                        }() || localStorage.length > 0
                    }

                    var z = {
                            _driver: "localStorageWrapper", _initStorage: function (e) {
                                var t = {};
                                if (e) for (var n in e) t[n] = e[n];
                                return t.keyPrefix = F(e, this._defaultConfig), M() ? (this._dbInfo = t, t.serializer = k, a.resolve()) : a.reject()
                            }, _support: function () {
                                try {
                                    return "undefined" != typeof localStorage && "setItem" in localStorage && !!localStorage.setItem
                                } catch (e) {
                                    return !1
                                }
                            }(), iterate: function (e, t) {
                                var n = this, r = n.ready().then((function () {
                                    for (var t = n._dbInfo, r = t.keyPrefix, o = r.length, i = localStorage.length, a = 1, s = 0; s < i; s++) {
                                        var u = localStorage.key(s);
                                        if (0 === u.indexOf(r)) {
                                            var c = localStorage.getItem(u);
                                            if (c && (c = t.serializer.deserialize(c)), void 0 !== (c = e(c, u.substring(o), a++))) return c
                                        }
                                    }
                                }));
                                return s(r, t), r
                            }, getItem: function (e, t) {
                                var n = this;
                                e = c(e);
                                var r = n.ready().then((function () {
                                    var t = n._dbInfo, r = localStorage.getItem(t.keyPrefix + e);
                                    return r && (r = t.serializer.deserialize(r)), r
                                }));
                                return s(r, t), r
                            }, setItem: function (e, t, n) {
                                var r = this;
                                e = c(e);
                                var o = r.ready().then((function () {
                                    void 0 === t && (t = null);
                                    var n = t;
                                    return new a((function (o, i) {
                                        var a = r._dbInfo;
                                        a.serializer.serialize(t, (function (t, r) {
                                            if (r) i(r); else try {
                                                localStorage.setItem(a.keyPrefix + e, t), o(n)
                                            } catch (e) {
                                                "QuotaExceededError" !== e.name && "NS_ERROR_DOM_QUOTA_REACHED" !== e.name || i(e), i(e)
                                            }
                                        }))
                                    }))
                                }));
                                return s(o, n), o
                            }, removeItem: function (e, t) {
                                var n = this;
                                e = c(e);
                                var r = n.ready().then((function () {
                                    var t = n._dbInfo;
                                    localStorage.removeItem(t.keyPrefix + e)
                                }));
                                return s(r, t), r
                            }, clear: function (e) {
                                var t = this, n = t.ready().then((function () {
                                    for (var e = t._dbInfo.keyPrefix, n = localStorage.length - 1; n >= 0; n--) {
                                        var r = localStorage.key(n);
                                        0 === r.indexOf(e) && localStorage.removeItem(r)
                                    }
                                }));
                                return s(n, e), n
                            }, length: function (e) {
                                var t = this.keys().then((function (e) {
                                    return e.length
                                }));
                                return s(t, e), t
                            }, key: function (e, t) {
                                var n = this, r = n.ready().then((function () {
                                    var t, r = n._dbInfo;
                                    try {
                                        t = localStorage.key(e)
                                    } catch (e) {
                                        t = null
                                    }
                                    return t && (t = t.substring(r.keyPrefix.length)), t
                                }));
                                return s(r, t), r
                            }, keys: function (e) {
                                var t = this, n = t.ready().then((function () {
                                    for (var e = t._dbInfo, n = localStorage.length, r = [], o = 0; o < n; o++) {
                                        var i = localStorage.key(o);
                                        0 === i.indexOf(e.keyPrefix) && r.push(i.substring(e.keyPrefix.length))
                                    }
                                    return r
                                }));
                                return s(n, e), n
                            }, dropInstance: function (e, t) {
                                if (t = f.apply(this, arguments), !(e = "function" != typeof e && e || {}).name) {
                                    var n = this.config();
                                    e.name = e.name || n.name, e.storeName = e.storeName || n.storeName
                                }
                                var r, o = this;
                                return s(r = e.name ? new a((function (t) {
                                    e.storeName ? t(F(e, o._defaultConfig)) : t(e.name + "/")
                                })).then((function (e) {
                                    for (var t = localStorage.length - 1; t >= 0; t--) {
                                        var n = localStorage.key(t);
                                        0 === n.indexOf(e) && localStorage.removeItem(n)
                                    }
                                })) : a.reject("Invalid arguments"), t), r
                            }
                        }, H = function (e, t) {
                            for (var n, r, o = e.length, i = 0; i < o;) {
                                if ((n = e[i]) === (r = t) || "number" == typeof n && "number" == typeof r && isNaN(n) && isNaN(r)) return !0;
                                i++
                            }
                            return !1
                        }, V = Array.isArray || function (e) {
                            return "[object Array]" === Object.prototype.toString.call(e)
                        }, J = {}, G = {}, W = {INDEXEDDB: R, WEBSQL: q, LOCALSTORAGE: z},
                        X = [W.INDEXEDDB._driver, W.WEBSQL._driver, W.LOCALSTORAGE._driver], K = ["dropInstance"],
                        Y = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"].concat(K),
                        Q = {
                            description: "",
                            driver: X.slice(),
                            name: "localforage",
                            size: 4980736,
                            storeName: "keyvaluepairs",
                            version: 1
                        };

                    function $(e, t) {
                        e[t] = function () {
                            var n = arguments;
                            return e.ready().then((function () {
                                return e[t].apply(e, n)
                            }))
                        }
                    }

                    function Z() {
                        for (var e = 1; e < arguments.length; e++) {
                            var t = arguments[e];
                            if (t) for (var n in t) t.hasOwnProperty(n) && (V(t[n]) ? arguments[0][n] = t[n].slice() : arguments[0][n] = t[n])
                        }
                        return arguments[0]
                    }

                    var ee = new (function () {
                        function e(t) {
                            for (var n in function (e, t) {
                                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                            }(this, e), W) if (W.hasOwnProperty(n)) {
                                var r = W[n], o = r._driver;
                                this[n] = o, J[o] || this.defineDriver(r)
                            }
                            this._defaultConfig = Z({}, Q), this._config = Z({}, this._defaultConfig, t), this._driverSet = null, this._initDriver = null, this._ready = !1, this._dbInfo = null, this._wrapLibraryMethodsWithReady(), this.setDriver(this._config.driver).catch((function () {
                            }))
                        }

                        return e.prototype.config = function (e) {
                            if ("object" === (void 0 === e ? "undefined" : r(e))) {
                                if (this._ready) return new Error("Can't call config() after localforage has been used.");
                                for (var t in e) {
                                    if ("storeName" === t && (e[t] = e[t].replace(/\W/g, "_")), "version" === t && "number" != typeof e[t]) return new Error("Database version must be a number.");
                                    this._config[t] = e[t]
                                }
                                return !("driver" in e) || !e.driver || this.setDriver(this._config.driver)
                            }
                            return "string" == typeof e ? this._config[e] : this._config
                        }, e.prototype.defineDriver = function (e, t, n) {
                            var r = new a((function (t, n) {
                                try {
                                    var r = e._driver,
                                        o = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                                    if (!e._driver) return void n(o);
                                    for (var i = Y.concat("_initStorage"), u = 0, c = i.length; u < c; u++) {
                                        var f = i[u];
                                        if ((!H(K, f) || e[f]) && "function" != typeof e[f]) return void n(o)
                                    }
                                    !function () {
                                        for (var t = function (e) {
                                            return function () {
                                                var t = new Error("Method " + e + " is not implemented by the current driver"),
                                                    n = a.reject(t);
                                                return s(n, arguments[arguments.length - 1]), n
                                            }
                                        }, n = 0, r = K.length; n < r; n++) {
                                            var o = K[n];
                                            e[o] || (e[o] = t(o))
                                        }
                                    }();
                                    var l = function (n) {
                                        J[r], J[r] = e, G[r] = n, t()
                                    };
                                    "_support" in e ? e._support && "function" == typeof e._support ? e._support().then(l, n) : l(!!e._support) : l(!0)
                                } catch (e) {
                                    n(e)
                                }
                            }));
                            return u(r, t, n), r
                        }, e.prototype.driver = function () {
                            return this._driver || null
                        }, e.prototype.getDriver = function (e, t, n) {
                            var r = J[e] ? a.resolve(J[e]) : a.reject(new Error("Driver not found."));
                            return u(r, t, n), r
                        }, e.prototype.getSerializer = function (e) {
                            var t = a.resolve(k);
                            return u(t, e), t
                        }, e.prototype.ready = function (e) {
                            var t = this, n = t._driverSet.then((function () {
                                return null === t._ready && (t._ready = t._initDriver()), t._ready
                            }));
                            return u(n, e, e), n
                        }, e.prototype.setDriver = function (e, t, n) {
                            var r = this;
                            V(e) || (e = [e]);
                            var o = this._getSupportedDrivers(e);

                            function i() {
                                r._config.driver = r.driver()
                            }

                            function s(e) {
                                return r._extend(e), i(), r._ready = r._initStorage(r._config), r._ready
                            }

                            var c = null !== this._driverSet ? this._driverSet.catch((function () {
                                return a.resolve()
                            })) : a.resolve();
                            return this._driverSet = c.then((function () {
                                var e = o[0];
                                return r._dbInfo = null, r._ready = null, r.getDriver(e).then((function (e) {
                                    r._driver = e._driver, i(), r._wrapLibraryMethodsWithReady(), r._initDriver = function (e) {
                                        return function () {
                                            var t = 0;
                                            return function n() {
                                                for (; t < e.length;) {
                                                    var o = e[t];
                                                    return t++, r._dbInfo = null, r._ready = null, r.getDriver(o).then(s).catch(n)
                                                }
                                                i();
                                                var u = new Error("No available storage method found.");
                                                return r._driverSet = a.reject(u), r._driverSet
                                            }()
                                        }
                                    }(o)
                                }))
                            })).catch((function () {
                                i();
                                var e = new Error("No available storage method found.");
                                return r._driverSet = a.reject(e), r._driverSet
                            })), u(this._driverSet, t, n), this._driverSet
                        }, e.prototype.supports = function (e) {
                            return !!G[e]
                        }, e.prototype._extend = function (e) {
                            Z(this, e)
                        }, e.prototype._getSupportedDrivers = function (e) {
                            for (var t = [], n = 0, r = e.length; n < r; n++) {
                                var o = e[n];
                                this.supports(o) && t.push(o)
                            }
                            return t
                        }, e.prototype._wrapLibraryMethodsWithReady = function () {
                            for (var e = 0, t = Y.length; e < t; e++) $(this, Y[e])
                        }, e.prototype.createInstance = function (t) {
                            return new e(t)
                        }, e
                    }());
                    t.exports = ee
                }, {3: 3}]
            }, {}, [4])(4)
        }).call(this, n(36))
    }, function (e, t, n) {
        e.exports = n(37).default
    }, function (e, t, n) {
        "use strict";
        n.d(t, "a", (function () {
            return o
        }));
        var r = function () {
        };

        function o(e) {
            if (!e || !e.reduce || !e.length) throw new TypeError("createPipeline 方法需要传入至少有一个 pipe 的数组");
            return 1 === e.length ? function (t, n) {
                e[0](t, n || r)
            } : e.reduce((function (e, t) {
                return function (n, o) {
                    return void 0 === o && (o = r), e(n, (function (e) {
                        return null == t ? void 0 : t(e, o)
                    }))
                }
            }))
        }
    }, function (e, t) {
    }, function (e, t) {
    }, function (e, t, n) {
        "use strict";
        e.exports = function (e, t) {
            return function () {
                for (var n = new Array(arguments.length), r = 0; r < n.length; r++) n[r] = arguments[r];
                return e.apply(t, n)
            }
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(0);

        function o(e) {
            return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]")
        }

        e.exports = function (e, t, n) {
            if (!t) return e;
            var i;
            if (n) i = n(t); else if (r.isURLSearchParams(t)) i = t.toString(); else {
                var a = [];
                r.forEach(t, (function (e, t) {
                    null != e && (r.isArray(e) ? t += "[]" : e = [e], r.forEach(e, (function (e) {
                        r.isDate(e) ? e = e.toISOString() : r.isObject(e) && (e = JSON.stringify(e)), a.push(o(t) + "=" + o(e))
                    })))
                })), i = a.join("&")
            }
            if (i) {
                var s = e.indexOf("#");
                -1 !== s && (e = e.slice(0, s)), e += (-1 === e.indexOf("?") ? "?" : "&") + i
            }
            return e
        }
    }, function (e, t, n) {
        "use strict";
        e.exports = function (e) {
            return !(!e || !e.__CANCEL__)
        }
    }, function (e, t, n) {
        "use strict";
        (function (t) {
            var r = n(0), o = n(24), i = {"Content-Type": "application/x-www-form-urlencoded"};

            function a(e, t) {
                !r.isUndefined(e) && r.isUndefined(e["Content-Type"]) && (e["Content-Type"] = t)
            }

            var s, u = {
                adapter: (("undefined" != typeof XMLHttpRequest || void 0 !== t && "[object process]" === Object.prototype.toString.call(t)) && (s = n(12)), s),
                transformRequest: [function (e, t) {
                    return o(t, "Accept"), o(t, "Content-Type"), r.isFormData(e) || r.isArrayBuffer(e) || r.isBuffer(e) || r.isStream(e) || r.isFile(e) || r.isBlob(e) ? e : r.isArrayBufferView(e) ? e.buffer : r.isURLSearchParams(e) ? (a(t, "application/x-www-form-urlencoded;charset=utf-8"), e.toString()) : r.isObject(e) ? (a(t, "application/json;charset=utf-8"), JSON.stringify(e)) : e
                }],
                transformResponse: [function (e) {
                    if ("string" == typeof e) try {
                        e = JSON.parse(e)
                    } catch (e) {
                    }
                    return e
                }],
                timeout: 0,
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN",
                maxContentLength: -1,
                maxBodyLength: -1,
                validateStatus: function (e) {
                    return e >= 200 && e < 300
                }
            };
            u.headers = {common: {Accept: "application/json, text/plain, */*"}}, r.forEach(["delete", "get", "head"], (function (e) {
                u.headers[e] = {}
            })), r.forEach(["post", "put", "patch"], (function (e) {
                u.headers[e] = r.merge(i)
            })), e.exports = u
        }).call(this, n(23))
    }, function (e, t, n) {
        "use strict";
        var r = n(0), o = n(25), i = n(27), a = n(9), s = n(28), u = n(31), c = n(32), f = n(13);
        e.exports = function (e) {
            return new Promise((function (t, n) {
                var l = e.data, d = e.headers;
                r.isFormData(l) && delete d["Content-Type"];
                var p = new XMLHttpRequest;
                if (e.auth) {
                    var h = e.auth.username || "",
                        v = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : "";
                    d.Authorization = "Basic " + btoa(h + ":" + v)
                }
                var y = s(e.baseURL, e.url);
                if (p.open(e.method.toUpperCase(), a(y, e.params, e.paramsSerializer), !0), p.timeout = e.timeout, p.onreadystatechange = function () {
                    if (p && 4 === p.readyState && (0 !== p.status || p.responseURL && 0 === p.responseURL.indexOf("file:"))) {
                        var r = "getAllResponseHeaders" in p ? u(p.getAllResponseHeaders()) : null, i = {
                            data: e.responseType && "text" !== e.responseType ? p.response : p.responseText,
                            status: p.status,
                            statusText: p.statusText,
                            headers: r,
                            config: e,
                            request: p
                        };
                        o(t, n, i), p = null
                    }
                }, p.onabort = function () {
                    p && (n(f("Request aborted", e, "ECONNABORTED", p)), p = null)
                }, p.onerror = function () {
                    n(f("Network Error", e, null, p)), p = null
                }, p.ontimeout = function () {
                    var t = "timeout of " + e.timeout + "ms exceeded";
                    e.timeoutErrorMessage && (t = e.timeoutErrorMessage), n(f(t, e, "ECONNABORTED", p)), p = null
                }, r.isStandardBrowserEnv()) {
                    var m = (e.withCredentials || c(y)) && e.xsrfCookieName ? i.read(e.xsrfCookieName) : void 0;
                    m && (d[e.xsrfHeaderName] = m)
                }
                if ("setRequestHeader" in p && r.forEach(d, (function (e, t) {
                    void 0 === l && "content-type" === t.toLowerCase() ? delete d[t] : p.setRequestHeader(t, e)
                })), r.isUndefined(e.withCredentials) || (p.withCredentials = !!e.withCredentials), e.responseType) try {
                    p.responseType = e.responseType
                } catch (t) {
                    if ("json" !== e.responseType) throw t
                }
                "function" == typeof e.onDownloadProgress && p.addEventListener("progress", e.onDownloadProgress), "function" == typeof e.onUploadProgress && p.upload && p.upload.addEventListener("progress", e.onUploadProgress), e.cancelToken && e.cancelToken.promise.then((function (e) {
                    p && (p.abort(), n(e), p = null)
                })), l || (l = null), p.send(l)
            }))
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(26);
        e.exports = function (e, t, n, o, i) {
            var a = new Error(e);
            return r(a, t, n, o, i)
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(0);
        e.exports = function (e, t) {
            t = t || {};
            var n = {}, o = ["url", "method", "data"], i = ["headers", "auth", "proxy", "params"],
                a = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"],
                s = ["validateStatus"];

            function u(e, t) {
                return r.isPlainObject(e) && r.isPlainObject(t) ? r.merge(e, t) : r.isPlainObject(t) ? r.merge({}, t) : r.isArray(t) ? t.slice() : t
            }

            function c(o) {
                r.isUndefined(t[o]) ? r.isUndefined(e[o]) || (n[o] = u(void 0, e[o])) : n[o] = u(e[o], t[o])
            }

            r.forEach(o, (function (e) {
                r.isUndefined(t[e]) || (n[e] = u(void 0, t[e]))
            })), r.forEach(i, c), r.forEach(a, (function (o) {
                r.isUndefined(t[o]) ? r.isUndefined(e[o]) || (n[o] = u(void 0, e[o])) : n[o] = u(void 0, t[o])
            })), r.forEach(s, (function (r) {
                r in t ? n[r] = u(e[r], t[r]) : r in e && (n[r] = u(void 0, e[r]))
            }));
            var f = o.concat(i).concat(a).concat(s), l = Object.keys(e).concat(Object.keys(t)).filter((function (e) {
                return -1 === f.indexOf(e)
            }));
            return r.forEach(l, c), n
        }
    }, function (e, t, n) {
        "use strict";

        function r(e) {
            this.message = e
        }

        r.prototype.toString = function () {
            return "Cancel" + (this.message ? ": " + this.message : "")
        }, r.prototype.__CANCEL__ = !0, e.exports = r
    }, function (e, t, n) {
        "use strict";
        var r = n(17);
        n(6), n(5), n(7), n(2);
        t.default = r.a
    }, function (e, t, n) {
        "use strict";
        var r = n(2), o = n(5), i = function () {
            return (i = Object.assign || function (e) {
                for (var t, n = 1, r = arguments.length; n < r; n++) for (var o in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
                return e
            }).apply(this, arguments)
        }, a = function () {
            function e(e) {
                var t = this;
                this.lifeCycle = new r.a, this.uploadJobQueue = [], this._normalLogPipeline = Object(o.a)([function (e) {
                    t.send({
                        url: t.baseInfo.url,
                        data: e,
                        method: "post",
                        contentType: "application/json;charset=UTF-8"
                    }, (function () {
                        var n = t.baseInfo.onReportSuccess;
                        "function" == typeof n && n(JSON.stringify(e.msgs[0].data.events))
                    }), (function () {
                        var n = t.baseInfo.onReportFail;
                        "function" == typeof n && n(JSON.stringify(e.msgs[0].data.events))
                    }))
                }]), Object(r.b)(Boolean(e.appkey), "appkey must be initial"), this.baseInfo = i(i({}, e), {
                    initTime: Date.now().toString(),
                    language: "zh-CN"
                })
            }

            return e.prototype.getCommonInfo = function () {
                var e, t, n, r, o, i, a, s;
                return {
                    deviceId: null === (e = this.baseInfo) || void 0 === e ? void 0 : e.deviceId,
                    appkey: null === (t = this.baseInfo) || void 0 === t ? void 0 : t.appkey,
                    versionCode: null === (n = this.baseInfo) || void 0 === n ? void 0 : n.versionCode,
                    initTime: null === (r = this.baseInfo) || void 0 === r ? void 0 : r.initTime,
                    channelID: null === (o = this.baseInfo) || void 0 === o ? void 0 : o.channelID,
                    sdkVersion: null === (i = this.baseInfo) || void 0 === i ? void 0 : i.sdkVersion,
                    pixel: null === (a = this.baseInfo) || void 0 === a ? void 0 : a.pixel,
                    language: null === (s = this.baseInfo) || void 0 === s ? void 0 : s.language
                }
            }, e
        }();
        t.a = a
    }, function (e, t, n) {
        "use strict";
        var r = n(0), o = n(8), i = n(19), a = n(14);

        function s(e) {
            var t = new i(e), n = o(i.prototype.request, t);
            return r.extend(n, i.prototype, t), r.extend(n, t), n
        }

        var u = s(n(11));
        u.Axios = i, u.create = function (e) {
            return s(a(u.defaults, e))
        }, u.Cancel = n(15), u.CancelToken = n(33), u.isCancel = n(10), u.all = function (e) {
            return Promise.all(e)
        }, u.spread = n(34), u.isAxiosError = n(35), e.exports = u, e.exports.default = u
    }, function (e, t, n) {
        "use strict";
        var r = n(0), o = n(9), i = n(20), a = n(21), s = n(14);

        function u(e) {
            this.defaults = e, this.interceptors = {request: new i, response: new i}
        }

        u.prototype.request = function (e) {
            "string" == typeof e ? (e = arguments[1] || {}).url = arguments[0] : e = e || {}, (e = s(this.defaults, e)).method ? e.method = e.method.toLowerCase() : this.defaults.method ? e.method = this.defaults.method.toLowerCase() : e.method = "get";
            var t = [a, void 0], n = Promise.resolve(e);
            for (this.interceptors.request.forEach((function (e) {
                t.unshift(e.fulfilled, e.rejected)
            })), this.interceptors.response.forEach((function (e) {
                t.push(e.fulfilled, e.rejected)
            })); t.length;) n = n.then(t.shift(), t.shift());
            return n
        }, u.prototype.getUri = function (e) {
            return e = s(this.defaults, e), o(e.url, e.params, e.paramsSerializer).replace(/^\?/, "")
        }, r.forEach(["delete", "get", "head", "options"], (function (e) {
            u.prototype[e] = function (t, n) {
                return this.request(s(n || {}, {method: e, url: t, data: (n || {}).data}))
            }
        })), r.forEach(["post", "put", "patch"], (function (e) {
            u.prototype[e] = function (t, n, r) {
                return this.request(s(r || {}, {method: e, url: t, data: n}))
            }
        })), e.exports = u
    }, function (e, t, n) {
        "use strict";
        var r = n(0);

        function o() {
            this.handlers = []
        }

        o.prototype.use = function (e, t) {
            return this.handlers.push({fulfilled: e, rejected: t}), this.handlers.length - 1
        }, o.prototype.eject = function (e) {
            this.handlers[e] && (this.handlers[e] = null)
        }, o.prototype.forEach = function (e) {
            r.forEach(this.handlers, (function (t) {
                null !== t && e(t)
            }))
        }, e.exports = o
    }, function (e, t, n) {
        "use strict";
        var r = n(0), o = n(22), i = n(10), a = n(11);

        function s(e) {
            e.cancelToken && e.cancelToken.throwIfRequested()
        }

        e.exports = function (e) {
            return s(e), e.headers = e.headers || {}, e.data = o(e.data, e.headers, e.transformRequest), e.headers = r.merge(e.headers.common || {}, e.headers[e.method] || {}, e.headers), r.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (function (t) {
                delete e.headers[t]
            })), (e.adapter || a.adapter)(e).then((function (t) {
                return s(e), t.data = o(t.data, t.headers, e.transformResponse), t
            }), (function (t) {
                return i(t) || (s(e), t && t.response && (t.response.data = o(t.response.data, t.response.headers, e.transformResponse))), Promise.reject(t)
            }))
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(0);
        e.exports = function (e, t, n) {
            return r.forEach(n, (function (n) {
                e = n(e, t)
            })), e
        }
    }, function (e, t) {
        var n, r, o = e.exports = {};

        function i() {
            throw new Error("setTimeout has not been defined")
        }

        function a() {
            throw new Error("clearTimeout has not been defined")
        }

        function s(e) {
            if (n === setTimeout) return setTimeout(e, 0);
            if ((n === i || !n) && setTimeout) return n = setTimeout, setTimeout(e, 0);
            try {
                return n(e, 0)
            } catch (t) {
                try {
                    return n.call(null, e, 0)
                } catch (t) {
                    return n.call(this, e, 0)
                }
            }
        }

        !function () {
            try {
                n = "function" == typeof setTimeout ? setTimeout : i
            } catch (e) {
                n = i
            }
            try {
                r = "function" == typeof clearTimeout ? clearTimeout : a
            } catch (e) {
                r = a
            }
        }();
        var u, c = [], f = !1, l = -1;

        function d() {
            f && u && (f = !1, u.length ? c = u.concat(c) : l = -1, c.length && p())
        }

        function p() {
            if (!f) {
                var e = s(d);
                f = !0;
                for (var t = c.length; t;) {
                    for (u = c, c = []; ++l < t;) u && u[l].run();
                    l = -1, t = c.length
                }
                u = null, f = !1, function (e) {
                    if (r === clearTimeout) return clearTimeout(e);
                    if ((r === a || !r) && clearTimeout) return r = clearTimeout, clearTimeout(e);
                    try {
                        r(e)
                    } catch (t) {
                        try {
                            return r.call(null, e)
                        } catch (t) {
                            return r.call(this, e)
                        }
                    }
                }(e)
            }
        }

        function h(e, t) {
            this.fun = e, this.array = t
        }

        function v() {
        }

        o.nextTick = function (e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
            c.push(new h(e, t)), 1 !== c.length || f || s(p)
        }, h.prototype.run = function () {
            this.fun.apply(null, this.array)
        }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = v, o.addListener = v, o.once = v, o.off = v, o.removeListener = v, o.removeAllListeners = v, o.emit = v, o.prependListener = v, o.prependOnceListener = v, o.listeners = function (e) {
            return []
        }, o.binding = function (e) {
            throw new Error("process.binding is not supported")
        }, o.cwd = function () {
            return "/"
        }, o.chdir = function (e) {
            throw new Error("process.chdir is not supported")
        }, o.umask = function () {
            return 0
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(0);
        e.exports = function (e, t) {
            r.forEach(e, (function (n, r) {
                r !== t && r.toUpperCase() === t.toUpperCase() && (e[t] = n, delete e[r])
            }))
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(13);
        e.exports = function (e, t, n) {
            var o = n.config.validateStatus;
            n.status && o && !o(n.status) ? t(r("Request failed with status code " + n.status, n.config, null, n.request, n)) : e(n)
        }
    }, function (e, t, n) {
        "use strict";
        e.exports = function (e, t, n, r, o) {
            return e.config = t, n && (e.code = n), e.request = r, e.response = o, e.isAxiosError = !0, e.toJSON = function () {
                return {
                    message: this.message,
                    name: this.name,
                    description: this.description,
                    number: this.number,
                    fileName: this.fileName,
                    lineNumber: this.lineNumber,
                    columnNumber: this.columnNumber,
                    stack: this.stack,
                    config: this.config,
                    code: this.code
                }
            }, e
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(0);
        e.exports = r.isStandardBrowserEnv() ? {
            write: function (e, t, n, o, i, a) {
                var s = [];
                s.push(e + "=" + encodeURIComponent(t)), r.isNumber(n) && s.push("expires=" + new Date(n).toGMTString()), r.isString(o) && s.push("path=" + o), r.isString(i) && s.push("domain=" + i), !0 === a && s.push("secure"), document.cookie = s.join("; ")
            }, read: function (e) {
                var t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
                return t ? decodeURIComponent(t[3]) : null
            }, remove: function (e) {
                this.write(e, "", Date.now() - 864e5)
            }
        } : {
            write: function () {
            }, read: function () {
                return null
            }, remove: function () {
            }
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(29), o = n(30);
        e.exports = function (e, t) {
            return e && !r(t) ? o(e, t) : t
        }
    }, function (e, t, n) {
        "use strict";
        e.exports = function (e) {
            return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)
        }
    }, function (e, t, n) {
        "use strict";
        e.exports = function (e, t) {
            return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(0),
            o = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
        e.exports = function (e) {
            var t, n, i, a = {};
            return e ? (r.forEach(e.split("\n"), (function (e) {
                if (i = e.indexOf(":"), t = r.trim(e.substr(0, i)).toLowerCase(), n = r.trim(e.substr(i + 1)), t) {
                    if (a[t] && o.indexOf(t) >= 0) return;
                    a[t] = "set-cookie" === t ? (a[t] ? a[t] : []).concat([n]) : a[t] ? a[t] + ", " + n : n
                }
            })), a) : a
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(0);
        e.exports = r.isStandardBrowserEnv() ? function () {
            var e, t = /(msie|trident)/i.test(navigator.userAgent), n = document.createElement("a");

            function o(e) {
                var r = e;
                return t && (n.setAttribute("href", r), r = n.href), n.setAttribute("href", r), {
                    href: n.href,
                    protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
                    host: n.host,
                    search: n.search ? n.search.replace(/^\?/, "") : "",
                    hash: n.hash ? n.hash.replace(/^#/, "") : "",
                    hostname: n.hostname,
                    port: n.port,
                    pathname: "/" === n.pathname.charAt(0) ? n.pathname : "/" + n.pathname
                }
            }

            return e = o(window.location.href), function (t) {
                var n = r.isString(t) ? o(t) : t;
                return n.protocol === e.protocol && n.host === e.host
            }
        }() : function () {
            return !0
        }
    }, function (e, t, n) {
        "use strict";
        var r = n(15);

        function o(e) {
            if ("function" != typeof e) throw new TypeError("executor must be a function.");
            var t;
            this.promise = new Promise((function (e) {
                t = e
            }));
            var n = this;
            e((function (e) {
                n.reason || (n.reason = new r(e), t(n.reason))
            }))
        }

        o.prototype.throwIfRequested = function () {
            if (this.reason) throw this.reason
        }, o.source = function () {
            var e;
            return {
                token: new o((function (t) {
                    e = t
                })), cancel: e
            }
        }, e.exports = o
    }, function (e, t, n) {
        "use strict";
        e.exports = function (e) {
            return function (t) {
                return e.apply(null, t)
            }
        }
    }, function (e, t, n) {
        "use strict";
        e.exports = function (e) {
            return "object" == typeof e && !0 === e.isAxiosError
        }
    }, function (e, t) {
        var n;
        n = function () {
            return this
        }();
        try {
            n = n || new Function("return this")()
        } catch (e) {
            "object" == typeof window && (n = window)
        }
        e.exports = n
    }, function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {value: !0}), t.isNetworkError = a, t.isRetryableError = c, t.isSafeRequestError = f, t.isIdempotentRequestError = l, t.isNetworkOrIdempotentRequestError = d, t.exponentialDelay = h, t.default = y;
        var r, o = n(38), i = (r = o) && r.__esModule ? r : {default: r};

        function a(e) {
            return !e.response && Boolean(e.code) && "ECONNABORTED" !== e.code && (0, i.default)(e)
        }

        var s = ["get", "head", "options"], u = s.concat(["put", "delete"]);

        function c(e) {
            return "ECONNABORTED" !== e.code && (!e.response || e.response.status >= 500 && e.response.status <= 599)
        }

        function f(e) {
            return !!e.config && (c(e) && -1 !== s.indexOf(e.config.method))
        }

        function l(e) {
            return !!e.config && (c(e) && -1 !== u.indexOf(e.config.method))
        }

        function d(e) {
            return a(e) || l(e)
        }

        function p() {
            return 0
        }

        function h() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, t = 100 * Math.pow(2, e),
                n = .2 * t * Math.random();
            return t + n
        }

        function v(e) {
            var t = e["axios-retry"] || {};
            return t.retryCount = t.retryCount || 0, e["axios-retry"] = t, t
        }

        function y(e, t) {
            e.interceptors.request.use((function (e) {
                return v(e).lastRequestTime = Date.now(), e
            })), e.interceptors.response.use(null, (function (n) {
                var r = n.config;
                if (!r) return Promise.reject(n);
                var o = function (e, t) {
                        return Object.assign({}, t, e["axios-retry"])
                    }(r, t), i = o.retries, a = void 0 === i ? 3 : i, s = o.retryCondition, u = void 0 === s ? d : s,
                    c = o.retryDelay, f = void 0 === c ? p : c, l = o.shouldResetTimeout, h = void 0 !== l && l,
                    y = v(r);
                if (u(n) && y.retryCount < a) {
                    y.retryCount += 1;
                    var m = f(y.retryCount, n);
                    if (function (e, t) {
                        e.defaults.agent === t.agent && delete t.agent, e.defaults.httpAgent === t.httpAgent && delete t.httpAgent, e.defaults.httpsAgent === t.httpsAgent && delete t.httpsAgent
                    }(e, r), !h && r.timeout && y.lastRequestTime) {
                        var g = Date.now() - y.lastRequestTime;
                        r.timeout = Math.max(r.timeout - g - m, 1)
                    }
                    return r.transformRequest = [function (e) {
                        return e
                    }], new Promise((function (t) {
                        return setTimeout((function () {
                            return t(e(r))
                        }), m)
                    }))
                }
                return Promise.reject(n)
            }))
        }

        y.isNetworkError = a, y.isSafeRequestError = f, y.isIdempotentRequestError = l, y.isNetworkOrIdempotentRequestError = d, y.exponentialDelay = h, y.isRetryableError = c
    }, function (e, t, n) {
        "use strict";
        var r = ["ETIMEDOUT", "ECONNRESET", "EADDRINUSE", "ESOCKETTIMEDOUT", "ECONNREFUSED", "EPIPE", "EHOSTUNREACH", "EAI_AGAIN"],
            o = ["ENOTFOUND", "ENETUNREACH", "UNABLE_TO_GET_ISSUER_CERT", "UNABLE_TO_GET_CRL", "UNABLE_TO_DECRYPT_CERT_SIGNATURE", "UNABLE_TO_DECRYPT_CRL_SIGNATURE", "UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY", "CERT_SIGNATURE_FAILURE", "CRL_SIGNATURE_FAILURE", "CERT_NOT_YET_VALID", "CERT_HAS_EXPIRED", "CRL_NOT_YET_VALID", "CRL_HAS_EXPIRED", "ERROR_IN_CERT_NOT_BEFORE_FIELD", "ERROR_IN_CERT_NOT_AFTER_FIELD", "ERROR_IN_CRL_LAST_UPDATE_FIELD", "ERROR_IN_CRL_NEXT_UPDATE_FIELD", "OUT_OF_MEM", "DEPTH_ZERO_SELF_SIGNED_CERT", "SELF_SIGNED_CERT_IN_CHAIN", "UNABLE_TO_GET_ISSUER_CERT_LOCALLY", "UNABLE_TO_VERIFY_LEAF_SIGNATURE", "CERT_CHAIN_TOO_LONG", "CERT_REVOKED", "INVALID_CA", "PATH_LENGTH_EXCEEDED", "INVALID_PURPOSE", "CERT_UNTRUSTED", "CERT_REJECTED"];
        e.exports = function (e) {
            return !e || !e.code || (-1 !== r.indexOf(e.code) || -1 === o.indexOf(e.code))
        }
    }, function (e, t, n) {
        "use strict";
        n.r(t);
        var r = n(16);

        function o(e, t) {
            try {
                e = "__BEACON_" + e, window.localStorage.setItem(e, t)
            } catch (e) {
            }
        }

        function i(e) {
            try {
                return e = "__BEACON_" + e, window.localStorage.getItem(e)
            } catch (e) {
                return ""
            }
        }

        function a(e) {
            if ("string" != typeof e) return e;
            try {
                return e.replace(new RegExp("\\|", "g"), "%7C").replace(new RegExp("\\&", "g"), "%26").replace(new RegExp("\\=", "g"), "%3D").replace(new RegExp("\\+", "g"), "%2B")
            } catch (e) {
                return ""
            }
        }

        function s() {
            var e = navigator.userAgent, t = e.indexOf("compatible") > -1 && e.indexOf("MSIE") > -1,
                n = e.indexOf("Edge") > -1 && !t, r = e.indexOf("Trident") > -1 && e.indexOf("rv:11.0") > -1;
            if (t) {
                new RegExp("MSIE (\\d+\\.\\d+);").test(e);
                var o = parseFloat(RegExp.$1);
                return 7 == o ? 7 : 8 == o ? 8 : 9 == o ? 9 : 10 == o ? 10 : 6
            }
            return n ? -2 : r ? 11 : -1
        }

        var u, c = n(1), f = n.n(c), l = n(3), d = n.n(l), p = function (e, t, n, r) {
            return new (n || (n = Promise))((function (o, i) {
                function a(e) {
                    try {
                        u(r.next(e))
                    } catch (e) {
                        i(e)
                    }
                }

                function s(e) {
                    try {
                        u(r.throw(e))
                    } catch (e) {
                        i(e)
                    }
                }

                function u(e) {
                    var t;
                    e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n((function (e) {
                        e(t)
                    }))).then(a, s)
                }

                u((r = r.apply(e, t || [])).next())
            }))
        }, h = function (e, t) {
            var n, r, o, i, a = {
                label: 0, sent: function () {
                    if (1 & o[0]) throw o[1];
                    return o[1]
                }, trys: [], ops: []
            };
            return i = {
                next: s(0),
                throw: s(1),
                return: s(2)
            }, "function" == typeof Symbol && (i[Symbol.iterator] = function () {
                return this
            }), i;

            function s(i) {
                return function (s) {
                    return function (i) {
                        if (n) throw new TypeError("Generator is already executing.");
                        for (; a;) try {
                            if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done) return o;
                            switch (r = 0, o && (i = [2 & i[0], o.value]), i[0]) {
                                case 0:
                                case 1:
                                    o = i;
                                    break;
                                case 4:
                                    return a.label++, {value: i[1], done: !1};
                                case 5:
                                    a.label++, r = i[1], i = [0];
                                    continue;
                                case 7:
                                    i = a.ops.pop(), a.trys.pop();
                                    continue;
                                default:
                                    if (!(o = a.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                                        a = 0;
                                        continue
                                    }
                                    if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
                                        a.label = i[1];
                                        break
                                    }
                                    if (6 === i[0] && a.label < o[1]) {
                                        a.label = o[1], o = i;
                                        break
                                    }
                                    if (o && a.label < o[2]) {
                                        a.label = o[2], a.ops.push(i);
                                        break
                                    }
                                    o[2] && a.ops.pop(), a.trys.pop();
                                    continue
                            }
                            i = t.call(e, a)
                        } catch (e) {
                            i = [6, e], r = 0
                        } finally {
                            n = o = 0
                        }
                        if (5 & i[0]) throw i[1];
                        return {value: i[0] ? i[1] : void 0, done: !0}
                    }([i, s])
                }
            }
        }, v = function () {
            function e(e) {
                var t = s(), n = [];
                n = t > 8 && t < 10 ? [d.a.LOCALSTORAGE] : [d.a.INDEXEDDB, d.a.WEBSQL, d.a.LOCALSTORAGE], this.store = d.a.createInstance({
                    driver: n,
                    name: "Beacon" + e,
                    version: 1,
                    size: 2097152,
                    storeName: "event_store",
                    description: "store beacon events"
                })
            }

            return e.prototype.insertEvent = function (e, t) {
                return p(this, void 0, void 0, (function () {
                    var n, r;
                    return h(this, (function (o) {
                        switch (o.label) {
                            case 0:
                                return n = e.params, r = n.A99.toString() + n.A100.toString(), [4, this.store.setItem(r, e, t)];
                            case 1:
                                return [2, o.sent()]
                        }
                    }))
                }))
            }, e.prototype.getEvents = function () {
                return p(this, void 0, void 0, (function () {
                    var e;
                    return h(this, (function (t) {
                        switch (t.label) {
                            case 0:
                                e = [], t.label = 1;
                            case 1:
                                return t.trys.push([1, 3, , 4]), [4, this.store.iterate((function (t) {
                                    e.push(t)
                                }))];
                            case 2:
                                return t.sent(), [2, Promise.all(e)];
                            case 3:
                                return t.sent(), [2, Promise.all(e)];
                            case 4:
                                return [2]
                        }
                    }))
                }))
            }, e.prototype.removeEvent = function (e) {
                return p(this, void 0, void 0, (function () {
                    var t, n;
                    return h(this, (function (r) {
                        switch (r.label) {
                            case 0:
                                return t = e.params, n = t.A99.toString() + t.A100.toString(), [4, this.store.removeItem(n)];
                            case 1:
                                return r.sent(), [2]
                        }
                    }))
                }))
            }, e
        }(), y = function () {
            function e(e) {
                this.requestParams = {}, this.requestParams.attaid = "00400014144", this.requestParams.token = "6478159937", this.requestParams.product_id = e.baseInfo.appkey, this.requestParams.platform = "web", this.requestParams.uin = e.getDeviceId(), this.requestParams.model = "", this.requestParams.os = navigator.userAgent, this.requestParams.app_version = e.baseInfo.versionCode, this.requestParams.sdk_version = e.baseInfo.sdkVersion, this.requestParams.error_stack = ""
            }

            return e.prototype.reportError = function (e, t) {
                this.requestParams._dc = Math.random(), this.requestParams.error_msg = t, this.requestParams.error_code = e, f.a.get("https://h.trace.qq.com/kv", {params: this.requestParams})
            }, e
        }(), m = n(4), g = n.n(m), b = function () {
            function e(e) {
                this.config = {
                    isEventUpOnOff: !0,
                    httpUploadUrl: "http://oth.eve.mdt.qq.com:8080/analytics/upload?tp=js",
                    httpsUploadUrl: "https://otheve.beacon.qq.com/analytics/upload?tp=js",
                    requestInterval: 30,
                    blacklist: [],
                    samplelist: []
                }, this.realSample = {};
                try {
                    var t = JSON.parse(i(e.baseInfo.appkey + "_Beacon_config"));
                    t && this.processData(t)
                } catch (e) {
                }
                this.needRequestConfig(e.baseInfo.appkey) && this.requestConfig(e)
            }

            return e.prototype.requestConfig = function (e) {
                var t = this;
                o(e.baseInfo.appkey + "_Beacon_config_request_time", Date.now().toString()), f.a.post("https://oth.str.beacon.qq.com/trpc.beacon.configserver.BeaconConfigService/QueryConfig", {
                    platformId: "3",
                    mainAppKey: e.baseInfo.appkey,
                    appVersion: e.baseInfo.versionCode,
                    sdkVersion: e.baseInfo.sdkVersion,
                    osVersion: navigator.userAgent,
                    model: "",
                    packageName: "",
                    params: {A3: e.getDeviceId()}
                }).then((function (n) {
                    if (0 == n.data.ret) try {
                        var r = JSON.parse(n.data.beaconConfig);
                        r && (t.processData(r), o(e.baseInfo.appkey + "_Beacon_config", n.data.beaconConfig))
                    } catch (e) {
                    } else t.processData(null), o(e.baseInfo.appkey + "_Beacon_config", "")
                })).catch((function (e) {
                }))
            }, e.prototype.processData = function (e) {
                var t, n, r, o, i, a;
                this.config.isEventUpOnOff = null !== (t = null == e ? void 0 : e.isEventUpOnOff) && void 0 !== t ? t : this.config.isEventUpOnOff, this.config.httpsUploadUrl = null !== (n = null == e ? void 0 : e.httpsUploadUrl) && void 0 !== n ? n : this.config.httpsUploadUrl, this.config.httpUploadUrl = null !== (r = null == e ? void 0 : e.httpUploadUrl) && void 0 !== r ? r : this.config.httpUploadUrl, this.config.requestInterval = null !== (o = null == e ? void 0 : e.requestInterval) && void 0 !== o ? o : this.config.requestInterval, this.config.blacklist = null !== (i = null == e ? void 0 : e.blacklist) && void 0 !== i ? i : this.config.blacklist, this.config.samplelist = null !== (a = null == e ? void 0 : e.samplelist) && void 0 !== a ? a : this.config.samplelist;
                for (var s = 0, u = this.config.samplelist; s < u.length; s++) {
                    var c = u[s].split(",");
                    2 == c.length && (this.realSample[c[0]] = c[1])
                }
            }, e.prototype.needRequestConfig = function (e) {
                var t = Number(i(e + "_Beacon_config_request_time"));
                return Date.now() - t > 60 * this.config.requestInterval * 1e3
            }, e.prototype.getUploadUrl = function () {
                return "https:" == location.protocol ? this.config.httpsUploadUrl : this.config.httpUploadUrl
            }, e.prototype.isBlackEvent = function (e) {
                return -1 != this.config.blacklist.indexOf(e)
            }, e.prototype.isEventUpOnOff = function () {
                return this.config.isEventUpOnOff
            }, e.prototype.isSampleEvent = function (e) {
                return !!Object.prototype.hasOwnProperty.call(this.realSample, e) && this.realSample[e] < Math.floor(Math.random() * Math.floor(1e4))
            }, e
        }(), _ = (u = function (e, t) {
            return (u = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
                e.__proto__ = t
            } || function (e, t) {
                for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
            })(e, t)
        }, function (e, t) {
            function n() {
                this.constructor = e
            }

            u(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
        }), E = function () {
            return (E = Object.assign || function (e) {
                for (var t, n = 1, r = arguments.length; n < r; n++) for (var o in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
                return e
            }).apply(this, arguments)
        }, w = function (e) {
            function t(n) {
                var r = e.call(this, n) || this;
                if (r.send = function (e, t, n) {
                    if (!r.baseInfo.appkey) throw r.errorReport.reportError("605", "not init"), new Error("please call init before");
                    o(r.baseInfo.appkey + "_last_report_time", Date.now().toString()), f.a.post(r.remoteConfig.getUploadUrl() + "&appkey=" + r.baseInfo.appkey, e.data).then((function (n) {
                        100 == n.data.result ? r.delayTime = 1e3 * n.data.delayTime : r.delayTime = 0, t && t(e.data), e.data.msgs[0].data.events.forEach((function (e) {
                            r.store.removeEvent(e).then((function () {
                                r.removeSendingId(e)
                            }))
                        }))
                    })).catch((function (t) {
                        var o = f.a.isCancel(t), i = e.data.msgs[0].data.events;
                        r.errorReport.reportError(t.code ? t.code.toString() : "600", t.message), o || n && n(e.data), i.forEach((function (e) {
                            r.store.insertEvent(e, (function (e, t) {
                                e && r.errorReport.reportError("604", "insertEvent fail!"), r.removeSendingId(t)
                            }))
                        }))
                    }))
                }, !window.localStorage) throw r.errorReport.reportError("606", "no localStorage!"), new Error("灯塔SDK强依赖localStorage!!!!");
                var a, u, c = s();
                if (r.isUnderIE8 = c > 0 && c < 8, r.isUnderIE8) return r;
                g()(f.a, {retries: 3}), g()(f.a, {retryDelay: g.a.exponentialDelay}), g()(f.a, {
                    retryDelay: function (e) {
                        return 1e3 * e
                    }
                }), r.store = new v(n.appkey), r.additionalParams = {}, r.baseInfo.deviceId = r.getDeviceId(), r.initCommonInfo(n), t.beacon = r, r.getSession = (a = n.appkey + "_session_storage_key", u = n.sessionDuration ? n.sessionDuration < 3e4 ? 3e4 : n.sessionDuration : 18e5, function (e) {
                    var t = Date.now();

                    function n() {
                        var n = {sessionId: e + "_" + t.toString(), sessionStart: t};
                        return setTimeout((function () {
                            o(a, JSON.stringify(n)), o(e + "_last_report_time", Date.now().toString());
                            var t = e + "_is_new_user", r = i(t);
                            I.beacon.onDirectUserAction("rqd_applaunched", {A21: r ? "N" : "Y"}), o(t, JSON.stringify(!1))
                        }), 0), n
                    }

                    var r = Promise.resolve(i(a));
                    return r.then((function (r) {
                        if (!r) return Promise.resolve(n());
                        var o = JSON.parse(r) || {sessionId: void 0, sessionStart: void 0};
                        if (!o.sessionId || !o.sessionStart) return Promise.resolve(n());
                        var a = Number(i(e + "_last_report_time"));
                        return t - a > u ? Promise.resolve(n()) : Promise.resolve({
                            sessionId: o.sessionId,
                            sessionStart: o.sessionStart
                        })
                    }))
                });
                var l = Number(i(n.appkey + "_last_report_time")),
                    d = JSON.parse(i(r.baseInfo.appkey + "_sending_event_ids"));
                return (Date.now() - l > 3e4 || !d) && o(r.baseInfo.appkey + "_sending_event_ids", JSON.stringify([])), r.session$ = r.getSession(n.appkey), f.a.interceptors.request.use(r.getRequestInteceptor(n)), r.onDirectUserAction("rqd_js_init", {}), setTimeout((function () {
                    return r.lifeCycle.emit("init")
                }), 0), r.initDelayTime = n.delay ? n.delay : 3e3, r.delayTime = 0, r.cycleSend(r.initDelayTime), r
            }

            return _(t, e), t.prototype.initCommonInfo = function (e) {
                this.baseInfo.sdkVersion = "3.3.2-web", e.strictMode && (this.strictMode = e.strictMode), this.baseInfo.language = navigator && navigator.language || "zh_cn";
                var t = [window.screen.width, window.screen.height];
                window.devicePixelRatio && t.push(window.devicePixelRatio), this.baseInfo.pixel = t.join("*");
                var n = function (e) {
                    try {
                        return e = "__BEACON_" + e, window.sessionStorage.getItem(e)
                    } catch (e) {
                        return ""
                    }
                }("initTime");
                if (n) this.baseInfo.initTime = n; else {
                    var r = Date.now().toString();
                    this.baseInfo.initTime = r, function (e, t) {
                        try {
                            e = "__BEACON_" + e, window.sessionStorage.setItem(e, t)
                        } catch (e) {
                        }
                    }("initTime", r)
                }
                this.errorReport = new y(this), this.remoteConfig = new b(this), this.baseInfo.url = this.remoteConfig.getUploadUrl() + "&appkey=" + e.appkey
            }, t.prototype.cycleSend = function (e) {
                var t = this;
                setTimeout((function () {
                    var e;
                    null === (e = t.store.getEvents()) || void 0 === e || e.then((function (e) {
                        var n = [];
                        if (e && e.length > 0) {
                            if (e.forEach((function (e) {
                                var r = e.params, a = r.A99.toString() + r.A100.toString(),
                                    s = JSON.parse(i(t.baseInfo.appkey + "_sending_event_ids"));
                                s || (s = []), -1 == s.indexOf(a) && (n.push(e), s.push(a), o(t.baseInfo.appkey + "_sending_event_ids", JSON.stringify(s)))
                            })), n.length <= 0) return;
                            t.realSend(n)
                        }
                    })), t.cycleSend(0 == t.delayTime ? t.initDelayTime : t.delayTime)
                }), e)
            }, t.prototype.getRequestInteceptor = function (e) {
                return function (t) {
                    var n = t.url, r = t.method, o = t.data, i = o, a = !1;
                    if (e.onReportBeforeSend) {
                        var s = e.onReportBeforeSend({url: n, method: r, data: o});
                        a = !(i = (null == s ? void 0 : s.data) || null)
                    }
                    return E(E({}, t), {
                        data: i, cancelToken: a ? new f.a.CancelToken((function (e) {
                            return e("No data for sdk, cancel.")
                        })) : void 0
                    })
                }
            }, t.prototype.onUserAction = function (e, t) {
                this.preReport(e, t, !1)
            }, t.prototype.onDirectUserAction = function (e, t) {
                this.preReport(e, t, !0)
            }, t.prototype.preReport = function (e, t, n) {
                this.isUnderIE8 ? this.errorReport.reportError("601", "UnderIE8") : e ? this.remoteConfig.isEventUpOnOff() && (this.remoteConfig.isBlackEvent(e) || this.remoteConfig.isSampleEvent(e) || this.onReport(e, t, n)) : this.errorReport.reportError("602", " no eventCode")
            }, t.prototype.onReport = function (e, t, n) {
                var r, a, s = this, u = [];
                if (a = n ? this.baseInfo.appkey + this.baseInfo.sdkVersion + "direct_log_id" : this.baseInfo.appkey + this.baseInfo.sdkVersion + "normal_log_id", r = (r = Number(i(a))) || 1, t = E(E(E({}, this.additionalParams), t), {
                    A72: this.baseInfo.sdkVersion,
                    A102: window.location.href,
                    A104: document.referrer,
                    A99: n ? "Y" : "N",
                    A100: r
                }), o(a, (++r).toString()), u.push({
                    id: e,
                    name: e,
                    params: this.replace(t),
                    start: Date.now(),
                    count: 1
                }), n && 0 == this.delayTime) this.realSend(u); else {
                    var c = u.shift();
                    c && this.store.insertEvent(c, (function (e) {
                        e && s.errorReport.reportError("604", "insertEvent fail!")
                    }))
                }
            }, t.prototype.replace = function (e) {
                for (var t = {}, n = 0, r = Object.keys(e); n < r.length; n++) {
                    var o = r[n], i = e[o];
                    if ("string" == typeof i || "number" == typeof i) t[a(o)] = a(i); else {
                        if (this.strictMode) throw new Error("value mast be string or number !!!!");
                        t[a(String(o))] = a(String(i))
                    }
                }
                return t
            }, t.prototype.removeSendingId = function (e) {
                if (e) {
                    var t = JSON.parse(i(this.baseInfo.appkey + "_sending_event_ids")), n = e.params,
                        r = n.A99.toString() + n.A100.toString(), a = t.indexOf(r);
                    -1 != a && (t.splice(a, 1), o(this.baseInfo.appkey + "_sending_event_ids", JSON.stringify(t)))
                }
            }, t.prototype.realSend = function (e) {
                var t = this;
                if (this.session$ = this.getSession(this.baseInfo.appkey), !this.session$) throw this.errorReport.reportError("605", "not init"), new Error("please call init before");
                this.session$.then((function (n) {
                    if (0 != e.length) {
                        var r = [];
                        r.push({
                            type: 2,
                            data: {id: n.sessionId, start: n.sessionStart, pages: [], status: 2, duration: 0, events: e}
                        });
                        var o = E(E({}, t.getCommonInfo()), {opid: t.baseInfo.openid, msgs: r});
                        t._normalLogPipeline(o)
                    }
                }))
            }, t.prototype.getDeviceId = function () {
                var e = i("deviceId");
                return e || o("deviceId", e = this.getRandom(32)), e
            }, t.prototype.getRandom = function (e) {
                for (var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789", n = "", r = 0; r < e; r++) n += t.charAt(Math.floor(Math.random() * t.length));
                return n
            }, t.prototype.addAdditionalParams = function (e) {
                for (var t = 0, n = Object.keys(e); t < n.length; t++) {
                    var r = n[t];
                    this.additionalParams[r] = e[r]
                }
            }, t.prototype.setOpenId = function (e) {
                this.baseInfo.openid = e
            }, t.prototype.reportPV = function () {
                this.onDirectUserAction("rqd_js_pv", {})
            }, t
        }(r.default), I = t.default = w
    }]).default
}));