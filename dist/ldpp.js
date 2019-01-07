// Generated by LiveScript 1.3.1
/*
Palette Format
{
  name: "Palette Name",
  tag: ["tag", "list", ...],
  # either one of below
  colors: [{hex: "#999", tag: [...]}, ...]    # hex. color follows ldColor format
  colors: [{value: "#999"}, ...]              # deprecated
  colors: ["#999", ...]                       # compact but losing color tags
}
*/
var ldPalettePicker, slice$ = [].slice;
import$(HTMLElement.prototype, {
  find: function(s, n){
    var ret;
    if (n === 0) {
      return this.querySelector(s);
    }
    ret = Array.from(this.querySelectorAll(s));
    if (n) {
      return ret[n];
    } else {
      return ret;
    }
  },
  index: function(){
    return Array.from(this.parentNode.childNodes).indexOf(this);
  },
  child: function(){
    return Array.from(this.childNodes);
  },
  parent: function(s, e){
    var n;
    e == null && (e = document);
    n = this;
    while (n && n !== e) {
      n = n.parentNode;
    }
    if (n !== e) {
      return null;
    }
    n = this;
    while (n && n !== e && !n.matches(s)) {
      n = n.parentNode;
    }
    if (n === e && !e.matches(s)) {
      return null;
    }
    return n;
  },
  attr: function(n, v){
    if (v == null) {
      return this.getAttribute(n);
    } else {
      return this.setAttribute(n, v);
    }
  },
  on: function(n, cb){
    return this.addEventListener(n, cb);
  },
  remove: function(){
    return this.parentNode.removeChild(this);
  },
  insertAfter: function(n, s){
    return s.parentNode.insertBefore(n, s.nextSibling);
  }
});
ldPalettePicker = function(node, opt){
  var root, el, content, log, ldcp, irsOpt, ref$, getIdx, dragger, palFromNode, usePal, search, editInit, editUpdate, evts, this$ = this;
  opt == null && (opt = {});
  opt = import$({
    palettes: []
  }, opt);
  this.root = root = typeof node === typeof '' ? node = document.querySelector(node) : node;
  this.el = el = {};
  el.nv = {
    root: root.find('.navbar', 0),
    search: root.find('input[data-tag=search]', 0)
  };
  el.pn = {
    vw: root.find('.panel[data-panel=view]', 0),
    ed: root.find('.panel[data-panel=edit]', 0)
  };
  el.ed = {
    picker: el.pn.ed.find('.ldColorPicker', 0),
    pal: el.pn.ed.find('.palette', 0),
    colors: el.pn.ed.find('.palette .colors', 0),
    hex: el.pn.ed.find('input[data-tag=hex]', 0),
    sel: el.pn.ed.find('select', 0),
    cfgs: el.pn.ed.find('.config')
  };
  content = {
    build: function(p){
      var this$ = this;
      p == null && (p = []);
      return el.pn.vw.innerHTML = p.map(function(it){
        return this$.html(it);
      }).join('');
    },
    html: function(c){
      var cs;
      cs = c.colors.map(function(it){
        return "<div class=\"color\" style=\"background:" + ldColor.rgbaStr(it) + "\"></div>";
      }).join("");
      return "<div class=\"palette\">\n  <div class=\"colors\">\n  " + cs + "\n  <div class=\"ctrl\">\n  <div class=\"btn btn-sm\" data-action=\"use\"><div class=\"fa fa-check\"></div><div class=\"desc\">USE</div></div>\n  <div class=\"btn btn-sm\" data-action=\"edit\"><div class=\"fa fa-cog\"></div><div class=\"desc\">EDIT</div></div>\n  </div>\n  </div>\n  <div class=\"name\">" + c.name + "</div>\n</div>";
    }
  };
  log = {
    stack: [],
    cur: null,
    handle: null,
    undo: function(){
      var html;
      html = log.stack.pop();
      if (!html) {
        return;
      }
      el.ed.pal.innerHTML = html;
      return el.ed.colors = el.ed.pal.find('.colors', 0);
    },
    push: function(){
      var that, this$ = this;
      if (that = this.handle) {
        clearTimeout(that);
      }
      if (!this.cur) {
        this.cur = el.ed.pal.innerHTML;
      }
      return this.handle = setTimeout(function(){
        var ref$;
        if ((ref$ = this$.stack)[ref$.length - 1] !== this$.cur) {
          this$.stack.push(this$.cur);
        }
        return this$.handle = null, this$.cur = null, this$;
      }, 200);
    }
  };
  this.ldcp = ldcp = new ldColorPicker(el.ed.picker, {
    inline: true
  });
  ldcp.on('change', function(it){
    log.push();
    return editUpdate(it);
  });
  irsOpt = {
    base: {
      min: 0,
      max: 255,
      step: 1,
      hide_min_max: true,
      hide_from_to: true,
      grid: false
    }
  };
  import$(irsOpt, {
    "hsl-h": (ref$ = import$({}, irsOpt.base), ref$.max = 360, ref$),
    "hsl-s": (ref$ = import$({}, irsOpt.base), ref$.max = 1, ref$.step = 0.01, ref$),
    "hsl-l": (ref$ = import$({}, irsOpt.base), ref$.max = 1, ref$.step = 0.01, ref$),
    "hcl-h": (ref$ = import$({}, irsOpt.base), ref$.max = 360, ref$),
    "hcl-c": (ref$ = import$({}, irsOpt.base), ref$.max = 230, ref$),
    "hcl-l": (ref$ = import$({}, irsOpt.base), ref$.max = 100, ref$)
  });
  irsOpt["rgb-r"] = irsOpt["rgb-g"] = irsOpt["rgb-b"] = irsOpt.base;
  ['rgb-r', 'rgb-g', 'rgb-b', 'hsl-h', 'hsl-s', 'hsl-l', 'hcl-h', 'hcl-c', 'hcl-l'].map(function(it){
    return function(t){
      var v, ref$, this$ = this;
      v = t.split('-');
      root.find(".value[data-tag=" + t + "]", 0).on('change', function(e){
        var c;
        c = ldcp.getColor(v[0]);
        c[v[1]] = e.target.value;
        return ldcp.setColor(c);
      });
      return $(root.find(".ion-slider[data-tag=" + t + "]", 0)).ionRangeSlider((ref$ = irsOpt[t], ref$.onChange = function(e){
        var c;
        ldcp._slider = t;
        c = ldcp.getColor(v[0]);
        c[v[1]] = e.from;
        return ldcp.setColor(c);
      }, ref$));
    }(it);
  });
  el.ed.hex.on('change', function(e){
    return ldcp.setColor(e.target.value);
  });
  el.ed.sel.on('change', function(e){
    return el.ed.cfgs.map(function(it){
      return it.classList[it.attr('data-tag') === e.target.value ? 'add' : 'remove']('active');
    });
  });
  getIdx = function(e){
    var box, idx;
    box = el.ed.colors.getBoundingClientRect();
    return idx = (el.ed.colors.find('.color').length * (e.clientX - box.x)) / box.width;
  };
  dragger = function(e){
    var srcidx, desidx, src, des;
    srcidx = dragger.srcidx;
    desidx = Math.round(getIdx(e));
    if (srcidx === desidx || srcidx + 1 === desidx) {
      return;
    }
    log.push();
    src = el.ed.colors.childNodes[srcidx];
    des = el.ed.colors.childNodes[desidx];
    src.remove();
    el.ed.colors.insertBefore(src, des);
    return dragger.srcidx = desidx < srcidx
      ? desidx
      : desidx - 1;
  };
  el.ed.pal.on('mousedown', function(e){
    if (!e.target.parent('.colors', el.ed.pal)) {
      return;
    }
    dragger.srcidx = Math.floor(getIdx(e));
    document.removeEventListener('mousemove', dragger);
    return document.addEventListener('mousemove', dragger);
  });
  el.ed.pal.on('mouseup', function(e){
    if (!e.target.parent('.colors', el.ed.pal)) {
      return;
    }
    return document.removeEventListener('mousemove', dragger);
  });
  document.addEventListener('mouseup', function(){
    return document.removeEventListener('mousemove', dragger);
  });
  palFromNode = function(n){
    var name, that, hexs;
    name = (that = n.find('.palette', 0) || n.parent('.palette', root)) ? that.find('.name', 0).innerText : 'untitled';
    hexs = (that = n.find('.colors', 0) || n.parent('.colors', root))
      ? that.find('.color').map(function(it){
        return ldColor.hex(it.style.background);
      })
      : [];
    return {
      name: name,
      hexs: hexs
    };
  };
  usePal = function(n){
    var ref$, name, hexs;
    ref$ = palFromNode(n), name = ref$.name, hexs = ref$.hexs;
    return this$.fire('use', {
      name: name,
      colors: hexs.map(function(it){
        return {
          hex: it
        };
      })
    });
  };
  search = function(v){
    v == null && (v = "");
    if (!v) {
      return content.build(opt.palettes);
    }
    v = v.toLowerCase().trim();
    content.build(opt.palettes.filter(function(it){
      return it.name.indexOf(v) >= 0 || it.tag.filter(function(it){
        return it.indexOf(v) >= 0;
      }).length;
    }));
    return this$.tab('view');
  };
  el.nv.search.on('keyup', function(e){
    return search(e.target.value || "");
  });
  editInit = function(n, opt){
    var ref$, hexs, name;
    opt == null && (opt = {});
    opt = import$({
      colors: null,
      toggle: true,
      name: 'Custom'
    }, opt);
    if (opt.toggle) {
      this$.tab('edit');
    }
    if (opt.colors) {
      ref$ = [
        opt.colors.map(function(it){
          return ldColor.hex(it);
        }), opt.name
      ], hexs = ref$[0], name = ref$[1];
    } else {
      ref$ = palFromNode(n), name = ref$.name, hexs = ref$.hexs;
    }
    el.ed.colors.innerHTML = hexs.map(function(d, i){
      var hcl;
      hcl = ldColor.hcl(d);
      return "<div class=\"color" + (i ? '' : ' active') + (hcl.l < 50 ? ' dark' : '') + "\"\nstyle=\"background:" + d + ";color:" + d + "\">\n  <div class=\"btns\">\n    <div class=\"fa fa-clone\"></div>\n    <div class=\"fa fa-bars\"></div>\n    <div class=\"fa fa-close\"></div>\n  </div>\n</div>";
    }).join('');
    el.ed.colors.parentNode.find('.name', 0).innerHTML = name;
    editUpdate(hexs[0]);
    return ldcp.setColor(hexs[0]);
  };
  editUpdate = function(c){
    var hcl, node, this$ = this;
    hcl = ldColor.hcl(c);
    node = root.find('.color.active', 0);
    node.style.background = ldColor.rgbaStr(c);
    node.classList[hcl.l < 50 ? "add" : "remove"]('dark');
    el.ed.hex.value = ldColor.hex(c);
    c = {
      rgb: ldColor.rgb(c),
      hsl: ldColor.hsl(c),
      hcl: hcl
    };
    return ['rgb-r', 'rgb-g', 'rgb-b', 'hsl-h', 'hsl-s', 'hsl-l', 'hcl-h', 'hcl-c', 'hcl-l'].map(function(t){
      var p, v;
      p = t.split('-');
      v = c[p[0]][p[1]];
      if (!(t === 'hsl-s' || t === 'hsl-l')) {
        v = Math.round(v);
      }
      root.find(".value[data-tag=" + t + "]", 0).value = v;
      if (ldcp._slider === t) {
        return ldcp._slider = null;
      }
      return $(root.find(".ion-slider[data-tag=" + t + "]", 0)).data("ionRangeSlider").update({
        from: v
      });
    });
  };
  evts = {
    use: function(tgt){
      var n;
      if (n = tgt.parent(".palette .btn", root)) {
        if (n.attr('data-action') === 'use') {
          return usePal(n) || true;
        }
      }
      if (n = tgt.parent(".panel[data-panel=edit]", root)) {
        n = n.find('.palette', 0);
        if (n) {
          return usePal(n) || true;
        }
      }
    },
    view: function(tgt){
      var p, n;
      if (!(p = tgt.parent(".navbar", root))) {
        return;
      }
      if (n = tgt.parent("*[data-panel=view]", p)) {
        return this$.tab('view');
      }
      if (!(n = tgt.parent("*[data-cat]", p))) {
        return;
      }
      search(el.nv.search.value = n.attr("data-cat") || "");
      return this$.tab('view');
    },
    edit: function(tgt){
      var n;
      if (!(n = tgt.parent(".palette .btn", root))) {
        return;
      }
      if (n.attr('data-action') === 'edit') {
        return editInit(n) || true;
      }
    },
    undo: function(tgt){
      var n;
      if (n = tgt.parent("*[data-action=undo]", root)) {
        return log.undo() || true;
      }
    },
    nav: function(tgt){
      if (tgt.attr('data-panel') && tgt.parent('.navbar', root)) {
        return this$.tab(tgt.attr('data-panel'));
      }
    },
    editColor: function(tgt){
      var btn, color, sibling, node;
      btn = tgt.parent('.fa', el.ed.pal);
      color = tgt.parent(".color", el.ed.pal);
      if (btn && !btn.classList.contains('fa-bars') && color.classList.contains('active')) {
        if (btn.classList.contains('fa-close')) {
          log.push();
          if (color.classList.contains('active')) {
            sibling = color.parentNode.childNodes[color.index() + 1] || color.parentNode.childNodes[color.index() - 1];
            if (sibling) {
              sibling.classList.add('active');
            }
          }
          color.remove();
          return true;
        }
        if (btn.classList.contains('fa-clone')) {
          node = color.cloneNode(true);
          color.parentNode.child().map(function(it){
            return it.classList.remove('active');
          });
          node.classList.add('active');
          color.parentNode.insertAfter(node, color);
          return true;
        }
      }
      if (color) {
        color.parentNode.child().map(function(it){
          return it.classList[it === color ? 'add' : 'remove']('active');
        });
        ldcp.setColor(color.style.background);
        return true;
      }
    }
  };
  root.addEventListener('click', function(e){
    var tgt;
    tgt = e.target;
    if (evts.use(tgt)) {
      return;
    }
    if (evts.view(tgt)) {
      return;
    }
    if (evts.edit(tgt)) {
      return;
    }
    if (evts.undo(tgt)) {
      return;
    }
    if (evts.nav(tgt)) {
      return;
    }
    if (evts.editColor(tgt)) {}
  });
  this.evtHandler = {};
  content.build(opt.palettes);
  editInit(null, {
    colors: ['#b34e19', '#d78c51', '#f3e7c9'],
    toggle: false
  });
  return this;
};
ldPalettePicker.prototype = import$(Object.create(Object.prototype), {
  on: function(n, cb){
    var ref$;
    return ((ref$ = this.evtHandler)[n] || (ref$[n] = [])).push(cb);
  },
  fire: function(n){
    var v, i$, ref$, len$, cb, results$ = [];
    v = slice$.call(arguments, 1);
    for (i$ = 0, len$ = (ref$ = this.evtHandler[n] || []).length; i$ < len$; ++i$) {
      cb = ref$[i$];
      results$.push(cb.apply(this, v));
    }
    return results$;
  },
  tab: function(n){
    var idx, that;
    if (!n) {
      return;
    }
    idx = (that = this.root.find(".panel[data-panel=" + n + "]", 0))
      ? that.index()
      : -1;
    if (idx < 0) {
      return;
    }
    this.root.find('.panels', 0).style.transform = "translate(" + idx * -100 + "%,0)";
    this.root.find(".nav-link").map(function(it){
      return it.classList[it.attr('data-panel') === n ? 'add' : 'remove']('active');
    });
    return true;
  }
});
import$(ldPalettePicker, {
  palettes: [],
  parse: {
    text: function(txt){
      return txt.split('\n').filter(function(it){
        return it;
      }).map(function(v){
        v = v.split(',').map(function(it){
          return it.toLowerCase();
        });
        return {
          name: v[0],
          colors: v[1].split(' ').map(function(it){
            return "#" + it;
          }),
          tag: v.slice(2)
        };
      });
    }
  },
  register: function(name, palettes){
    if (typeof palettes === 'string') {
      palettes = this.parse.text(palettes);
    }
    return this.palettes.push([name, palettes]);
  },
  get: function(name){
    return (this.palettes.filter(function(it){
      return it[0] === name;
    })[0] || ['', []])[1];
  },
  init: function(pals){
    pals == null && (pals = null);
    if (!pals) {
      pals = this.get('default');
    }
    return Array.from(document.querySelectorAll('*[ldPalettePicker]')).map(function(it){
      return new ldPalettePicker(it, {
        palettes: pals
      });
    });
  }
});
ldPalettePicker.register("default", "flourish,b22 e55 f87 fb6 ab8 898,qualitative\ngray,000 333 666 ddd fff,gradient\nyoung,fec fe6 cd9 acd 7ab aac,concept\nplotDB,ed1e79 c69c6d 8cc63f 29abe2,brand\nFrench,37a 9ab eee f98 c10,diverging\nAfghan Girl,010 253 ffd da8 b53,artwork");
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
