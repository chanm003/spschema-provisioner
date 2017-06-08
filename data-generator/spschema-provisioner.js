(function () {
    window.spSchemaProvisioner = window.spSchemaProvisioner || {};
    window.spSchemaProvisioner.generateDataStore = generateDataStore;
    window.spSchemaProvisioner.insertListItems = insertListItems;
    window.spSchemaProvisioner.fieldValues = {};

    var fieldAttributeValuesValidation = {
        AppendOnly: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        Decimals: function (val) {
            return _.isNumber(val);
        },
        Description: function (val) {
            return _.isString(val);
        },
        DisplayName: function (val) {
            return _.isString(val);
        },
        EnforceUniqueValues: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        FillInChoice: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        Format: function (val) {
            return _.isString(val) && _.includes(['Calculated', 'DateOnly', 'DateTime', 'Dropdown', 'Hyperlink', 'Image', 'RadioButtons'], val);
        },
        Hidden: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        Indexed: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        List: function (val) {
            return _.isString(val);
        },
        Max: function (val) {
            return _.isNumber(val);
        },
        MaxLength: function (val) {
            return _.isNumber(val);
        },
        Min: function (val) {
            return _.isNumber(val);
        },
        Mult: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        Name: function (val) {
            return _.isString(val);
        },
        NumLines: function (val) {
            return _.isNumber(val);
        },
        ReadOnly: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        Required: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        ResultType: function (val) {
            return _.isString(val);
        },
        RichText: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        ShowField: function (val) {
            return _.isString(val);
        },
        ShowInDisplayForm: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        ShowInEditForm: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        ShowInNewForm: function (val) {
            return _.isString(val) && _.includes(['TRUE', 'FALSE'], val.toUpperCase());
        },
        Type: function (val) {
            return _.isString(val) && _.includes(['Boolean', 'Calculated', 'Choice', 'DateTime', 'Lookup', 'LookupMulti', 'MultiChoice', 'Note', 'Number', 'Text', 'URL', 'User', 'UserMulti'], val);
        },
        UserSelectionMode: function (val) {
            return _.isString(val) && _.includes(['PeopleAndGroups', 'PeopleOnly'], val);
        }
    };

    /**
     * HELPER TO GENERATE XML for a <Field/> from JSON mapping
     * 
     * USAGE: 
     *      generateCamlForSpField({
                //EXAMPLE: MULTIPLE LINE OF TEXT
                Name: "Recommendation",
                DisplayName: "Recommendation",
                Type: "Note",
                Required: "FALSE",
                NumLines: 6,
                RichText: "FALSE",						
                AppendOnly: "FALSE"						
            });
        GENERATES FOLLOWING XML:
            <Field Name='Recommendation' DisplayName='Recommendation' Type='Note' Required='FALSE' NumLines='6' RichText='FALSE' AppendOnly='FALSE' StaticName='Recommendation'></Field>
    */
    function generateCamlForSpField(mapping) {
        if (!mapping.Type || !mapping.Name || !mapping.DisplayName) {
            console.error("Type, Name and Display Name are always required anytime you create a SharePoint field");
            return "";
        }

        var funcs = {
            "Boolean": generateCamlForBooleanField,
            "Calculated": generateCamlForCalculatedField,
            "Choice": generateCamlForChoiceField,
            "DateTime": generateCamlForDateTimeField,
            "Lookup": generateCamlForLookupField,
            "LookupMulti": generateCamlForLookupMultiField,
            "MultiChoice": generateCamlForMultiChoiceField,
            "Note": generateCamlForNoteField,
            "Number": generateCamlForNumberField,
            "Text": generateCamlForTextField,
            "URL": generateCamlForUrlField,
            "User": generateCamlForUserField,
            "UserMulti": generateCamlForUserMultiField
        };

        return funcs[mapping.Type](mapping);
    }

    function generateCaml(mapping, supportedAttrs) {
        var validSettings = {};
        var choicesCaml = "";
        var defaultCaml = "";
        var formulaCaml = "";
        var fieldRefsCaml = "";

        _.each(supportedAttrs, function (attr) {
            var attrVal = mapping[attr];

            if (attrVal === 0 || !!attrVal) {
                if (attr === "Default") {
                    defaultCaml = "<Default>" + attrVal + '</Default>';
                } else if (attr === "Formula") {
                    formulaCaml = "<Formula>" + attrVal + '</Formula>';
                } else if (attr === "Choices" && _.isArray(attrVal)) {
                    choicesCaml = _.map(attrVal, function (option) {
                        return "<CHOICE>" + option + "</CHOICE>";
                    })
                        .join('');
                    choicesCaml = "<CHOICES>" + choicesCaml + "</CHOICES>";
                } else if (attr === "FieldRefs" && _.isArray(attrVal)) {
                    fieldRefsCaml = _.map(attrVal, function (internalFieldName) {
                        return "<FieldRef Name='" + internalFieldName + "' />";
                    })
                        .join('');
                    fieldRefsCaml = "<FieldRefs>" + fieldRefsCaml + "</FieldRefs>";
                } else {
                    if (fieldAttributeValuesValidation[attr] && fieldAttributeValuesValidation[attr](attrVal)) {
                        validSettings[attr] = attrVal;
                    }
                }
            }
        });

        if (!validSettings["StaticName"]) {
            validSettings["StaticName"] = validSettings["Name"]
        }

        var strAttrs = '';

        _.each(validSettings, function (val, attr) {
            strAttrs += ' ' + attr + "='" + val + "'";
        });

        return [
            '<Field',
            strAttrs,
            '>',
            defaultCaml,
            choicesCaml,
            formulaCaml,
            fieldRefsCaml,
            '</Field>'
        ].join('');
    }

    function generateCamlForBooleanField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Default", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden"];
        return generateCaml(mapping, supported);
    }

    function generateCamlForCalculatedField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Required", "ResultType", "ReadOnly", "Formula", "FieldRefs", "Description", "ShowInDisplayForm", "Format"];
        return generateCaml(mapping, supported);
    }

    function generateCamlForDateTimeField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Required", "Format", "Default", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden"];
        return generateCaml(mapping, supported);
    }

    function generateCamlForChoiceField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Format", "Required", "Choices", "FillInChoice", "Default", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden", "EnforceUniqueValues", "Indexed"];
        return generateCaml(mapping, supported);
    }

    function generateCamlForLookupField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Required", "List", "ShowField", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden"];
        return generateCaml(mapping, supported);
    }

    function generateCamlForLookupMultiField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Required", "List", "ShowField", "Mult", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden"];
        return generateCaml(mapping, supported);
    }

    function generateCamlForMultiChoiceField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Format", "Required", "Choices", "FillInChoice", "Default", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden"];
        return generateCaml(mapping, supported);
    }

    function generateCamlForNoteField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Required", "NumLines", "RichText", "AppendOnly", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden"];
        return generateCaml(mapping, supported);
    }

    function generateCamlForNumberField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Required", "Decimals", "Min", "Max", "Default", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden"];
        return generateCaml(mapping, supported);

    }

    function generateCamlForTextField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Required", "MaxLength", "Default", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden"];
        return generateCaml(mapping, supported);
    }

    function generateCamlForUrlField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Required", "Format", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden"];
        return generateCaml(mapping, supported);
    }

    function generateCamlForUserField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Required", "UserSelectionMode", "ShowField", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden"];
        return generateCaml(mapping, supported);
    }

    function generateCamlForUserMultiField(mapping) {
        var supported = ["Name", "DisplayName", "Type", "Required", "UserSelectionMode", "ShowField", "Mult", "Description", "ShowInNewForm", "ShowInEditForm", "Hidden"];
        return generateCaml(mapping, supported);
    }

    function createList(opts) {
        opts.webUrl = opts.webUrl || _spPageContextInfo.webServerRelativeUrl;
        var dfd = $.Deferred();
        var ctx = new SP.ClientContext(opts.webUrl);
        var spWeb = ctx.get_web();
        var createdList = null;
        var createdFields = [];

        //create list
        var listCreationInfo = new SP.ListCreationInformation();
        var uglyListName = _.upperFirst(_.camelCase(opts.Title));
        listCreationInfo.set_title(uglyListName);
        listCreationInfo.set_templateType(SP.ListTemplateType[opts.BaseTemplate]);
        createdList = spWeb.get_lists().add(listCreationInfo);

        //update list: make the name of list pretty, turn-on versioning if necessary
        createdList.set_title(opts.Title);
        if (opts.enableVersioning) {
            createdList.set_enableVersioning(true);
        }

        if (opts.hasOwnProperty('enableFolderCreation')) {
            createdList.set_enableFolderCreation(opts.enableFolderCreation);
        }
        createdList.update();

        //existing fields that may have been part of list template
        _.each(opts.fieldsToModify, function (fieldDef) {
            var existingField = createdList.get_fields().getByInternalNameOrTitle(fieldDef.Name);
            existingField.set_schemaXml(generateCamlForSpField(fieldDef));
            existingField.update();
        });

        //add fields
        _.each(opts.fieldsToCreate, function (fieldDef) {
            if (fieldDef.Type !== 'Lookup' && fieldDef.Type !== 'LookupMulti') {
                var newField = createdList.get_fields().addFieldAsXml(generateCamlForSpField(fieldDef), true, SP.AddFieldOptions.addFieldInternalNameHint);
                createdFields.push(newField);
            }
        });

        //update to Title field (if necessary)
        if (opts.shouldHideTitleField) {
            var titleField = createdList.get_fields().getByTitle("Title");
            titleField.setShowInDisplayForm(false);
            titleField.setShowInNewForm(false);
            titleField.setShowInEditForm(false);
            titleField.set_required(false);
            titleField.update();
        }

        //batch, setup, and send the request
        ctx.load(createdList);
        _.each(createdFields, function (createdField) {
            ctx.load(createdField);
        });
        ctx.executeQueryAsync(
            Function.createDelegate(this, onQuerySucceeded),
            Function.createDelegate(this, onQueryFailed)
        );

        return dfd.promise();

        function onQuerySucceeded() {
            console.warn('Created list: "' + opts.Title + '"');
            dfd.resolve();
        }
        function onQueryFailed(sender, args) {
            console.error('Request to create list "' + opts.Title + '" failed: ', args.get_message(), args.get_stackTrace());
            dfd.reject();
        }
    }

    function createLookupField(listDef, fieldDef) {
        listDef.webUrl = listDef.webUrl || _spPageContextInfo.webServerRelativeUrl;
        var dfd = $.Deferred();
        var ctx = new SP.ClientContext(listDef.webUrl);
        var spWeb = ctx.get_web();
        var fieldCollection = spWeb.get_lists().getByTitle(listDef.Title).get_fields();
        var lookupList = spWeb.get_lists().getByTitle(fieldDef.List);

        ctx.load(fieldCollection);
        ctx.load(lookupList);

        ctx.executeQueryAsync(
            Function.createDelegate(this, onLookupListFound),
            Function.createDelegate(this, onQueryFailed)
        );

        return dfd.promise();

        function onLookupListFound() {
            fieldDef.List = lookupList.get_id().toString();
            fieldCollection.addFieldAsXml(generateCamlForSpField(fieldDef), true, SP.AddFieldOptions.addFieldInternalNameHint);

            ctx.executeQueryAsync(
                Function.createDelegate(this, onLookupFieldCreated),
                Function.createDelegate(this, onQueryFailed)
            );
        }

        function onLookupFieldCreated() {
            console.warn('Created Lookup Field: "' + fieldDef.Name + '" in the list: "' + listDef.Title + '"');
            dfd.resolve();
        }

        function onQueryFailed(sender, args) {
            console.error('Request to create Lookup Field: "' + fieldDef.Name + '" in the list: "' + listDef.Title + '" failed.', args.get_message(), args.get_stackTrace());
            dfd.reject();
        }
    }

    function insertListItems(opts) {
        opts.webUrl = opts.webUrl || _spPageContextInfo.webServerRelativeUrl;
        var dfd = $.Deferred();
        var ctx = new SP.ClientContext(opts.webUrl);
        var spWeb = ctx.get_web();
        var list = spWeb.get_lists().getByTitle(opts.listTitle);
        var listItems = [];

        _.each(opts.itemsToCreate, function (item) {
            var listItem = list.addItem(new SP.ListItemCreationInformation());

            for (var propName in item) {
                listItem.set_item(propName, item[propName]);
                listItem.update();
                ctx.load(listItem);
                listItems.push(listItem);
            }
        });

        ctx.executeQueryAsync(
            Function.createDelegate(this, onListItemsAdded),
            Function.createDelegate(this, onQueryFailed)
        );

        return dfd.promise();

        function onListItemsAdded() {
            console.warn('Created ' + opts.itemsToCreate.length + ' list item(s) in the list: "' + opts.listTitle + '"');
            dfd.resolve(listItems);
        }

        function onQueryFailed(sender, args) {
            console.error('Request to add list items in "' + opts.listTitle + '" failed: ', args.get_message(), args.get_stackTrace());
            dfd.reject();
        }
    }

    function createLists(schema) {
        var promises = [];
        _.each(schema.lists, function (listDef, key) {
            listDef.Title = key;
            promises.push(createList(listDef));
        });

        //parallel
        return $.when.apply($, promises)
            .then(function () {
                console.warn('All lists have been created...');
                return schema;
            });
    }

    function createLookupfields(listDef) {
        var lookupFields = _.filter(listDef.fieldsToCreate, function(fieldDef){ return fieldDef.Type === 'Lookup' || fieldDef.Type === 'LookupMulti'; });

        var externalDfd = $.Deferred(),
            internalDfd = $.Deferred(),
            promise = internalDfd.promise(),
            i = 0,
            c = 0;

        while (i < lookupFields.length) {
            (function (i) {
                promise = promise.then(function () {
                    return createLookupField(listDef, lookupFields[i]);
                });
            }(i++));
        }

        promise.done(function(){
            if(lookupFields.length){
                //console.warn('All lookup fields created for: ' + listDef.Title );
            }
            externalDfd.resolve();
        })
        
        internalDfd.resolve();
        
        return externalDfd.promise();
    }

    function createAssociations(schema) {
        var promises = [];
        _.each(schema.lists, function (listDef, key) {
            listDef.Title = key;
            promises.push(createLookupfields(listDef));
        });

        //parallel
        return $.when.apply($, promises)
            .then(function () {
                console.warn('All associations have been created...');
                return schema;
            });
    }

    function generateDataStore(schema) {
        return createLists(schema)
            .then(createAssociations)
            .then(function(){
                console.warn('Finished...');
            });
    }

    window.spSchemaProvisioner.fieldValues.generateForLookupField = function(lookupID) {
        var lookupVal = new SP.FieldLookupValue();
        lookupVal.set_lookupId(lookupID);
        return lookupVal;
    }

    window.spSchemaProvisioner.fieldValues.generateForPersonField = function(userID) {
        var lookupVal = new SP.FieldUserValue();
        lookupVal.set_lookupId(userID);
        return lookupVal;
    }

    window.spSchemaProvisioner.fieldValues.generateForPersonMultiField = function(array_of_userID) {
        return _.map(array_of_userID, function(userID){
            return window.spSchemaProvisioner.fieldValues.generateForPersonField(userID);
        });
    }
})();


