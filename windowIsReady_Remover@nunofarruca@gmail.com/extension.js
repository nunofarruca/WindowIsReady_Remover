'use strict';

const Main = imports.ui.main;
const Handler = Main.windowAttentionHandler;
const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Config = imports.misc.config;
const [major, minor] = Config.PACKAGE_VERSION.split('.').map(s => Number(s));
const GObject = imports.gi.GObject;

function getSettings() {
    let GioSSS = Gio.SettingsSchemaSource;
    let schemaSource = GioSSS.new_from_directory(
        Me.dir.get_child("schemas").get_path(),
        GioSSS.get_default(),
        false
    );
    let schemaObj = schemaSource.lookup('org.gnome.shell.extensions.windowIsReady_Remover', true);
    if (!schemaObj) {
        throw new Error('cannot find schemas');
    }
    return new Gio.Settings({ settings_schema: schemaObj });
}

function init() {
}

function enable() {
    if (major >= 42) {
        this.blockSignal('window-demands-attention');
        this.blockSignal('window-marked-urgent');
    } else {
        this.disableSignalsPre42();
    }
}

function disable() {
    let settings = getSettings();
    let preventDisable = settings.get_boolean('prevent-disable');

    if (preventDisable) {
        log(Me.metadata.name + ' > disable was prevented, please check settings.');
    } else {
        if (major >= 42) {
            this.unblockSignal('window-demands-attention');
            this.unblockSignal('window-marked-urgent');
        } else {
            this.enableSignalsPre42();
        }            
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
