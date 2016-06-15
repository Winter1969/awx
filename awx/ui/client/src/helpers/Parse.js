/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

    /**
 * @ngdoc function
 * @name helpers.function:Parse
 * @description
 *  Show the CodeMirror variable editor and allow
 *  toggle between JSON and YAML
 *
 */


export default
    angular.module('ParseHelper', ['Utilities', 'AngularCodeMirrorModule'])
        .factory('ParseTypeChange', ['Alert', 'AngularCodeMirror', '$rootScope',
        function (Alert, AngularCodeMirror, $rootScope) {
            return function (params) {

                var scope = params.scope,
                    field_id = params.field_id,
                    fld = (params.variable) ? params.variable : 'variables',
                    pfld = (params.parse_variable) ? params.parse_variable : 'parseType',
                    onReady = params.onReady,
                    onChange = params.onChange;

                function removeField(fld) {
                    //set our model to the last change in CodeMirror and then destroy CodeMirror
                    scope[fld] = scope[fld + 'codeMirror'].getValue();
                    $('#cm-' + fld + '-container > .CodeMirror').empty().remove();
                }

                function createField(onChange, onReady, fld) {
                    //hide the textarea and show a fresh CodeMirror with the current mode (json or yaml)

                    scope[fld + 'codeMirror'] = AngularCodeMirror();
                    scope[fld + 'codeMirror'].addModes($AnsibleConfig.variable_edit_modes);
                    scope[fld + 'codeMirror'].showTextArea({
                        scope: scope,
                        model: fld,
                        element: field_id,
                        lineNumbers: true,
                        mode: scope[pfld],
                        onReady: onReady,
                        onChange: onChange
                    });
                }

                // Hide the textarea and show a CodeMirror editor
                createField(onChange, onReady, fld);


                // Toggle displayed variable string between JSON and YAML
                scope.parseTypeChange = function(model, fld) {
                    var json_obj;
                    if (scope[model] === 'json') {
                        // converting yaml to json
                        try {
                            removeField(fld);
                            json_obj = jsyaml.load(scope[fld]);
                            if ($.isEmptyObject(json_obj)) {
                                scope[fld] = "{}";
                            }
                            else {
                                scope[fld] = JSON.stringify(json_obj, null, " ");
                            }
                            createField(onReady, onChange, fld);
                        }
                        catch (e) {
                            Alert('Parse Error', 'Failed to parse valid YAML. ' + e.message);
                            setTimeout( function() { scope.$apply( function() { scope[model] = 'yaml'; createField(); }); }, 500);
                        }
                    }
                    else {
                        // convert json to yaml
                        try {
                            removeField(fld);
                            json_obj = JSON.parse(scope[fld]);
                            if ($.isEmptyObject(json_obj)) {
                                scope[fld] = '---';
                            }
                            else {
                                scope[fld] = jsyaml.safeDump(json_obj);
                            }
                            createField(onReady, onChange, fld);
                        }
                        catch (e) {
                            Alert('Parse Error', 'Failed to parse valid JSON. ' + e.message);
                            setTimeout( function() { scope.$apply( function() { scope[model] = 'json'; createField(); }); }, 500 );
                        }
                    }
                };
            };
        }
    ]);
