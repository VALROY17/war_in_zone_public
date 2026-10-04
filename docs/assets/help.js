/* ============================================================
   War In Zone — ModdingHelp JS
   Основано на оригинальном <script> из ModdingHelp.html (ветка dev).
   Блоки 2, 3, 4 адаптированы для многостраничной структуры
   (отмечено [АДАПТАЦИЯ]). Блоки 0 и 1 идентичны оригиналу.
   ============================================================ */


/* ============================================================
   0. БЕЙДЖИ ТИПОВ ЗНАЧЕНИЙ  (маркер @@)
      Из оригинала <script id="vt-badge-js">.
      [АДАПТАЦИЯ] только в строке a.href (использует HELP_BASE из nav.js).
   ============================================================ */
(function(){
  'use strict';

  var TYPES = {
    'ТЕКСТ':    {e:'📝', t:'Любой текст. Пишется прямо в конфиг, без обращения к messages.csv'},
    'НАЗВАНИЕ': {e:'🏷', t:'Техническое название: из [] другого конфига, имя файла без расширения или уникальный ID'},
    'ЦЕЛОЕ':    {e:'🔢', t:'Только целое число. Дробные запрещены (FAQ №10)'},
    'ДРОБНОЕ':  {e:'➗', t:'Целое или дробное. Дробь пишется через запятую: 1,5'},
    'ЧИСЛА':    {e:'📋', t:'Список целых чисел через запятую'},
    'НАЗВАНИЯ': {e:'🗂', t:'Список технических названий через запятую'},
    'BOOL':     {e:'🔘', t:'Только True или False'},
    'ВЫБОР':    {e:'🎯', t:'Одно значение из фиксированного списка. Перечень - в описании параметра или в отдельной таблице'},
    'ПУТЬ':     {e:'📁', t:'Относительный путь к файлу, обратные слэши: gfx\\icons\\...'}
  };
  var ALIAS = {
    'TEXT':'ТЕКСТ','STR':'ТЕКСТ','NAME':'НАЗВАНИЕ','ID':'НАЗВАНИЕ',
    'INT':'ЦЕЛОЕ','INTEGER':'ЦЕЛОЕ','FLOAT':'ДРОБНОЕ','DECIMAL':'ДРОБНОЕ',
    'NUM':'ЧИСЛА','NUMS':'ЧИСЛА','LIST':'НАЗВАНИЯ','NAMES':'НАЗВАНИЯ',
    'ENUM':'ВЫБОР','SELECT':'ВЫБОР','PATH':'ПУТЬ','FILE':'ПУТЬ','BOOLEAN':'BOOL'
  };

  var MARK = '@@';
  var SKIP_TAGS = {PRE:1, CODE:1, SCRIPT:1, STYLE:1, TEXTAREA:1, NOSCRIPT:1};

  var CMP   = '[≥≤><]=?[ \\t]*-?\\d+';
  var NUM   = '\\d+(?:[ \\t]*[-–—\\.]{1,2}[ \\t]*\\d+)?(?![\\d.,–—-])';
  var ENUMV = '[A-ZА-ЯЁ][A-ZА-ЯЁ0-9]+(?:[ \\t]+(?:или|и|or|OR)[ \\t]+[A-ZА-ЯЁ][A-ZА-ЯЁ0-9]+){0,2}(?![A-Za-zА-Яа-яЁё0-9])';
  var MOD   = '(?:' + CMP + '|' + NUM + '|' + ENUMV + ')';
  var RE    = new RegExp(MARK + '[ \\t]*([A-Za-zА-Яа-яЁё]+)(?:[ \\t]*(' + MOD + '))?(?:[ \\t]+(' + MOD + '))?', 'g');

  function parse(word, m1, m2){
    var w = word.toUpperCase();
    var key = TYPES[w] ? w : (ALIAS[w] || null);
    if(!key) return null;
    var mod = [m1, m2].filter(function(x){return !!x;}).join(' ');
    return { label: TYPES[key].e + ' ' + key + (mod ? ' ' + mod : ''),
             tip:   TYPES[key].t + (mod ? '. Допустимые значения: ' + mod : '') };
  }
  function badge(p){
    var a = document.createElement('a');
    a.className = 'vt';
    /* [АДАПТАЦИЯ] ссылка на value-types.html в многостраничнике */
    a.href = (typeof HELP_BASE !== 'undefined' ? HELP_BASE : '') + 'ref/value-types.html';
    a.setAttribute('data-tip', p.tip);
    a.setAttribute('aria-label', 'Тип значения: ' + p.label);
    a.textContent = p.label;
    return a;
  }
  function badBadge(raw){
    var s = document.createElement('span');
    s.className = 'vt-bad'; s.title = 'Нераспознанный тип значения';
    s.textContent = raw; return s;
  }
  function skipped(node){
    var p = node.parentElement;
    while(p){
      if(SKIP_TAGS[p.nodeName]) return true;
      if(p.classList && (p.classList.contains('no-badges') || p.classList.contains('vt'))) return true;
      p = p.parentElement;
    }
    return false;
  }
  function sectionOf(node){
    var s = node.parentElement ? node.parentElement.closest('.section, section, div[id]') : null;
    if(s){ var h = s.querySelector('h2,h3'); if(h) return h.textContent.trim(); }
    return '(вне раздела)';
  }
  function processNode(node, warns){
    var txt = node.nodeValue;
    RE.lastIndex = 0;
    var frag = document.createDocumentFragment(), last = 0, done = 0, m;
    while((m = RE.exec(txt)) !== null){
      var p = parse(m[1], m[2], m[3]);
      frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
      if(p){ frag.appendChild(badge(p)); }
      else { warns.push(m[0] + ' → «' + sectionOf(node) + '»'); frag.appendChild(badBadge(m[0])); }
      last = m.index + m[0].length; done++;
    }
    if(!done) return 0;
    frag.appendChild(document.createTextNode(txt.slice(last)));
    node.parentNode.replaceChild(frag, node);
    return done;
  }
  function isBadgeOnly(td){
    var l = td.querySelectorAll('a.vt');
    return (l.length === 1 && td.textContent.trim() === l[0].textContent.trim());
  }
  function markColumns(){
    var tbs = document.querySelectorAll('table');
    for(var t=0;t<tbs.length;t++){
      var tb = tbs[t], cols = {}, r, c;
      for(r=0;r<tb.rows.length;r++){
        var tr = tb.rows[r];
        if(tb.tHead && tr.parentNode === tb.tHead) continue;
        for(c=0;c<tr.cells.length;c++){ if(isBadgeOnly(tr.cells[c])) cols[c]=true; }
      }
      for(var k in cols){
        c = +k;
        for(r=0;r<tb.rows.length;r++){ var cell = tb.rows[r].cells[c]; if(cell) cell.classList.add('vt-cell'); }
      }
    }
  }
  function decorate(){
    var warns = [], total = 0;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function(n){
        if(!n.nodeValue || n.nodeValue.indexOf(MARK) === -1) return NodeFilter.FILTER_REJECT;
        return skipped(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while((n = walker.nextNode())) nodes.push(n);
    for(var i=0;i<nodes.length;i++){ total += processNode(nodes[i], warns); }
    markColumns();
    if(warns.length) console.warn('[ModdingHelp] Нераспознанные бейджи (' + warns.length + '):\n  ' + warns.join('\n  '));
    else console.info('[ModdingHelp] Бейджей расставлено: ' + total);
    return total;
  }

  var tip = document.createElement('div');
  tip.id = 'vtTooltip';
  function show(el){
    var t = el.getAttribute('data-tip'); if(!t) return;
    tip.textContent = t; tip.classList.add('show');
    var r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    var left = Math.max(8, Math.min(r.left + r.width/2 - tw/2, window.innerWidth - tw - 8));
    var top = r.bottom + 8;
    if(top + th > window.innerHeight - 8) top = r.top - th - 8;
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }
  function hide(){ tip.classList.remove('show'); }

  function boot(){
    if(!tip.parentNode) document.body.appendChild(tip);
    document.addEventListener('mouseover', function(e){ var el = e.target.closest && e.target.closest('.vt'); if(el) show(el); });
    document.addEventListener('mouseout',  function(e){ if(e.target.closest && e.target.closest('.vt')) hide(); });
    document.addEventListener('click',     function(e){ if(e.target.closest && e.target.closest('.vt')) hide(); });
    window.addEventListener('scroll', hide, true);
    decorate();
  }

  window.decorateBadges = decorate;
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();


/* ============================================================
   1. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
      Из оригинала — БЕЗ ИЗМЕНЕНИЙ
   ============================================================ */
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-theme');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});


/* ============================================================
   2. [АДАПТАЦИЯ] ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
      В оригинале это блок переключения секций через .is-active
      (одностраничное приложение). В многостраничнике секции не
      переключаются — каждая страница содержит свои секции и все
      они видны сразу. Нужна только подсветка активного пункта.
   ============================================================ */
(function () {
    var navLinks = Array.prototype.slice.call(
        document.querySelectorAll('.sidebar ul li a')
    );
    if (!navLinks.length) return;

    function currentFile() {
        return (window.location.pathname || '').split('/').pop() || 'index.html';
    }

    function highlight() {
        var file = currentFile();
        var hash = window.location.hash.replace('#', '');

        var sameFile = navLinks.filter(function (a) {
            var h = a.getAttribute('href') || '';
            return h.split('#')[0].split('/').pop() === file;
        });
        if (!sameFile.length) return;

        /* Если несколько пунктов ведут в один файл (start.html с 4 якорями,
           map.html с 8 якорями) — активным делаем тот, чей якорь совпал. */
        var exact = sameFile.filter(function (a) {
            var h = a.getAttribute('href') || '';
            return h.indexOf('#') !== -1 && h.split('#')[1] === hash;
        });

        navLinks.forEach(function (a) { a.classList.remove('active'); });
        (exact.length ? exact[0] : sameFile[0]).classList.add('active');
    }

    highlight();
    window.addEventListener('hashchange', highlight);
})();


/* ============================================================
   3. [АДАПТАЦИЯ] АВТО-ЛИНКИФИКАЦИЯ ПЕРЕКРЁСТНЫХ ССЫЛОК
      В оригинале href = '#' + targetId (внутри одного DOM).
      В многостраничнике href = PREFIX + 'ref/file.html#anchor'.
      Карта REF_MAP экспортируется nav.js как HELP_REF_MAP.
   ============================================================ */
(function () {
    var REF_MAP = window.HELP_REF_MAP || {};
    var FILE_KEYS = Object.keys(REF_MAP).filter(function (k) { return k.indexOf('.') !== -1; });

    /* Префикс уже вычислен в nav.js */
    var refPrefix = (window.HELP_PREFIX || '') + 'ref/';

    function linkifyRefs() {
        document.querySelectorAll('code').forEach(function (codeEl) {
            if (codeEl.closest('pre')) return;
            if (codeEl.closest('a')) return;

            var raw = codeEl.textContent.trim();
            var key = raw.toLowerCase();

            var target = REF_MAP[key];

            if (!target) {
                var found = FILE_KEYS.find(function (k) { return key.indexOf(k) !== -1; });
                if (found) target = REF_MAP[found];
            }

            if (!target) return;

            var a = document.createElement('a');
            a.href = refPrefix + target.file + (target.anchor ? '#' + target.anchor : '');
            a.className = 'inline-ref';
            a.textContent = raw;
            a.title = 'Перейти к разделу';
            codeEl.replaceWith(a);
        });
    }

    linkifyRefs();
})();


/* ============================================================
   4. ПОЛНОТЕКСТОВЫЙ ПОИСК ПО ВСЕЙ СПРАВКЕ
      Индекс генерируется скриптом build-search-index.py.
      Ищет по реальному тексту всех страниц и секций.
      Обновление индекса: запустить build-search-index.bat
   ============================================================ */
(function () {
    var searchInput  = document.getElementById('searchInput');
    var searchClear  = document.getElementById('searchClear');
    var searchStatus = document.getElementById('searchStatus');
    var noResult     = document.getElementById('searchNoResult');

    if (!searchInput) return;

    var INDEX  = window.HELP_SEARCH_INDEX || [];
    var prefix = (typeof HELP_PREFIX !== 'undefined') ? HELP_PREFIX : '';

    /* Контейнер результатов */
    var results = document.createElement('div');
    results.className = 'search-results';
    results.style.display = 'none';
    var box = searchInput.closest('.search-box') || searchInput.parentElement;
    box.appendChild(results);

    /* --- Вспомогательные --- */
    function esc(s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function escRe(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    function plural(n, f) {
        var m10 = n % 10, m100 = n % 100;
        if (m10 === 1 && m100 !== 11) return f[0];
        if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return f[1];
        return f[2];
    }

    /* Фрагмент текста вокруг найденного слова с подсветкой */
    function snippet(text, query) {
        var lower = text.toLowerCase();
        var q = query.toLowerCase();
        var idx = lower.indexOf(q);
        if (idx === -1) return esc(text.substring(0, 120)) + '…';

        var start = Math.max(0, idx - 60);
        var end   = Math.min(text.length, idx + query.length + 80);
        var s = (start > 0 ? '…' : '')
              + text.substring(start, end)
              + (end < text.length ? '…' : '');

        var re = new RegExp('(' + escRe(esc(query)) + ')', 'gi');
        return esc(s).replace(re, '<mark>$1</mark>');
    }

    /* --- Сброс --- */
    function reset() {
        results.style.display = 'none';
        results.innerHTML = '';
        noResult.classList.remove('is-visible');
        searchStatus.textContent = '';

        var links = document.querySelectorAll('.sidebar ul li a');
        for (var i = 0; i < links.length; i++)
            links[i].closest('li').style.display = '';

        var labels = document.querySelectorAll('.sidebar-section-label');
        for (var j = 0; j < labels.length; j++)
            labels[j].style.display = '';

        var uls = document.querySelectorAll('.sidebar-scroll > ul');
        for (var k = 0; k < uls.length; k++)
            uls[k].style.display = '';
    }

    /* --- Основной поиск --- */
    function runSearch() {
        var raw = searchInput.value.trim();
        var q   = raw.toLowerCase();

        searchClear.classList.toggle('is-visible', raw.length > 0);

        if (!q || q.length < 2) { reset(); return; }

        var found = [];
        for (var i = 0; i < INDEX.length; i++) {
            var e = INDEX[i];
            var inTitle = e.title.toLowerCase().indexOf(q) !== -1;
            var inText  = e.text.toLowerCase().indexOf(q) !== -1;
            if (inTitle || inText) {
                found.push({ entry: e, inTitle: inTitle });
            }
        }

        /* Сначала совпадения в заголовке */
        found.sort(function (a, b) {
            if (a.inTitle && !b.inTitle) return -1;
            if (!a.inTitle && b.inTitle) return 1;
            return 0;
        });

        if (found.length === 0) {
            results.style.display = 'none';
            results.innerHTML = '';
            noResult.classList.add('is-visible');
            searchStatus.textContent = '';
            return;
        }

        noResult.classList.remove('is-visible');
        searchStatus.textContent = 'Найдено ' + found.length + ' ' +
            plural(found.length, ['секция', 'секции', 'секций']);

        var html = '<div class="search-results-title">Результаты (' + found.length + ')</div>';
        html += '<ul class="search-results-list">';
        var max = Math.min(found.length, 50);
        for (var j = 0; j < max; j++) {
            var f = found[j];
            var url = prefix + f.entry.file + (f.entry.id ? '#' + f.entry.id : '');
            html += '<li>';
            html += '<a href="' + esc(url) + '" class="search-result-link">';
            html += '<span class="search-result-title">' + esc(f.entry.title) + '</span>';
            html += '<span class="search-result-snippet">' + snippet(f.entry.text, raw) + '</span>';
            html += '<span class="search-result-file">' + esc(f.entry.file) + '</span>';
            html += '</a>';
            html += '</li>';
        }
        html += '</ul>';
        if (found.length > 50) {
            html += '<div class="search-results-more">…и ещё ' + (found.length - 50) + '</div>';
        }
        results.innerHTML = html;
        results.style.display = 'block';
    }

    /* --- Обработчики --- */
    var timer;
    searchInput.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(runSearch, 150);
    });

    searchClear.addEventListener('click', function () {
        searchInput.value = '';
        runSearch();
        searchInput.focus();
    });

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            runSearch();
            searchInput.blur();
        }
        if (e.key === 'Enter') {
            var first = results.querySelector('.search-result-link');
            if (first) { e.preventDefault(); first.click(); }
        }
    });

    document.addEventListener('keydown', function (e) {
        var tag = document.activeElement && document.activeElement.tagName;
        if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });
})();