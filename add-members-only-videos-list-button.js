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
            const anchorElement = document.querySelector("tp-yt-paper-tab:nth-last-of-type(2)");

            if (anchorElement === null) return;
            if (document.querySelector(`[${anchorAttribute}]`) !== null) return;

            let displayText = displayTextMap[document.documentElement.lang] || displayTextMap.en;
            const newNode = document.createRange().createContextualFragment(`
                <tp-yt-paper-tab class="style-scope ytd-c4-tabbed-header-renderer" role="tab" aria-disabled="false" aria-selected="true" tabindex="0" ${anchorAttribute}><!--css-build:shady-->
                    <div class="tab-content style-scope tp-yt-paper-tab">${displayText}</div>
	                <paper-ripple class="style-scope tp-yt-paper-tab"><!--css-build:shady-->
                        <div id="background" class="style-scope paper-ripple" style="opacity: 0.0084;"></div>
		                <div id="waves" class="style-scope paper-ripple"></div>
                    </paper-ripple>
                </tp-yt-paper-tab>
            `);
            anchorElement.parentNode.insertBefore(newNode, anchorElement);
            const target = document.querySelector("tp-yt-paper-tab:nth-last-of-type(3)");

            target.addEventListener('click', function() {
                const chId = document.querySelector("ytd-c4-tabbed-header-renderer").__data.data.channelId;
                const targetURL = `${location.protocol}//${location.host}/playlist?list=${chId.replace(/^UC/, 'UUMO')}`;
                window.open(targetURL);
            });
        }

        if (window.MutationObserver) {
            let observer = new MutationObserver(function(mutations) {
                mutations.forEach(mutation => {
                    if (mutation.type == 'childList') {
                        const target = mutation.target

                        if (/ytd\-page\-manager/i.test(target.tagName) || target.id === 'tabsContent') {
                           addLink()
                        }
                    }
                });
            });
            observer.observe(document.querySelector('body'), { "childList": true, "subtree": true });
        }
    };
})();
