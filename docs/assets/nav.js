/* ============================================================
   War In Zone — ModdingHelp: ДАННЫЕ НАВИГАЦИИ
   Единый источник меню для всех страниц.

   ⚠️ ПОРЯДОК ПОДКЛЮЧЕНИЯ: nav.js ДОЛЖЕН идти РАНЬШЕ help.js,
      иначе поиск и подсветка инициализируются на пустом сайдбаре.

   Якоря (#...) сохранены 1:1 из оригинального ModdingHelp.html.
   ============================================================ */
(function () {
    'use strict';

    /* ---------- 1. Префикс пути (зависит от вложенности страницы) ---------- */
    function detectPrefix() {
        var p = (window.location.pathname || '').replace(/\\/g, '/');
        if (p.indexOf('/ref/')    !== -1) return '../';
        if (p.indexOf('/guides/') !== -1) return '../';
        if (p.indexOf('/tools/')  !== -1) return '../';
        return '';
    }

    var PREFIX = detectPrefix();
    window.HELP_PREFIX = PREFIX;
    window.HELP_BASE   = PREFIX;   /* используется бейджами типов из help.js */


    /* ---------- 2. Карта для авто-линкификации (используется help.js) ----------
       Ключ (lowercase) → { file, anchor }.
       file — имя файла БЕЗ префикса (префикс добавляет help.js).
       anchor — оригинальный якорь из справки, сохранён 1:1.
       ---------------------------------------------------------------------------- */
    window.HELP_REF_MAP = {
        'achievements.ini':                  { file: 'achievements.html',     anchor: 'Achievements' },
        'advisors.ini':                      { file: 'advisors.html',         anchor: 'Advisors' },
        'buildings':                         { file: 'buildings.html',        anchor: 'Buildings' },
        'goods':                             { file: 'goods.html',            anchor: 'Goods' },
        'groups':                            { file: 'groups.html',           anchor: 'Groups' },
        'ideologies':                        { file: 'ideologies.html',       anchor: 'ideologies' },
        'ideologies.ini':                    { file: 'ideologies.html',       anchor: 'ideologies' },
        'leaders':                           { file: 'leaders.html',          anchor: 'leaders' },
        'randomevents':                      { file: 'random-events.html',    anchor: 'RandomEvents' },
        'receipts':                          { file: 'receipts.html',         anchor: 'Receipts' },
        'specialevents':                     { file: 'special-events.html',   anchor: 'SpecialEvents' },
        'events_story.ini':                  { file: 'events-story.html',     anchor: 'Events_Story' },
        'typelands':                         { file: 'typelands.html',        anchor: 'TypeLands' },
        'backgroundobjects':                 { file: 'background-objects.html', anchor: 'BackgroundObjects' },
        'backgroundobjects.ini':             { file: 'background-objects.html', anchor: 'BackgroundObjects' },
        'upgrades':                          { file: 'upgrades.html',         anchor: 'upgrades' },
        'upgrades.ini':                      { file: 'upgrades.html',         anchor: 'upgrades' },
        'difficulty.ini':                    { file: 'difficulty.html',       anchor: 'Difficulty' },
        'rules.ini':                         { file: 'rules.html',            anchor: 'Rules' },
        'ai.ini':                            { file: 'ai.html',               anchor: 'AI' },
        'interface.ini':                     { file: 'interface.html',        anchor: 'interface' },
        'main.ini':                          { file: 'main.html',             anchor: 'Main' },
        '[mainzonefraction]':                { file: 'main.html',             anchor: 'Main' },
        'messages.csv':                      { file: 'messages.html',         anchor: 'Messages' },
        'settings.ini':                      { file: 'settings.html',         anchor: 'Settings' },
        'tradergoods.ini':                   { file: 'tradergoods.html',      anchor: 'TraderGoods' },
        'traders.ini':                       { file: 'traders.html',          anchor: 'Traders' },
        'tutorial.ini':                      { file: 'tutorial.html',         anchor: 'Tutorial' },
        'links.ini':                         { file: 'map.html',              anchor: 'mapLinks' },
        'territories.ini':                   { file: 'map.html',              anchor: 'mapTerritories' },
        'locations':                         { file: 'map.html',              anchor: 'mapLocations' },
        'territories_icon_coordinates.ini':  { file: 'map.html',              anchor: 'mapTerritories_Icon_Coordinates' },
        'territoriesinfo.ini':               { file: 'map.html',              anchor: 'mapTerritoriesInfo' },
        'map.bt':                            { file: 'map.html',              anchor: 'mapBT' }
    };


    /* ---------- 3. Данные меню ---------- */
    var NAV = [
        {
            label: 'Для новичков',
            items: [
                { icon: '📖', title: 'Назначение файла',   path: 'ref/start.html', anchor: 'filemission' },
				{ icon: '🚀', title: 'С чего начать?',     path: 'ref/start.html', anchor: 'newbegining' },
				{ icon: '🛠', title: 'Программы',          path: 'ref/start.html', anchor: 'programs' },
				{ icon: '📝', title: 'Кодировка файлов',   path: 'ref/start.html', anchor: 'filestypecode' },
                { icon: '❓', title: 'FAQ (34 вопроса)',   path: 'ref/faq.html',   anchor: 'faq' },
                { icon: '💡', title: 'Советы по моддингу', path: 'ref/tips.html',  anchor: 'helps' },
                { icon: '📁', title: 'Структура сценария', path: 'ref/tips.html',  anchor: 'scenario_structure' }
            ]
        },
        {
			label: 'Гайды',
			items: [
				{ icon: '🎓', title: 'Все гайды',              path: 'guides/index.html' },
				{ icon: '📁', title: 'Создание папки мода',    path: 'guides/copyfiles.html' },
				{ icon: '🏗', title: 'Новая постройка',         path: 'guides/building.html' },
				{ icon: '⬆',  title: 'Новое улучшение',        path: 'guides/upgrade.html' },
				{ icon: '👥', title: 'Новый заместитель',       path: 'guides/advisor.html' },
				{ icon: '👑', title: 'Новый лидер',             path: 'guides/leader.html' },
				{ icon: '🎲', title: 'Случайное событие',       path: 'guides/random-event.html' },
				{ icon: '📖', title: 'Сюжетное событие',        path: 'guides/story-event.html' },
				{ icon: '🏛', title: 'Новая идеология',         path: 'guides/ideology.html' },
				{ icon: '🚩', title: 'Новая группировка',       path: 'guides/faction.html' },
				{ icon: '✅', title: 'Чек-лист релиза',         path: 'guides/checklist.html' }
			]
		},
        {
            label: 'Файлы настроек',
            items: [
                { icon: '🏆', title: 'Achievements.ini',      path: 'ref/achievements.html',     anchor: 'Achievements' },
                { icon: '👥', title: 'Advisors.ini',          path: 'ref/advisors.html',         anchor: 'Advisors' },
                { icon: '🏗', title: 'Buildings',             path: 'ref/buildings.html',        anchor: 'Buildings' },
                { icon: '📦', title: 'Goods (Амуниция)',      path: 'ref/goods.html',            anchor: 'Goods' },
                { icon: '⚔',  title: 'Groups (Группировки)',  path: 'ref/groups.html',           anchor: 'Groups' },
                { icon: '🏛', title: 'Ideologies',            path: 'ref/ideologies.html',       anchor: 'ideologies' },
                { icon: '👑', title: 'Leaders',               path: 'ref/leaders.html',          anchor: 'leaders' },
                { icon: '🎲', title: 'RandomEvents',          path: 'ref/random-events.html',    anchor: 'RandomEvents' },
                { icon: '🔧', title: 'Receipts (Рецепты)',    path: 'ref/receipts.html',         anchor: 'Receipts' },
                { icon: '⚡', title: 'SpecialEvents',         path: 'ref/special-events.html',   anchor: 'SpecialEvents' },
                { icon: '🗺', title: 'TypeLands',             path: 'ref/typelands.html',        anchor: 'TypeLands' },
                { icon: '🖼', title: 'BackgroundObjects',     path: 'ref/background-objects.html', anchor: 'BackgroundObjects' },
                { icon: '⬆',  title: 'Upgrades',              path: 'ref/upgrades.html',         anchor: 'upgrades' },
                { icon: '🎯', title: 'Difficulty.ini',        path: 'ref/difficulty.html',       anchor: 'Difficulty' },
                { icon: '📜', title: 'Rules.ini',             path: 'ref/rules.html',            anchor: 'Rules' },
                { icon: '🤖', title: 'AI.ini',                path: 'ref/ai.html',               anchor: 'AI' },
                { icon: '📖', title: 'Events_Story.ini',      path: 'ref/events-story.html',     anchor: 'Events_Story' },
                { icon: '🎨', title: 'interface.ini',         path: 'ref/interface.html',        anchor: 'interface' },
                { icon: '⚙',  title: 'Main.ini',              path: 'ref/main.html',             anchor: 'Main' },
                { icon: '🌐', title: 'messages.csv',          path: 'ref/messages.html',         anchor: 'Messages' },
                { icon: '🔧', title: 'Settings.ini',          path: 'ref/settings.html',         anchor: 'Settings' },
                { icon: '🛒', title: 'TraderGoods.ini',       path: 'ref/tradergoods.html',      anchor: 'TraderGoods' },
                { icon: '💰', title: 'Traders.ini',           path: 'ref/traders.html',          anchor: 'Traders' },
                { icon: '📚', title: 'Tutorial.ini',          path: 'ref/tutorial.html',         anchor: 'Tutorial' }
            ]
        },
        {
            label: 'Файлы карты',
            items: [
                { icon: '⚙',  title: 'settings.ini',                     path: 'ref/map.html', anchor: 'mapSettings' },
				{ icon: '🔗', title: 'Links.ini',                        path: 'ref/map.html', anchor: 'mapLinks' },
                { icon: '📍', title: 'Territories.ini',                  path: 'ref/map.html', anchor: 'mapTerritories' },
                { icon: '🗺', title: 'Locations',                        path: 'ref/map.html', anchor: 'mapLocations' },
                { icon: '📐', title: 'Territories_Icon_Coordinates.ini', path: 'ref/map.html', anchor: 'mapTerritories_Icon_Coordinates' },
                { icon: 'ℹ',  title: 'TerritoriesInfo.ini',              path: 'ref/map.html', anchor: 'mapTerritoriesInfo' },
                { icon: '🔧', title: 'map.bt',                           path: 'ref/map.html', anchor: 'mapBT' },
                { icon: '🖼', title: 'Изображение карты',                path: 'ref/map.html', anchor: 'mapImage' }
            ]
        },
		{
			label: 'Справка',
			items: [
				{ icon: '🏷', title: 'Обозначения типов',        path: 'ref/value-types.html', anchor: 'valuetypes' },
				{ icon: '📊', title: 'Матрица бонусов',          path: 'ref/matrix-bonus.html' },
				{ icon: '📏', title: 'Лимиты движка',            path: 'ref/limits.html' },
				{ icon: '🚫', title: 'Рудименты и «не трогать»', path: 'ref/dont-touch.html' }
			]
		}
    ];

    window.HELP_NAV = NAV;


    /* ---------- 4. Карта «старый якорь → новый путь» (для редиректа) ---------- */
    var ANCHOR_MAP = {};
    NAV.forEach(function (g) {
        g.items.forEach(function (it) {
            if (it.anchor) ANCHOR_MAP[it.anchor] = it.path + '#' + it.anchor;
        });
    });
    window.HELP_ANCHOR_MAP = ANCHOR_MAP;


    /* ---------- 5. Обвязка: кнопка темы + шапка сайдбара ---------- */
    function renderThemeToggle() {
        if (document.getElementById('themeToggle')) return;
        var b = document.createElement('button');
        b.className = 'theme-toggle';
        b.id = 'themeToggle';
        b.title = 'Сменить тему';
        b.textContent = '🌙';
        document.body.insertBefore(b, document.body.firstChild);
    }

    function renderSidebarShell() {
        var host = document.getElementById('sidebar');
        if (!host) return;
        host.innerHTML =
            '<div class="sidebar-header">' +
                '<div class="sidebar-title">📚 Справка мододела</div>' +
                '<div class="search-box">' +
                    '<span class="search-icon">🔍</span>' +
                    '<input type="text" class="search-input" id="searchInput" ' +
                           'placeholder="Поиск по разделам…" autocomplete="off">' +
                    '<button class="search-clear" id="searchClear" title="Очистить (Esc)">×</button>' +
                '</div>' +
                '<div class="search-status" id="searchStatus"></div>' +
            '</div>' +
            '<div class="sidebar-scroll" id="sidebarNav">' +
                '<div class="search-no-result" id="searchNoResult">😕 Ничего не найдено</div>' +
            '</div>';
    }


    /* ---------- 6. Рендер меню ---------- */
    function makeHref(item) {
        return PREFIX + item.path + (item.anchor ? '#' + item.anchor : '');
    }

    function buildLink(href, text) {
        var a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        return a;
    }

    function render() {
        var host = document.getElementById('sidebarNav');
        if (!host) return;

        var frag = document.createDocumentFragment();

        /* — «Главная» отдельным списком сверху — */
        var homeUl = document.createElement('ul');
        var homeLi = document.createElement('li');
        homeLi.appendChild(buildLink(PREFIX + 'index.html', '🏠 Главная'));
        homeUl.appendChild(homeLi);
        frag.appendChild(homeUl);

        /* — группы меню — */
        NAV.forEach(function (group) {
            var label = document.createElement('div');
            label.className = 'sidebar-section-label';
            label.textContent = group.label;
            frag.appendChild(label);

            var ul = document.createElement('ul');
            group.items.forEach(function (item) {
                var li = document.createElement('li');
                var a  = buildLink(makeHref(item), item.icon + ' ' + item.title);
                a.title = item.title;
                li.appendChild(a);
                ul.appendChild(li);
            });
            frag.appendChild(ul);
        });

        /* «Ничего не найдено» должен остаться последним */
        var noResult = document.getElementById('searchNoResult');
        if (noResult) host.insertBefore(frag, noResult);
        else          host.appendChild(frag);
    }


    /* ---------- Запуск ---------- */
    renderThemeToggle();
    renderSidebarShell();
    render();
})();