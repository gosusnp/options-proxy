options-proxy
=============

A directive to ease the use of ng-options with objects.

The problem
-----------

When using ng-options with objects, the directive is using reference comparison
to find the selected option through the list. Given that, if we are in a
application that is getting the list of options and the selected option through
outside resources, it does not perform as one would hope.

A workaround for that would be to use a field such as an id and then reselect
the data. In some applications, it might feel a bit cumbersome. Hence this
directive.


How-to
------

<body ng-app="Demo">
    <div ng-controller="DemoCtrl">
        <select options-proxy ng-model="selectedValue" ng-options="opt.name for opt in options"></select>
        <p ng-bind="selectedValue|json"></p>
    </div>
    <script type="text/javascript">
    app = angular.module('Demo', ['options-proxy']);
    app.controller('DemoCtrl', function($scope) {
        $scope.options = [{name: 'option1'}, {name: 'option2'}];
        $scope.selectedValue = {name: 'option2', extra: 'extra data'};
    });
    </script>
</body>
