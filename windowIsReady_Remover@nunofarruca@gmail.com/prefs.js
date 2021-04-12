'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {
}

function buildPrefsWidget() {

    let gschema = Gio.SettingsSchemaSource.new_from_directory(
        Me.dir.get_child('schemas').get_path(),
        Gio.SettingsSchemaSource.get_default(),
        false
    );

    this.settings = new Gio.Settings({
        settings_schema: gschema.lookup('org.gnome.shell.extensions.windowIsReady_Remover', true)
    });

    let prefsWidget = new Gtk.Grid({
        column_spacing: 12,
        row_spacing: 12,
        visible: true
    });

    let title = new Gtk.Label({
        label: '<b>' + Me.metadata.name + ' Preferences</b>',
        halign: Gtk.Align.START,
        use_markup: true,
        visible: true
    });
    prefsWidget.attach(title, 0, 0, 2, 1);

    let toggleLabel = new Gtk.Label({
        label: 'Prevent system disable:',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(toggleLabel, 0, 1, 1, 1);

    let toggleDescription = new Gtk.Label({
        label: 'If set, it will prevent extension from being disabled by lockscreen.\n' +
            'Gnome-Shell restart required for \'Window is Ready\' notification to appear again.',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(toggleDescription, 0, 2, 1, 3);

    let toggle = new Gtk.Switch({
        active: this.settings.get_boolean('prevent-disable'),
        halign: Gtk.Align.END,
        visible: true
    });
    prefsWidget.attach(toggle, 1, 1, 1, 1);

    this.settings.bind(
        'prevent-disable',
        toggle,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    return prefsWidget;
}
