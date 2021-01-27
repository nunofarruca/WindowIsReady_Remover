const Main = imports.ui.main;
const Handler = Main.windowAttentionHandler;

function init() {
}

function enable() {
    if (Handler._windowDemandsAttentionId) {
        global.display.disconnect(Handler._windowDemandsAttentionId);
        Handler._windowDemandsAttentionId = null;
    }
    if (Handler._windowMarkedUrgentId) {
        global.display.disconnect(Handler._windowMarkedUrgentId);
        Handler._windowMarkedUrgentId = null;
    }
}

function disable() {
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
