YUI.add('module-tests', function (Y) {
    var suite = new Y.Test.Suite('gallery-ng-yui-widget');

    suite.add(new Y.Test.Case({
        name: 'Automated Tests',
        'test instantiation': function () {
            
        }
    }));

    Y.Test.Runner.add(suite);


}, '', {
    requires: ['test']
});