var RebixEmojiImpl = RebixEmojiImpl || {};

(function (rootObject) {

    var EMOJI_PLOCEHOLDER_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';


    function _convertUnicodeToChar(unicode) {
        var s, lo, hi;
        if (unicode.indexOf("-") > -1) {
            var parts = [];
            s = unicode.split('-');
            for (var i = 0; i < s.length; i++) {
                var part = parseInt(s[i], 16);
                if (part >= 0x10000 && part <= 0x10FFFF) {
                    hi = Math.floor((part - 0x10000) / 0x400) + 0xD800;
                    lo = ((part - 0x10000) % 0x400) + 0xDC00;
                    part = (String.fromCharCode(hi) + String.fromCharCode(lo));
                }
                else {
                    part = String.fromCharCode(part);
                }
                parts.push(part);
            }
            //return parts.join("\u200D");
            return parts.join('');
        }
        else {
            s = parseInt(unicode, 16);
            if (s >= 0x10000 && s <= 0x10FFFF) {
                hi = Math.floor((s - 0x10000) / 0x400) + 0xD800;
                lo = ((s - 0x10000) % 0x400) + 0xDC00;
                return (String.fromCharCode(hi) + String.fromCharCode(lo));
            }
            else {
                return String.fromCharCode(s);
            }
        }
    }


    var jsEmojiFix = {
        '2614': 'umbrella_with_rain_drops'
    };

    /**
     * 转换单个emojiChar到shortCode
     * @param emojiChar
     */
    function convertEmojiCharToShortCode(emojiChar) {
        if (jsEmojiFix[emojiChar]) {
            return jsEmojiFix[emojiChar];
        }

        var emojiPosAndUCD = rootObject.PosAndUCD;

        var emojiDataSource = rootObject.dataSource;

        var dd = emojiDataSource[emojiChar] || {};

        var shortCodeArr = dd[3] || [];

        for (var i = 0; i < shortCodeArr.length; i++) {
            var shortCode = shortCodeArr[i];
            if (emojiPosAndUCD[shortCode]) {
                return shortCode;
            }
        }

        return "";
    }


    var REPLACE_EMOJI_CHAR_REGEXP = null;
    var REPLACE_EMOJI_CHAR_TO_SHORT_CODE = {};

    function buildReplaceEmojiCharRegExpAndUnifiedMap() {
        if (REPLACE_EMOJI_CHAR_REGEXP) {
            return REPLACE_EMOJI_CHAR_REGEXP;
        }

        var emojiDataSource = rootObject.dataSource;

        var unicodeArray = [];
        for (var i in emojiDataSource) {

            if (emojiDataSource.hasOwnProperty(i)) {

                var itemUnicodeArray = emojiDataSource[i][0];
                for (var j = 0; j < itemUnicodeArray.length; j++) {
                    unicodeArray.push(itemUnicodeArray[j].replace('*', '\\*'));
                    REPLACE_EMOJI_CHAR_TO_SHORT_CODE[itemUnicodeArray[j]] = i;
                }

            }
        }

        unicodeArray = unicodeArray.sort(function (a, b) {
            return b.length - a.length;
        });

        REPLACE_EMOJI_CHAR_REGEXP = new RegExp('(' + unicodeArray.join('|') + ')(\uD83C[\uDFFB-\uDFFF])?', "g");
        return REPLACE_EMOJI_CHAR_REGEXP;
    }


    /**
     * 转换一个字符串
     * 形如 hello ^ world ===> hello :smile: world
     * @param str
     * @returns {*}
     */
    function replaceEmojiCharToShortCode(str) {

        if (!str) {
            return str;
        }

        //对于形如 hello :smile: world中的文本的处理,替换成转义字符,避免显示成表情
        str = str.replace(/:/gm, '&#58;');

        buildReplaceEmojiCharRegExpAndUnifiedMap();
        return str.replace(REPLACE_EMOJI_CHAR_REGEXP, function (m, p1, p2) {
            var val = REPLACE_EMOJI_CHAR_TO_SHORT_CODE[p1];
            if (!val) return m;
            return ':' + convertEmojiCharToShortCode(val) + ':';
        });

    }


    /**
     * 转换单个 shortCode 到 emoji字符
     * 形如:  smile ===> ^
     * @param shortCode 例如: emoji
     * @returns
     */
    function convertShortCodeToEmojiChar(shortCode) {
        var emojiPosAndUCD = rootObject.PosAndUCD;
        var mm = emojiPosAndUCD[shortCode] || {};
        var unicode = mm['ucd'];
        if (unicode) {
            return _convertUnicodeToChar(unicode);
        }
        return '';
    }


    function getEmojiSpritePosition(shortCode) {
        //see "rollup-core_required_ts.js of slack";
        var emojiPosAndUCD = rootObject.PosAndUCD;
        var mul = 100 / 40;
        var mm = emojiPosAndUCD[shortCode] || {};
        var pos = mm.pos;
        var pX = null;
        var pY = null;
        if (pos) {
            pX = mul * pos[0];
            pY = mul * pos[1];
        }
        return {pX: pX, pY: pY};
    }


    /**
     * 转换单个字符.
     * 形如: smile ===> <div ...></div>
     * @param shortCode 不带冒号
     * @param className
     * @param isImg
     * @returns {*}
     */
    function convertShortCodeToEmojiHTML(shortCode, className, isImg) {
        var pos = getEmojiSpritePosition(shortCode);
        if (!pos) {
            return null;
        }
        var style = "background-position:" + pos.pX + "%  " + pos.pY + "%";
        if (isImg === true) {
            var src = EMOJI_PLOCEHOLDER_IMG;
            return "<img src='" + src + "' data-name='" + shortCode + "' class='rebix-emoji " + className + "' style='" + style + "' />";
        } else {
            return "<div data-name='" + shortCode + "' class='rebix-emoji " + className + "' style='" + style + "' ></div>";
        }
    }

    /**
     * 将含有类似 hello :smile: world 的字符串替换成 hello <div class="emoji"> world
     */
    function replaceShortCodeToEmojiHTML(textDecrypted, className) {
        className = className || '';
        return textDecrypted.replace(/:[+\-_0-9a-zA-Z]+:/gm, function (e0) {
            var e = e0.replace(/:/g, '');
            var t = convertShortCodeToEmojiHTML(e, className);
            return t || e0;
        });
    }


    rootObject.convertEmojiCharToShortCode = convertEmojiCharToShortCode;  //转换单个    ^ ===> smile
    rootObject.convertShortCodeToEmojiChar = convertShortCodeToEmojiChar;  //转换单个    smile ===> ^
    rootObject.convertShortCodeToEmojiHTML = convertShortCodeToEmojiHTML;  //转换单个    smile ===> <img class='rebix-emoji'/>
    rootObject.replaceEmojiCharToShortCode = replaceEmojiCharToShortCode;  //转换字符串  hello ^ world ===> hello :smile: world
    rootObject.replaceShortCodeToEmojiHTML = replaceShortCodeToEmojiHTML;  //转换字符串  hello :smile: world ===> hello <div class="rebix-emoji"></div> world


})(RebixEmojiImpl);
