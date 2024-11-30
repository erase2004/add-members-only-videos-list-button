// ==UserScript==
// @version      1.0.5
// @author       TsukiAkiba
// @description   增加YouTube會限清單分頁連結到頻道主頁上
// @description:en  Add members-only-videos link to YouTube channel main page.
// @license      MIT License
// @name         增加會限清單分頁連結
// @name:en      Add members-only-videos link
// @match        https://www.youtube.com/*
// @namespace    https://github.com/erase2004/add-members-only-videos-list-button
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/423403/%E5%A2%9E%E5%8A%A0%E6%9C%83%E9%99%90%E6%B8%85%E5%96%AE%E5%88%86%E9%A0%81%E9%80%A3%E7%B5%90.user.js
// @updateURL https://update.greasyfork.org/scripts/423403/%E5%A2%9E%E5%8A%A0%E6%9C%83%E9%99%90%E6%B8%85%E5%96%AE%E5%88%86%E9%A0%81%E9%80%A3%E7%B5%90.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onload = function() {
        function addLink() {
            const displayTextMap = {
                'zh-Hant-TW': '會限清單',
                'zh-Hant-HK': '會限清單',
                'zh-Hans-CN': '会限清单',
                'ja-JP': 'メン限リスト',
                'en': 'Members-only-video List'
            };
            const anchorAttribute = 'data-anchor-attribute';
            const anchorElement = document.querySelector("yt-tab-shape:nth-last-of-type(2)");

            if (anchorElement === null) return;
            if (document.querySelector(`[${anchorAttribute}]`) !== null) return;

            let displayText = displayTextMap[document.documentElement.lang] || displayTextMap.en;
            const newNode = document.createRange().createContextualFragment(`
                <yt-tab-shape class="yt-tab-shape-wiz yt-tab-shape-wiz--host-clickable" role="tab" aria-selected="false" tabindex="0" tab-identifier="TAB_ID_SPONSORSHIP_PLAYLIST" tab-title="${displayText}" ${anchorAttribute}>
                    <div class="yt-tab-shape-wiz__tab">${displayText}</div>
                    <div class="yt-tab-shape-wiz__tab-bar">
                    </div>
                </yt-tab-shape>
            `);
            anchorElement.parentNode.insertBefore(newNode, anchorElement);
            const target = document.querySelector("yt-tab-shape:nth-last-of-type(3)");

            target.addEventListener('click', function() {
                const chId = document.querySelector('[itemprop="identifier"]').getAttribute("content");
                const targetURL = `${location.protocol}//${location.host}/playlist?list=${chId.replace(/^UC/, 'UUMO')}`;
                window.open(targetURL);
            });
        }

        if (window.MutationObserver) {
            let observer = new MutationObserver(function(mutations) {
                mutations.forEach(mutation => {
                    if (mutation.type == 'childList') {
                        if (mutation.target.classList.contains("yt-tab-group-shape-wiz__tabs")) {
                            addLink()
                        }
                    }
                });
            });
            observer.observe(document.querySelector('body'), { "childList": true, "subtree": true });
        }
    };
})();
