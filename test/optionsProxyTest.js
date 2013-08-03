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
});
