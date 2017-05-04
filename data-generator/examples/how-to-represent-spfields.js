var fieldDefinitionExamples = [
    {
        //EXAMPLE: SINGLE LINE OF TEXT
        Name: "ForceTrackingNumber",
        DisplayName: "Force Tracking Number",
        Type: "Text",
        Required: "TRUE",
        MaxLength: 3,
        Default: "XXX"							//(optional)

    },
    {
        //EXAMPLE: MULTIPLE LINE OF TEXT
        Name: "NonconcurReason",
        DisplayName: "Nonconcur Reason",
        Type: "Note",
        Required: "FALSE",
        NumLines: 6,
        RichText: "FALSE",						//RECOMMENDED
        AppendOnly: "TRUE"						//VERSIONING MUST BE TURNED ON, otherwise specifiy "FALSE"

    },
    {
        //EXAMPLE: Yes/No 
        Name: "Married",
        DisplayName: "Married (Y/N)",
        Type: "Boolean",
        Default: 0								//(optional) Use 0 if you want default to be 'No', 1 if for 'Yes'
    },
    {
        //EXAMPLE: DateTime
        Name: "BirthDate",
        DisplayName: "Birth Date",
        Type: "DateTime",
        Required: "FALSE",
        Format: "DateOnly", 					//please use either 'DateOnly' or 'DateTime'
        Default: '[today]'						//(optional)	
    },
    {
        //EXAMPLE: Number
        Name: "EmployeeID",
        DisplayName: "Employee ID",
        Type: "Number",
        Required: "FALSE",
        Decimals: 0, 							//please use number between 0 and 5 only
        Min: -1,								//(optional)	
        Max: -1,								//(optional)	
        Default: -1								//(optional)	
    },
    {
        //EXAMPLE: Dropdown
        Name: "MenuChoice",
        DisplayName: "Menu Choice",
        Type: "Choice",
        Format: "Dropdown",
        Required: "FALSE",
        FillInChoice: "FALSE",
        Choices: ['Meat', 'Seafood', 'Vegetarian'],
        Default: 'Meat'							//(optional)
    },
    {
        //EXAMPLE: Radio Buttons
        Name: "Dessert",
        DisplayName: "Dessert",
        Type: "Choice",
        Format: "RadioButtons",
        Required: "FALSE",
        FillInChoice: "FALSE",
        Choices: ['Ice Cream', 'Pie'],
        Default: 'Pie'							//(optional)
    },
    {
        //EXAMPLE: Checkboxes
        Name: "SideDishes",
        DisplayName: "Side Dishes",
        Type: "MultiChoice",
        Required: "FALSE",
        FillInChoice: "FALSE",
        Choices: ['Beans', 'Rice', 'Fries'],
        Default: 'Beans'						//(optional)
    },
    {
        //EXAMPLE: Picture Field
        Name: "EmployeePhoto",
        DisplayName: "Employee Photo",
        Type: "URL",
        Required: "FALSE",
        Format: "Image"
    },
    {
        //EXAMPLE: URL field
        Name: "BlogURL",
        DisplayName: "Blog URL",
        Type: "URL",
        Required: "FALSE",
        Format: "Hyperlink"
    },
    {
        //EXAMPLE: Lookup field
        Name: "ResidenceCountry",
        DisplayName: "Country of Residence",
        Type: "Lookup",
        Required: "FALSE",
        List: "Countries",                 //ASSUMPTION:  This list lives in the same subsite
        ShowField: 'Title'
    },
    {
        //EXAMPLE: Lookup field (allow multiple)
        Name: "CitizenshipsHeld",
        DisplayName: "Citizenships Held",
        Type: "LookupMulti",                //ASSUMPTION:  This list lives in the same subsite
        Required: "FALSE",
        List: "Countries",
        ShowField: 'Title',
        Mult: "TRUE"
    },
    {
        //EXAMPLE: Person or Group 
        Name: "Supervisor",
        DisplayName: "Supervisor",
        Type: "User",
        Required: "FALSE",
        UserSelectionMode: "PeopleOnly",	//please specify either 'PeopleOnly' or 'PeopleAndGroups'
        ShowField: 'ImnName'				//Name with presence	
    },
    {
        //EXAMPLE: Person or Group (allow multiple)
        Name: "Colleagues",
        DisplayName: "Colleagues",
        Type: "UserMulti",
        Required: "FALSE",
        UserSelectionMode: "PeopleAndGroups",	//please specify either 'PeopleOnly' or 'PeopleAndGroups'
        ShowField: 'ImnName',				//Name with presence	
        Mult: "TRUE"
    },
    {
        //EXAMPLE: Calculated
        Name: 'OrgFilter',
        DisplayName: 'OrgFilter',
        Type: "Calculated",
        Required: 'TRUE',
        ResultType: 'Text',
        ReadOnly: 'TRUE',
        Formula: '=IF(ISNUMBER(FIND(" - ",[Organization])),LEFT([Organization],FIND(" - ",[Organization])-1),[Organization])',
        FieldRefs: ['Organization'],
        Description: 'Used for web part filtering.  Extract left portion whenever &quot; - &quot; is found in the &quot;Organization&quot; field',
        ShowInDisplayForm: 'FALSE'
    }
];