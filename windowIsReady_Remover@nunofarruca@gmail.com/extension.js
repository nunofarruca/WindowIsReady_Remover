const Main = imports.ui.main;
const WindowAttentionHandler = imports.ui.windowAttentionHandler;
const Shell = imports.gi.Shell;
const Lang = imports.lang;

function WindowIsReadyRemover() {
    this._init();
}

WindowIsReadyRemover.prototype = {
    _init : function() {
        this._tracker = Shell.WindowTracker.get_default();
        log('Disabling Window Is Ready Notification');
        global.display.disconnect(Main.windowAttentionHandler._windowDemandsAttentionId);
        global.display.disconnect(Main.windowAttentionHandler._windowMarkedUrgentId);
    },

    destroy: function () {
        global.display.disconnect(this._handlerid);
    }
}

let windowIsReadyRemover;

function init() {
}

function enable() {
    windowIsReadyRemover = new WindowIsReadyRemover();
}

function disable() {
    windowIsReadyRemover.destroy();
}
