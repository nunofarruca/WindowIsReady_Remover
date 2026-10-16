import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

// Instead of blocking "the first handler found" for the signal (which could
// belong to a dock or another extension), disconnect exactly the handlers
// that GNOME Shell's WindowAttentionHandler connected, and reconnect them on disable.
export default class WindowIsReadyRemover extends Extension {
    enable() {
        const handler = Main.windowAttentionHandler;
        if (!handler)
            return;
        global.display.disconnectObject(handler);
    }

    disable() {
        const handler = Main.windowAttentionHandler;
        if (!handler)
            return;
        const cb = handler._onWindowDemandsAttention.bind(handler);
        global.display.connectObject(
            'window-demands-attention', cb,
            'window-marked-urgent', cb,
            handler);
    }
}
