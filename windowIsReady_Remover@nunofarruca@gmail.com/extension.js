'use strict';

const Main = imports.ui.main;
const Handler = Main.windowAttentionHandler;
const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();

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
    let settings = getSettings();
    let preventDisable = settings.get_boolean('prevent-disable');

    if (preventDisable) {
        //log(Me.metadata.name + ' > Disable was prevented');
    } else {
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
}
