define('views/edit',
    ['apps_widget', 'feed_previews', 'fields_transonic', 'format', 'forms_transonic', 'jquery', 'jquery.fakefilefield', 'l10n', 'log', 'notification', 'preview_tray', 'requests', 'templates', 'urls', 'utils', 'z'],
    function(apps_widget, feed_previews, fields_transonic, format, forms_transonic, $, fakefilefield, l10n, log, notification, preview_tray, requests, nunjucks, urls, utils, z) {
    'use strict';
    var gettext = l10n.gettext;

    function update($btn, $form, form_updater, success_msg) {
        form_updater($form, $form.data('slug')).done(function(feed_element) {
            notification.notification({message: success_msg});
            resetButton($btn);
        }).fail(function(error) {
            notification.notification({message: utils_local.build_error_msg(error)});
            resetButton($btn);
        });
    }

    z.body.on('click', '.transonic-form.edit button.submit', utils._pd(function(e) {
        var $this = $(this);
        var $form = $this.closest('form');
        $this.html(gettext('Updating...')).attr('disabled', true);
        $form.find('.form-errors').empty();

        if ($form.data('type') == 'apps') {
            update($this, $form, forms_transonic.feed_app,
                   gettext('Featured app successfully updated'));
        } else if ($form.data('type') == 'collections') {
            update($this, $form, forms_transonic.collection,
                   gettext('Collection successfully updated'));
        } else if ($form.data('type') == 'brands') {
            update($this, $form, forms_transonic.brand,
                   gettext('Editorial brand successfully updated'));
        } else if ($form.data('type') == 'shelves') {
            update($this, $form, forms_transonic.shelf,
                   gettext('Operator shelf successfully updated'));
        }
    }))
    .on('click', '.transonic-form.edit button.publish', utils._pd(function() {
        var $this = $(this);
        var $form = $this.closest('form');
        $this.html(gettext('Publishing...')).attr('disabled', true);

        forms_transonic.publish_shelf($form, $form.data('slug')).done(function() {
            notification.notification({message: gettext('Operator shelf published')});
            resetButton($this, gettext('Publish'));
        }).fail(function(error) {
            notification.notification({message: error});
            resetButton($this);
        });
    }));

    function resetButton($btn, text) {
        $btn.text(text || gettext('Update')).prop('disabled', false);
    }

    return function(builder, args) {
        var feedType = args[0];
        var slug = args[1];

        var title;
        var endpoint;
        if (feedType == 'apps') {
            title = format.format(gettext('Editing Featured App: {0}'), slug);
            endpoint = urls.api.base.url('feed-app', [slug]);
        } else if (feedType == 'collections') {
            title = format.format(gettext('Editing Collection: {0}'), slug);
            endpoint = urls.api.base.url('collection', [slug]);
        } else if (feedType == 'brands') {
            title = format.format(gettext('Editing Editorial Brand: {0}'), slug);
            endpoint = urls.api.base.url('feed-brand', [slug]);
        } else if (feedType == 'shelves') {
            title = format.format(gettext('Editing Operator Shelf: {0}'), slug);
            endpoint = urls.api.base.url('feed-shelf', [slug]);
        }

        builder.z('title', title);
        builder.z('type', 'manage');

        requests.get(endpoint).done(function(obj) {
            builder.start('create/' + feedType + '.html', {
                'feed_type': feedType,  // 'apps', 'collections', or 'editorial'.
                'obj': obj,
                'slug': slug,
                'title': title,
            }).done(function() {
                $('.fileinput').fakeFileField();
                fields_transonic.highlight_localized();

                if (feedType == 'apps') {
                    // App widget.
                    apps_widget.set(obj.app);

                    // Calculate which screenshot to initially select.
                    var preview_index = 0;
                    for (var i = 0; i < obj.app.previews.length; i++) {
                        if (obj.app.previews[i].id === obj.preview.id) {
                            preview_index = i;
                        }
                    }
                    $('.screenshots').html(nunjucks.env.render('preview_tray.html', {app: obj.app}));
                    preview_tray.populateTray.call($('.preview-tray')[0], preview_index);
                } else if (['collections', 'brands', 'shelves'].indexOf(feedType) !== -1) {
                    // App widget.
                    var group = obj.apps.length && obj.apps[0].group;
                    if (group) {
                        apps_widget.add_group(obj.apps[0].group);
                    }
                    for (var i = 0; i < obj.apps.length; i++) {
                        if (JSON.stringify(obj.apps[i].group) != JSON.stringify(group)) {
                            // If the current app's group is under a different group
                            // than the previous one, that must mean we need to
                            // render a new group.
                            apps_widget.add_group(obj.apps[i].group);
                            group = obj.apps[i].group;
                        }
                        apps_widget.append(obj.apps[i]);
                    }
                }
                feed_previews.refresh();
            });
        });
    };
});
