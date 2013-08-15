describe("options-proxy", function() {
    var $compile;
    var $rootScope;

    // Load the myApp module, which contains the directive
    beforeEach(module('options-proxy'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it("should select option2", function() {
        // Compile a piece of HTML containing the directive
        var element = angular.element('<select options-proxy ng-model="selectedVar" ng-options="obj.name for obj in objects"></select>');
        $rootScope.objects = [{name: 'option1'}, {name: 'option2'}];
        $rootScope.selectedVar = {name: 'option2'};
        $compile(element)($rootScope);
        $rootScope.$digest();

        expect($rootScope.selectedVarProxy).toEqual('option2');

        // Simulate selection of option1
        $rootScope.selectedVarProxy = 'option1';
        $rootScope.$apply();
        expect($rootScope.selectedVar).toEqual({name: 'option1'});

        // Update selectedVar
        $rootScope.selectedVar = {name: 'option2'};
        $rootScope.$apply();
        expect($rootScope.selectedVarProxy).toEqual('option2');
    });

    it("should select option2 even though we are manipulating complex objects", function() {
        // Compile a piece of HTML containing the directive
        var element = angular.element('<select options-proxy ng-model="selectedVar.selected" ng-options="obj.name for obj in objects"></select>');
        $rootScope.objects = [{name: 'option1'}, {name: 'option2'}];
        $rootScope.selectedVar = {selected: {name: 'option2'}};
        $compile(element)($rootScope);
        $rootScope.$digest();

        expect($rootScope.selectedVar_selectedProxy).toEqual('option2');

        // Simulate selection of option1
        $rootScope.selectedVar_selectedProxy = 'option1';
        $rootScope.$apply();
        expect($rootScope.selectedVar.selected).toEqual({name: 'option1'});

        // Update selectedVar
        $rootScope.selectedVar.selected = {name: 'option2'};
        $rootScope.$apply();
        expect($rootScope.selectedVar_selectedProxy).toEqual('option2');
    });

    it("ensures optionsProxy works more than once within the same template", function() {
        var element = angular.element(
            '<select options-proxy ng-model="var1" ng-options="obj.name for obj in objects"></select>'+
            '<select options-proxy ng-model="var2" ng-options="obj.name for obj in objects"></select>'
        );
        $rootScope.objects = [{name: 'option1'}, {name: 'option2'}];
        $rootScope.var1 = {name: 'option1'};
        $rootScope.var2 = {name: 'option2'};
        $compile(element)($rootScope);
        $rootScope.$apply();
        expect($rootScope.var1Proxy).toEqual('option1');
        expect($rootScope.var2Proxy).toEqual('option2');

        $rootScope.var1Proxy = 'option2';
        $rootScope.$apply();
        expect($rootScope.var1Proxy).toEqual('option2');
        expect($rootScope.var2Proxy).toEqual('option2');

        $rootScope.var2Proxy = 'option1';
        $rootScope.$apply();
        expect($rootScope.var1Proxy).toEqual('option2');
        expect($rootScope.var2Proxy).toEqual('option1');
    });

    it("should copy as much of the object as defined", function() {
        var element = angular.element('<select options-proxy ng-model="selected" ng-options="obj.name for obj in objects"></select>');
        $rootScope.objects = [{name: 'o1', value: 'v1'}, {name: 'o2', value: 'v2'}];

        $compile(element)($rootScope);
        $rootScope.$digest();

        $rootScope.selectedProxy = 'o1';
        $rootScope.$apply();
        expect($rootScope.selected.name).toEqual('o1');
        expect($rootScope.selected).toEqual({name: 'o1', value: 'v1'});

        $rootScope.selectedProxy = 'o2';
        $rootScope.$apply();
        expect($rootScope.selected.name).toEqual('o2');
        expect($rootScope.selected).toEqual({name: 'o2', value: 'v2'});
    });
});
