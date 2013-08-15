var optionsProxy = (function() {
'use strict';

var my = {};

/*
 * Parse ngOptions string
 */

// constants from NG_OPTIONS_REGEXP from the select directive implementation of angular.
var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/,
    PIPE_REGEXP = /^\s*([^\s]+)\s*\|/,
    AS_REGEXP = /^\s*(.*)\s+as\s+(.*)$/;

var ngOptionsParser = function(ngOptionString) {
    var attributeName,
        values,
        newNgOptionString;
    var match,
        submatch;

    if ((match = NG_OPTIONS_REGEXP.exec(ngOptionString))) {
        var valueName = match[4] || match[6],
            displayName = match[2] || match[1];
        attributeName = displayName.substring(valueName.length+1, displayName.length);
        values = match[7];
        if ((submatch = PIPE_REGEXP.exec(values)))
            values = submatch[1];
        if ((submatch = AS_REGEXP.exec(ngOptionString)))
            newNgOptionString = displayName+' as '+submatch[2];
        else
            newNgOptionString = displayName+' as '+ngOptionString;
    }

    return {
        attributeName: attributeName,
        values: values,
        ngOptionString: newNgOptionString,
    };
};
my.ngOptionsParser = ngOptionsParser;

/*
 * The directive
 */
angular.module('options-proxy', []).directive('optionsProxy', ['$parse', function($parse) {
    return {
        compile: function(tElement, tAttrs) {
            // Process attributes
            var modelVarName = tAttrs.ngModel,
                modelProxyVarName = (modelVarName + 'Proxy').replace('.', '_'),
                ngOptionString = tAttrs.ngOptions,
                attributeName,
                values,
                parsedOptions;

            // Parse ngOptions
            parsedOptions = ngOptionsParser(ngOptionString);
            attributeName = parsedOptions.attributeName;
            values = parsedOptions.values;
            tAttrs.$set('ngOptions', parsedOptions.ngOptionString);
            tAttrs.$set('ngModel', modelProxyVarName);

            return {
                pre: function(scope) {
                    // Initializing context variables
                    var context = {
                        // obj.name for obj in objects
                        attributeAccessor: $parse(attributeName), // 'name'
                        valuesAccessor: $parse(values),           // 'objects'
                        proxyAccessor: $parse(modelProxyVarName), // 'obj_nameProxy'
                        varAccessor: $parse(modelVarName),        // 'obj'
                        varAttributeAccessor: $parse(modelVarName+'.'+attributeName), // 'obj.name'
                    };

                    // Data binding for proxy
                    // Bind on modelVarName to track direct modifications of variable
                    scope.$watch(modelVarName, function(context) {
                        return function(newValue, oldValue) {
                            if (newValue)
                                context.proxyAccessor.assign(scope, context.attributeAccessor(newValue));
                        };
                    }(context));

                    // Bind on modelProxyVarName to forward of the proxy variable
                    scope.$watch(modelProxyVarName, function(context) {
                        return function(newValue, oldValue) {
                            if (newValue === oldValue)
                                return;
                            var values = context.valuesAccessor(scope);
                            for (var i in values) {
                                var option = values[i],
                                    attribute = context.attributeAccessor(option);
                                if (newValue == attribute) {
                                    if (context.varAttributeAccessor(scope) != attribute) {
                                        context.varAccessor.assign(scope, angular.copy(option));
                                    }
                                    break;
                                }
                            }
                        };
                    }(context));
                }
            };
        }
    };
}]);

return my;
})();
