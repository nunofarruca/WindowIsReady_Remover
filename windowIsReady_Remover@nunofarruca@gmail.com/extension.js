'use strict';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GObject from 'gi://GObject';

export default class windowIsReadyRemover {
    enable() {
        this.blockSignal('window-demands-attention');
        this.blockSignal('window-marked-urgent');
    }

    disable() {
        this.unblockSignal('window-demands-attention');
        this.unblockSignal('window-marked-urgent');
    }

    getSignalHandlerId(signalId) {
        return GObject.signal_handler_find(global.display, { signalId });
    }

    blockSignal(signalId) {
        const signalHandlerId = this.getSignalHandlerId(signalId);
        GObject.signal_handler_block(global.display, signalHandlerId);
    }

    unblockSignal(signalId){
        const signalHandlerId = this.getSignalHandlerId(signalId);
        GObject.signal_handler_unblock(global.display, signalHandlerId);
    }
}
