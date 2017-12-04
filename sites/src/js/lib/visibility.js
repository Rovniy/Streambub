!function (e) {
    "use strict";
    var i = -1, t = {
        onVisible: function (e) {
            var i = t.isSupported();
            if (!i || !t.hidden())return e(), i;
            var n = t.change(function (i, r) {
                t.hidden() || (t.unbind(n), e())
            });
            return n
        }, change: function (e) {
            if (!t.isSupported())return !1;
            i += 1;
            var n = i;
            return t._callbacks[n] = e, t._listen(), n
        }, unbind: function (e) {
            delete t._callbacks[e]
        }, afterPrerendering: function (e) {
            var i = t.isSupported(), n = "prerender";
            if (!i || n != t.state())return e(), i;
            var r = t.change(function (i, d) {
                n != d && (t.unbind(r), e())
            });
            return r
        }, hidden: function () {
            return !(!t._doc.hidden && !t._doc.webkitHidden)
        }, state: function () {
            return t._doc.visibilityState || t._doc.webkitVisibilityState || "visible"
        }, isSupported: function () {
            return !(!t._doc.visibilityState && !t._doc.webkitVisibilityState)
        }, _doc: document || {}, _callbacks: {}, _change: function (e) {
            var i = t.state();
            for (var n in t._callbacks)t._callbacks[n].call(t._doc, e, i)
        }, _listen: function () {
            if (!t._init) {
                var e = "visibilitychange";
                t._doc.webkitVisibilityState && (e = "webkit" + e);
                var i = function () {
                    t._change.apply(t, arguments)
                };
                t._doc.addEventListener ? t._doc.addEventListener(e, i) : t._doc.attachEvent(e, i), t._init = !0
            }
        }
    };
    "undefined" != typeof module && module.exports ? module.exports = t : e.Visibility = t
}(this), function (e) {
    "use strict";
    var i = -1, t = function (t) {
        return t.every = function (e, n, r) {
            t._time(), r || (r = n, n = null), i += 1;
            var d = i;
            return t._timers[d] = {visible: e, hidden: n, callback: r}, t._run(d, !1), t.isSupported() && t._listen(), d
        }, t.stop = function (e) {
            return !!t._timers[e] && (t._stop(e), delete t._timers[e], !0)
        }, t._timers = {}, t._time = function () {
            t._timed || (t._timed = !0, t._wasHidden = t.hidden(), t.change(function () {
                t._stopRun(), t._wasHidden = t.hidden()
            }))
        }, t._run = function (i, n) {
            var r, d = t._timers[i];
            if (t.hidden()) {
                if (null === d.hidden)return;
                r = d.hidden
            } else r = d.visible;
            var a = function () {
                d.last = new Date, d.callback.call(e)
            };
            if (n) {
                var o = new Date, c = o - d.last;
                r > c ? d.delay = setTimeout(function () {
                    d.id = setInterval(a, r), a()
                }, r - c) : (d.id = setInterval(a, r), a())
            } else d.id = setInterval(a, r)
        }, t._stop = function (e) {
            var i = t._timers[e];
            clearInterval(i.id), clearTimeout(i.delay), delete i.id, delete i.delay
        }, t._stopRun = function (e) {
            var i = t.hidden(), n = t._wasHidden;
            if (i && !n || !i && n)for (var r in t._timers)t._stop(r), t._run(r, !i)
        }, t
    };
    "undefined" != typeof module && module.exports ? module.exports = t(require("./visibility.core")) : t(e.Visibility)
}(window);