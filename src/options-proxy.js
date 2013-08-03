'use strict';

/*
 * Parse ngOptions string
 */
var ngOptionsParser = function(ngOptionString) {
    var attributeName,
        values,
        newNgOptionString;
    var match,
        submatch;
    // NG_OPTIONS_REGEXP from the select directive implementation of angular.
    var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/,
        PIPE_REGEXP = /^\s*([^\s]+)\s*\|/,
        AS_REGEXP = /^\s*(.*)\s+as\s+(.*)$/;

    if (match = NG_OPTIONS_REGEXP.exec(ngOptionString)) {
        var valueName = match[4] || match[6],
            displayName = match[2] || match[1];
        attributeName = displayName.substring(valueName.length+1, displayName.length);
        values = match[7];
        if (submatch = PIPE_REGEXP.exec(values))
            values = submatch[1];
        if (submatch = AS_REGEXP.exec(ngOptionString))
            newNgOptionString = displayName+' as '+submatch[2];
        else
            newNgOptionString = displayName+' as '+ngOptionString;
    }

    return {
        attributeName: attributeName,
        values: values,
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
                values;

            // Parse ngOptions
            var parsedOptions = ngOptionsParser(ngOptionString);
            attributeName = parsedOptions.attributeName;
            values = parsedOptions.values;
            tAttrs.$set('ngOptions', parsedOptions.ngOptionString);
            tAttrs.$set('ngModel', modelProxyVarName);

            return {
                pre: function(scope) {
                    // Initializing scope variables
                    scope.modelVarName = modelVarName;
                    scope.modelProxyVarName = modelProxyVarName;
                    scope.attributeName = attributeName;
                    scope.values = values;

                    // Data binding for proxy
                    // Bind on modelVarName to track direct modifications of variable
                    scope.$watch(scope.modelVarName, function(newValue, oldValue) {
                        if (newValue)
                            scope[scope.modelProxyVarName] = newValue[scope.attributeName];
                    });
                    // Bind on modelProxyVarName to forward of the proxy variable
                    scope.$watch(scope.modelProxyVarName, function(newValue, oldValue) {
                        var values = scope[scope.values];
                        for (var i in values) {
                            var option = values[i];
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
