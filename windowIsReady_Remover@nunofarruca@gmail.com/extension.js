'use strict';

const Main = imports.ui.main;
const Handler = Main.windowAttentionHandler;
const Config = imports.misc.config;
const [major, minor] = Config.PACKAGE_VERSION.split('.').map(s => Number(s));
const GObject = imports.gi.GObject;

function init() {
}

function enable() {
    if (major >= 42) {
        blockSignal('window-demands-attention');
        blockSignal('window-marked-urgent');
    } else {
        disableSignalsPre42();
    }
}

function disable() {
    if (Main.sessionMode.isLocked) {
        return
    }

    if (major >= 42) {
        unblockSignal('window-demands-attention');
        unblockSignal('window-marked-urgent');
    } else {
        enableSignalsPre42();
    }
}

function blockSignal(id) {
    let signalId = GObject.signal_handler_find(global.display, { signalId: id });
    GObject.signal_handler_block(global.display, signalId);
}

function unblockSignal(id){
    let signalId = GObject.signal_handler_find(global.display, { signalId: id });
    GObject.signal_handler_unblock(global.display, signalId);
}

function disableSignalsPre42() {
    if (Handler._windowDemandsAttentionId) {
        global.display.disconnect(Handler._windowDemandsAttentionId);
        Handler._windowDemandsAttentionId = null;
    }
    if (Handler._windowMarkedUrgentId) {
        global.display.disconnect(Handler._windowMarkedUrgentId);
        Handler._windowMarkedUrgentId = null;
    }
}

function enableSignalsPre42(){
    if (!Handler._windowDemandsAttentionId) {
        Handler._windowDemandsAttentionId = global.display.connect(
            'window-demands-attention',
            (display, window) => {
                Handler._onWindowDemandsAttention(display, window);
            }
        );
    }
    if (!Handler._windowMarkedUrgentId) {
        Handler._windowMarkedUrgentId = global.display.connect(
            'window-marked-urgent',
            (display, window) => {
                Handler._onWindowDemandsAttention(display, window);
            }
        );
    }
}
