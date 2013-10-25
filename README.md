Angular YUI Widget
==================

This yui module is a kind of bridge for YUI widgets, avoids create entire directives to make work yui widgets, it provides
a way bind widget attributtes to directive scope and viceversa


### Constructor

To get the directive ready to use based on the widget the class **Y.NGWidget** needs to be instantiated passing the required attributtes

###### Attributes Table


| Attribute Name    | Description       | Type  | Optional  |
| ------------- | ------------- | ----- | ----- |
| **directiveName**     | Directive name based on angular js specs | **String** | No |
| **bindedAttrs**      | List of widget attributes that are going to be bind to directive scope  | **Array**, with the list of attributes names | Yes |
| **widgetClass**       | YUI widget class that is going to be used for the directive | **Y.Widget** or **Y.Base** subclass  | No |
| **ngModule**         | Angular module  | **Object**, angular module previously configured  | No |
| **progressive**       | If directive is going to use progressive YUI widget instantiantion |  **Boolean**, by default is false | Yes |

### Example

The following example demostrates how to create 2 directives, using scrollview and slider ootb YUI widgets:


```html
<div ng-app="TestApp">
  	<div ng-controller="TestCtrl">
        <div style="width: 500px">
            <div ng-scrollview data-height="scrollViewHeight">
                <ul>
                    <li>AC/DC</li>
                    <li>Aerosmith</li>
                    <li>Bob Dylan</li>
                    <li>Bob Seger</li>
                    <li>AC/DC</li>
                    <li>Aerosmith</li>
                    <li>Bob Dylan</li>
                    <li>Bob Seger</li>
                    <li>AC/DC</li>
                    <li>Aerosmith</li>
                    <li>Bob Dylan</li>
                    <li>Bob Seger</li>
                    <li>AC/DC</li>
                    <li>Aerosmith</li>
                    <li>Bob Dylan</li>
                    <li>Bob Seger</li>
                </ul>
            </div>
        </div>
        
        
        <ng-slider data-value="position" data-max="10"></ng-slider>
        <input type="text" ng-model="position"/>
        <div>{{position}}</div>
    </div>
 
 
</div>

```


```javascript
YUI({
    modules: {
        /*deps*/
        'angular': {
            base: '/',
            path: 'tests/unit/js/angular.js',
            async: false,
            requires: []
        }
    }
    }).use('angular', 'scrollview', 'slider', 'gallery-ng-yui-widget', function(Y) {
          /* inits angular app */
          var testModule = angular.module('TestApp', []);
          testModule.controller('TestCtrl', function($scope) {
              $scope.scrollViewHeight = '166px';
              $scope.position = 0;
          });
          
          /* inits ng widget for slider widget */
          new Y.NGWidget({directiveName: 'ngSlider', bindedAttrs: ['value'],
              widgetClass: Y.Slider, ngModule: testModule});
          /* inits ng widget for scrollview widget */
          new Y.NGWidget({directiveName: 'ngScrollview', bindedAttrs: [],
              widgetClass: Y.ScrollView, ngModule: testModule, progressive: true});

});
```
