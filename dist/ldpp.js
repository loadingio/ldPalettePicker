// Generated by LiveScript 1.3.1
var ldPalettePicker, slice$ = [].slice;
ldPalettePicker = function(node, opt){
  var root, el, content, mypal, ret, saver, log, ldcp, ldrs, irsOpt, ref$, getIdx, dragger, palFromNode, usePal, search, editInit, editUpdate, evts, this$ = this;
  opt == null && (opt = {});
  opt = import$({
    palettes: [],
    itemPerLine: 2
  }, opt);
  this.pals = {
    view: opt.palettes
  };
  this.root = root = typeof node === typeof '' ? node = document.querySelector(node) : node;
  if (opt.className) {
    this.root.classList.add.apply(this.root.classList, opt.className.split(' ').filter(function(it){
      return it;
    }).map(function(it){
      return it.trim();
    }));
  }
  this.el = el = {};
  el.nv = {
    root: ld$.find(root, '.navbar', 0),
    search: ld$.find(root, 'input[data-tag=search]', 0)
  };
  el.pn = {
    view: ld$.find(root, '.panel[data-panel=view]', 0),
    mypal: ld$.find(root, '.panel[data-panel=mypal]', 0),
    edit: ld$.find(root, '.panel[data-panel=edit]', 0)
  };
  el.pnin = {
    view: ld$.find(el.pn.view, '.inner', 0),
    mypal: ld$.find(el.pn.mypal, '.inner', 0)
  };
  el.ed = {
    picker: ld$.find(el.pn.edit, '.ldColorPicker', 0),
    pal: ld$.find(el.pn.edit, '.palette', 0),
    colors: ld$.find(el.pn.edit, '.palette .colors', 0),
    hex: ld$.find(el.pn.edit, 'input[data-tag=hex]', 0),
    sel: ld$.find(el.pn.edit, 'select', 0),
    cfgs: ld$.find(el.pn.edit, '.config'),
    save: ld$.find(el.pn.edit, '*[data-action=save]', 0)
  };
  el.mp = {
    load: ld$.find(el.pn.mypal, '.btn-load', 0)
  };
  content = {
    pals: {},
    add: function(tab, p){
      var ref$, this$ = this;
      tab == null && (tab = 'view');
      if (!this.pals[tab]) {
        this.pals[tab] = [];
      }
      return (ref$ = this.pals)[tab] = ref$[tab].concat(p.map(function(it){
        return {
          html: this$.html(it),
          obj: it
        };
      }));
    },
    build: function(p, tgt){
      var rows, lines, i$, step$, to$, i, line, j$, to1$, j;
      p == null && (p = []);
      tgt == null && (tgt = 'view');
      if (tgt === 'edit') {
        tgt = 'view';
      }
      rows = p.map(function(it){
        return it.html;
      });
      if (rows.length === 0) {
        return el.pnin[tgt].innerHTML = "no result...";
      }
      if (opt.useClusterizejs) {
        lines = [];
        for (i$ = 0, to$ = rows.length, step$ = opt.itemPerLine; step$ < 0 ? i$ > to$ : i$ < to$; i$ += step$) {
          i = i$;
          line = [];
          for (j$ = 0, to1$ = opt.itemPerLine; j$ < to1$; ++j$) {
            j = j$;
            line.push(rows[i + j]);
          }
          lines.push("<div>" + line.join('') + "</div>");
        }
        return new Clusterize({
          rows: lines,
          contentElem: el.pnin[tgt],
          scrollElem: el.pn[tgt]
        });
      } else {
        return el.pnin[tgt].innerHTML = rows.join('');
      }
    },
    html: function(c){
      var cs;
      cs = c.colors.map(function(it){
        return "<div class=\"color\" style=\"background:" + ldColor.rgbaStr(it) + "\"></div>";
      }).join("");
      return "<div class=\"palette\"" + (c.key ? " data-key=\"" + c.key + "\"" : "") + ">\n  <div class=\"colors\">\n  " + cs + "\n  <div class=\"ctrl\">\n  <div class=\"btn btn-sm\" data-action=\"use\"><i class=\"i-check\"></i><div class=\"desc\">USE</div></div>\n  <div class=\"btn btn-sm\" data-action=\"edit\"><i class=\"i-cog\"></i><div class=\"desc\">EDIT</div></div>\n  </div>\n  </div>\n  <div class=\"name\">" + (c.name || 'untitled') + "</div>\n</div>";
    }
  };
  if (opt.mypal != null) {
    mypal = {
      loader: new ldLoader({
        root: el.mp.load
      }),
      page: Object.create(opt.mypal),
      fetch: function(){
        return this.page.fetch().then(function(ret){
          content.add('mypal', ret);
          return content.build(content.pals.mypal, 'mypal');
        });
      }
    };
    mypal.page.setHost(el.pn.mypal);
    el.mp.load.addEventListener('click', function(){
      return mypal.loader.on(100).then(function(){
        return mypal.page.fetch();
      }).then(function(it){
        content.add('mypal', it);
        return content.build(content.pals.mypal, 'mypal');
      }).then(function(){
        return mypal.loader.off(100);
      }).then(function(){
        if (mypal.page.isEnd()) {
          return el.mp.load.style.display = 'none';
        }
      });
    });
  } else {
    ret = ld$.parent(ld$.find(el.nv.root, 'a[data-panel=mypal]', 0), '.nav-item', el.nv.root);
    ret.style.display = 'none';
    ld$.remove(el.pn.mypal);
  }
  if (opt.save != null) {
    saver = {
      loader: new ldLoader({
        root: el.ed.save
      }),
      save: opt.save
    };
  } else {
    ld$.remove(el.ed.save);
  }
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
      return el.ed.colors = ld$.find(el.ed.pal, '.colors', 0);
    },
    push: function(forced){
      var that, _, this$ = this;
      forced == null && (forced = false);
      if (that = this.handle) {
        clearTimeout(that);
      }
      if (!this.cur) {
        this.cur = el.ed.pal.innerHTML;
      }
      _ = function(){
        var ref$;
        if ((ref$ = this$.stack)[ref$.length - 1] !== this$.cur) {
          this$.stack.push(this$.cur);
        }
        return this$.handle = null, this$.cur = null, this$;
      };
      if (forced) {
        return _();
      } else {
        return this.handle = setTimeout(function(){
          return _();
        }, 200);
      }
    }
  };
  this.ldcp = ldcp = new ldColorPicker(el.ed.picker, {
    inline: true
  });
  ldcp.on('change', function(it){
    log.push();
    return editUpdate(it);
  });
  ldrs = {};
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
      var v;
      v = t.split('-');
      ld$.find(root, ".value[data-tag=" + t + "]", 0).addEventListener('change', function(e){
        var c;
        c = ldcp.getColor(v[0]);
        c[v[1]] = e.target.value;
        return ldcp.setColor(c);
      });
      ldrs[t] = new ldSlider(import$({
        root: ld$.find(root, ".ldrs[data-tag=" + t + "]", 0)
      }, irsOpt[t]));
      return function(t){
        return ldrs[t].on('change', function(val){
          var c;
          ldcp._slider = t;
          c = ldcp.getColor(v[0]);
          c[v[1]] = val;
          return ldcp.setColor(c);
        });
      }(t);
    }(it);
  });
  el.ed.hex.addEventListener('change', function(e){
    return ldcp.setColor(e.target.value);
  });
  el.ed.sel.addEventListener('change', function(e){
    return el.ed.cfgs.map(function(it){
      var k, ref$, v, results$ = [];
      it.classList[ld$.attr(it, 'data-tag') === e.target.value ? 'add' : 'remove']('active');
      for (k in ref$ = ldrs) {
        v = ref$[k];
        results$.push(v.update());
      }
      return results$;
    });
  });
  getIdx = function(e){
    var box, idx;
    box = el.ed.colors.getBoundingClientRect();
    return idx = (ld$.find(el.ed.colors, '.color').length * (e.clientX - box.x)) / box.width;
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
  el.ed.pal.addEventListener('mousedown', function(e){
    if (!ld$.parent(e.target, '.colors', el.ed.pal)) {
      return;
    }
    dragger.srcidx = Math.floor(getIdx(e));
    document.removeEventListener('mousemove', dragger);
    return document.addEventListener('mousemove', dragger);
  });
  el.ed.pal.addEventListener('mouseup', function(e){
    if (!ld$.parent(e.target, '.colors', el.ed.pal)) {
      return;
    }
    return document.removeEventListener('mousemove', dragger);
  });
  document.addEventListener('mouseup', function(){
    return document.removeEventListener('mousemove', dragger);
  });
  palFromNode = function(n){
    var p, that, ref$, key, name, hexs;
    p = ld$.find(n, '.palette', 0) || ld$.parent(n, '.palette', root);
    ref$ = (that = p)
      ? [ld$.attr(p, 'data-key'), ld$.find(that, '.name', 0).innerText]
      : [null, 'untitled'], key = ref$[0], name = ref$[1];
    hexs = (that = ld$.find(n, '.colors', 0) || ld$.parent(n, '.colors', root))
      ? ld$.find(that, '.color').map(function(it){
        return ldColor.hex(it.style.background);
      })
      : [];
    return {
      name: name,
      hexs: hexs,
      key: key
    };
  };
  usePal = function(n){
    var ref$, name, hexs, key;
    ref$ = palFromNode(n), name = ref$.name, hexs = ref$.hexs, key = ref$.key;
    return this$.fire('use', {
      name: name,
      key: key,
      colors: hexs.map(function(it){
        return ldColor.rgb(it);
      })
    });
  };
  search = function(v){
    var n, pal;
    v == null && (v = "");
    n = ld$.find(el.nv.root, '.active', 0);
    pal = n ? ld$.attr(n, 'data-panel') : 'view';
    if (!v) {
      return content.build(content.pals[pal] || [], pal);
    }
    v = v.toLowerCase().trim();
    if (pal === 'edit') {
      pal = 'view';
    }
    content.build((content.pals[pal] || []).filter(function(it){
      return (it.obj.name || 'untitled').indexOf(v) >= 0 || (it.obj.tag || []).filter(function(it){
        return it.indexOf(v) >= 0;
      }).length;
    }), pal);
    return this$.tab(pal);
  };
  el.nv.search.addEventListener('keyup', function(e){
    return search(e.target.value || "");
  });
  editInit = function(n, opt){
    var ref$, hexs, name, key, elp;
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
      ref$ = palFromNode(n), name = ref$.name, hexs = ref$.hexs, key = ref$.key;
    }
    elp = el.ed.colors.parentNode;
    if (key) {
      elp.setAttribute('data-key', key);
    } else {
      elp.removeAttribute('data-key');
    }
    el.ed.colors.innerHTML = hexs.map(function(d, i){
      var hcl;
      hcl = ldColor.hcl(d);
      return "<div class=\"color" + (i ? '' : ' active') + (hcl.l < 50 ? ' dark' : '') + "\"\nstyle=\"background:" + d + ";color:" + d + "\">\n  <div class=\"btns\">\n    <i class=\"i-clone\"></i>\n    <i class=\"i-bars\"></i>\n    <i class=\"i-close\"></i>\n  </div>\n</div>";
    }).join('');
    ld$.find(elp, '.name', 0).innerHTML = name;
    editUpdate(hexs[0]);
    return ldcp.setColor(hexs[0]);
  };
  editUpdate = function(c){
    var hcl, node, this$ = this;
    hcl = ldColor.hcl(c);
    node = ld$.find(root, '.color.active', 0);
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
      ld$.find(root, ".value[data-tag=" + t + "]", 0).value = v;
      if (ldcp._slider === t) {
        return ldcp._slider = null;
      }
      return ldrs[t].set(v);
    });
  };
  evts = {
    save: function(tgt){
      var elp, key, name, colors, ref$, width, height, len, canvas, ctx, i$, i;
      if (!ld$.parent(tgt, '[data-action=save]', root)) {
        return false;
      }
      if (!(saver != null)) {
        return true;
      }
      saver.loader.on();
      elp = el.ed.colors.parentNode;
      key = ld$.attr(elp, 'data-key');
      name = ld$.find(elp, '.name', 0).textContent || "untitled";
      colors = ld$.find(el.ed.colors, '.color').map(function(it){
        return {
          value: ldColor.rgbaStr(it.style.background)
        };
      });
      ref$ = [800, 300, colors.length], width = ref$[0], height = ref$[1], len = ref$[2];
      canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
      ref$ = canvas.style;
      ref$.display = 'block';
      ref$.position = 'absolute';
      ref$.zIndex = -1;
      ref$.opacity = 0;
      ref$.visibility = 'hidden';
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (i$ = 0; i$ < len; ++i$) {
        i = i$;
        ctx.fillStyle = colors[i].value;
        ctx.fillRect((width - 600) * 0.5 + 600 * (i / len), (height - 150) * 0.5, 600 / len, 150);
      }
      canvas.toBlob(function(thumb){
        return saver.save({
          thumb: thumb,
          data: {
            name: name,
            type: 'palette',
            payload: {
              colors: colors
            }
          }
        }, key)['finally'](function(){
          return saver.loader.off(500);
        }).then(function(){
          return this$.fire('save', null);
        })['catch'](function(it){
          return this$.fire('save', it);
        });
      });
      return true;
    },
    use: function(tgt){
      var n;
      if (!ld$.parent(tgt, '[data-action=use]', root)) {
        return false;
      }
      if (n = ld$.parent(tgt, ".palette .btn", root)) {
        return usePal(n) || true;
      }
      if (n = ld$.parent(tgt, ".panel[data-panel=edit]", root)) {
        n = ld$.find(n, '.palette', 0);
        if (n) {
          return usePal(n) || true;
        }
      }
    },
    mypal: function(tgt){
      var p, n;
      if (!(p = ld$.parent(tgt, ".navbar", root))) {
        return;
      }
      if (n = ld$.parent(tgt, "*[data-panel=mypal]", p)) {
        if (!(mypal != null)) {
          return this$.tab('view');
        }
        mypal.fetch();
        return this$.tab('mypal');
      }
    },
    view: function(tgt){
      var p, n;
      if (!(p = ld$.parent(tgt, ".navbar", root))) {
        return;
      }
      if (n = ld$.parent(tgt, "*[data-panel=view]", p)) {
        return this$.tab('view');
      }
      if (!(n = ld$.parent(tgt, "*[data-cat]", p))) {
        return;
      }
      this$.tab('view');
      return search(el.nv.search.value = ld$.attr(n, "data-cat") || "");
    },
    edit: function(tgt){
      var n;
      if (!(n = ld$.parent(tgt, ".palette .btn", root))) {
        return;
      }
      if (ld$.attr(n, 'data-action') === 'edit') {
        return editInit(n) || true;
      }
    },
    undo: function(tgt){
      var n;
      if (n = ld$.parent(tgt, "*[data-action=undo]", root)) {
        return log.undo() || true;
      }
    },
    nav: function(tgt){
      if (ld$.attr(tgt, 'data-panel') && ld$.parent(tgt, '.navbar', root)) {
        return this$.tab(ld$.attr(tgt, 'data-panel'));
      }
    },
    editColor: function(tgt){
      var btn, color, sibling, node;
      btn = ld$.parent(tgt, 'i', el.ed.pal);
      color = ld$.parent(tgt, ".color", el.ed.pal);
      if (btn && !btn.classList.contains('i-bars') && color.classList.contains('active')) {
        if (btn.classList.contains('i-close')) {
          if (color.parentNode.childNodes.length <= 1) {
            return true;
          }
          log.push();
          if (color.classList.contains('active')) {
            sibling = color.parentNode.childNodes[ld$.index(color) + 1] || color.parentNode.childNodes[ld$.index(color) - 1];
            if (sibling) {
              sibling.classList.add('active');
            }
          }
          color.remove();
          return true;
        }
        if (btn.classList.contains('i-clone')) {
          node = color.cloneNode(true);
          ld$.child(color.parentNode).map(function(it){
            return it.classList.remove('active');
          });
          node.classList.add('active');
          ld$.insertAfter(color.parentNode, node, color);
          return true;
        }
      }
      if (color) {
        ld$.child(color.parentNode).map(function(it){
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
    if (evts.save(tgt)) {
      return;
    }
    if (evts.use(tgt)) {
      return;
    }
    if (evts.mypal(tgt)) {
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
  content.add('view', opt.palettes);
  content.build(content.pals.view);
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
    idx = (that = ld$.find(this.root, ".panel[data-panel=" + n + "]", 0))
      ? ld$.index(that)
      : -1;
    if (idx < 0) {
      return;
    }
    ld$.find(this.root, '.panels', 0).style.transform = "translate(" + idx * -100 + "%,0)";
    ld$.find(this.root, ".nav-link").map(function(it){
      return it.classList[ld$.attr(it, 'data-panel') === n ? 'add' : 'remove']('active');
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
  init: function(opt){
    var pals;
    opt == null && (opt = {});
    pals = !opt.pals
      ? this.get('default')
      : opt.pals;
    return Array.from(document.querySelectorAll('*[ldPalettePicker]')).map(function(it){
      return new ldPalettePicker(it, import$({
        palettes: pals
      }, opt));
    });
  }
});
ldPalettePicker.register("default", "flourish,b22 e55 f87 fb6 ab8 898,qualitative\ngray,000 333 666 ddd fff,gradient\nyoung,fec fe6 cd9 acd 7ab aac,concept\nplotDB,ed1e79 c69c6d 8cc63f 29abe2,brand\nFrench,37a 9ab eee f98 c10,diverging\nAfghan Girl,010 253 ffd da8 b53,artwork");
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
