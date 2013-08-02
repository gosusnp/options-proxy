'use strict';

/*
 * Parse ngOptions string
 */
var ngOptionsParser = function(ngOptionString) {
    var attributeName,
        optionList,
        newNgOptionString;
    var labelForValueInArray = /^((\w+\.)+(\w+))\s+for\s.*\sin\s(\w+)$/,
        match;

    match = labelForValueInArray.exec(ngOptionString);
    if (match) {
        attributeName = match[3];
        optionList = match[4];
        newNgOptionString = match[1]+' as '+ngOptionString;
    }

    return {
        attributeName: attributeName,
        optionList: optionList,
        ngOptionString: newNgOptionString,
    };
}

/*
 * The directive
 */
angular.module('options-proxy', []).directive('optionsProxy', function() {
    return {
        compile: function(tElement, tAttrs) {
            // Process attributes
            var modelVarName = tAttrs.ngModel,
                modelProxyVarName = modelVarName + 'Proxy',
                ngOptionString = tAttrs.ngOptions,
                attributeName,
                optionList;

            // Parse ngOptions
            var parsedOptions = ngOptionsParser(ngOptionString);
            attributeName = parsedOptions.attributeName;
            optionList = parsedOptions.optionList;
            tAttrs.$set('ngOptions', parsedOptions.ngOptionString);
            tAttrs.$set('ngModel', modelProxyVarName);

            return {
                pre: function(scope) {
                    // Initializing scope variables
                    scope.modelVarName = modelVarName;
                    scope.modelProxyVarName = modelProxyVarName;
                    scope.attributeName = attributeName;
                    scope.optionList = optionList;

                    // Data binding for proxy
                    // Bind on modelVarName to track direct modifications of variable
                    scope.$watch(scope.modelVarName, function(newValue, oldValue) {
                        if (newValue)
                            scope[scope.modelProxyVarName] = newValue[scope.attributeName];
                    });
                    // Bind on modelProxyVarName to forward of the proxy variable
                    scope.$watch(scope.modelProxyVarName, function(newValue, oldValue) {
                        var optionList = scope[scope.optionList];
                        for (var i in optionList) {
                            var option = optionList[i];
                            if (newValue == option[scope.attributeName]) {
                                if (scope[scope.modelVarName][scope.attributeName] != option[scope.attributeName]) {
                                    scope[scope.modelVarName] = angular.copy(option);
                                }
                                break;
                            }
                        }
                    });
                }
            }
        }
    }
});
