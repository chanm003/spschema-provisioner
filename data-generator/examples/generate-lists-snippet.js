var simpleSchema = {
    lists: {
        'Projects': {
            BaseTemplate: 'genericList',
            shouldHideTitleField: true,
            fieldsToCreate: [
                {
                    //EXAMPLE: SINGLE LINE OF TEXT
                    Name: "ProjectName",
                    DisplayName: "Name",
                    Type: "Text",
                    Required: "TRUE"
                },
                {
                    //EXAMPLE: MULTIPLE LINE OF TEXT
                    Name: "ProjectDescription",
                    DisplayName: "Description",
                    Type: "Note",
                    Required: "FALSE",
                    NumLines: 6,
                    RichText: "FALSE"
                }
            ]
        },
        'Tasks': {
            BaseTemplate: 'genericList',
            shouldHideTitleField: true,
            fieldsToCreate: [
                {
                    //EXAMPLE: SINGLE LINE OF TEXT
                    Name: "TaskName",
                    DisplayName: "Name",
                    Type: "Text",
                    Required: "TRUE"
                },
                {
                    //EXAMPLE: Lookup field
                    Name: "RelatedProject",
                    DisplayName: "Project",
                    Type: "Lookup",
                    Required: "TRUE",
                    List: "Projects",
                    ShowField: 'ProjectName'
                }
            ]
        }
    }
};
spSchemaProvisioner.generateDataStore(simpleSchema);