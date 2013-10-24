YUI.add('gallery-ng-yui-widget', function (Y, NAME) {

Y.NGWidget = Y.Base.create('gallery-ng-yui-widget', Y.Base, [], {

    initializer: function () {
        this._createDirective();
    },

    _createDirective: function () {
        var widgetClass = this.get('widgetClass'),
            attrs = this._getWidgetAttribs(widgetClass),
            generatedScope = this._generateScope(attrs);
        this._callNgDirectiveCreation(attrs, generatedScope, widgetClass);
    },

    /**
     * Creates the angular directive properly with configured values
     *
     * @param Array List of widget attributes processed
     * @param Object Generated scope to be passed to angular directive creation
     * @param BuiltClass Widget class
     *
     */
    _callNgDirectiveCreation: function (attrs, generatedScope, WidgetClass) {
        var me = this,
            initialized = false;
        this.get('ngModule').directive(this.get('directiveName'), function () {
            return {
                restrict: 'EA',
                transclude: false,
                scope: generatedScope,
                link: function (scope, element) {
                    if (!initialized) {
                        var node = Y.one(element[0]),
                            initAttributtes = me._generateDefaultValues(attrs, scope),
                            widget = null;
                        if (me.get('progressive')) {
                            initAttributtes.srcNode = node;
                            widget = new WidgetClass(initAttributtes);
                            if (typeof widget.render == 'function') {
                                widget.render();
                            }
                        } else {
                            widget = new WidgetClass(initAttributtes).render(node);
                        }
                        me._listenScope(scope, widget, attrs);
                        me._listenWidget(scope, widget);
                    };
                    initialized = true;
                },
                replace: false
            };
        });

    },

    /**
     * Listens scope attributtes changes and then updates the widget scope attributtes
     *
     * @param Object Directive scope
     * @param Array List of widget attributes processed
     * @param Object Widget instance
     *
     */
    _listenScope: function (scope, widgetInstance, attrs) {
        for (var i = 0; i < attrs.length; i++) {
            (function (attributteName) {
                scope.$watch(attributteName, function (value) {
                    if (typeof value != 'undefined') {
                        widgetInstance.set(attributteName, value);
                    }
                });
            })(attrs[i].name);
        }
    },


    /**
     * Listens widget attributtes change events and then updates the directive scope attributte
     *
     * @param Object Directive scope
     * @param Array List of widget attributes processed
     * @param Object Widget instance
     *
     */
    _listenWidget: function (scope, widgetInstance) {
        var attrs = this.get('bindedAttrs');
        for (var i = 0; i < attrs.length; i++) {
            (function (attributteName) {
                var attrEvent = attributteName + 'Change';
                widgetInstance.after(attrEvent, function (e) {
                    if (typeof e.newVal == 'number' && isNaN(e.newVal)) {
                        return;
                    }
                    setTimeout(function () {
                        scope.$apply(function () {
                            scope[attributteName] = e.newVal;
                        });
                    }, 0.5);
                });
            })(attrs[i]);
        }
    },

    /**
     * Merge directive attributtes values with widget default values to instantiate the widget
     *
     * @param Array List of widget attributes processed
     * @param Object Directive scope
     *
     * @return Object Widget constructor values
     *
     */
    _generateDefaultValues: function (widgetAttrs, scope) {
        var object = {};
        for (var i = 0; i < widgetAttrs.length; i++) {
            var attr = widgetAttrs[i];
            object[attr.name] = (typeof scope[attr.name] != 'undefined') ? scope[attr.name] : attr.value;
        }
        return object;
    },

    /**
     * Based on the widget attributtes the directive scope is going to be created
     *
     * @param Array List of widget attributes processed
     * @return Object Directive scope
     *
     */
    _generateScope: function (widgetAttrs) {
        var scope = {};
        for (var i = 0; i < widgetAttrs.length; i++) {
            var attr = widgetAttrs[i];
            scope[attr.name] = '=';
        }
        return scope;
    },

    /**
     * Retrieves list of widget class attributes and default values set
     *
     * @param BuiltClass widgetClass Class of the widget
     * @return Array List of widget attributes
     *
     */
    _getWidgetAttribs: function (widgetClass) {
        var instance = new widgetClass();
        var attrs = instance.getAttrs(),
            attrsList = [];
        attrs = this._cleanAttrs(attrs);
        for (var attrName in attrs) {
            if (attrs.hasOwnProperty(attrName)) {
                attrsList.push({
                    name: attrName,
                    value: attrs[attrName]
                });
            }
        };
        return attrsList;
    },

    _cleanAttrs: function (attrs) {
        var excluded = ['id', 'boundingBox', 'contentBox', 'srcNode', 'render', 'rendered', 'initialized', 'strings', 'focused', 'disabled'];
        for (var i = 0; i < excluded.length; i++) {
            delete attrs[excluded[i]];
        }
        return attrs;
    }

}, {
    ATTRS: {

        progressive: {
            value: false
        },

        directiveName: {
            value: ''
        },

        widgetClass: {
            value: null
        },

        ngModule: {
            value: null
        },

        bindedAttrs: {
            value: []
        }
    }
});

}, '@VERSION@', {"requires": ["yui-base", "base-build"]});
