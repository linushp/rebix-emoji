var RebixEmojiImpl = RebixEmojiImpl || {};

(function (root, factory) {

    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        exports["RebixEmoji"] = factory();
    else {
        root["RebixEmoji"] = factory();
    }

})(this, function () {
    return RebixEmojiImpl;
});