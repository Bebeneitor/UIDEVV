export const user = {
    "userId": 206,
    "userName": "user.user",
    "password": null,
    "firstName": "john.smith",
    "lastName": "",
    "email": "john.smith@mail.com",
    "role": null,
    "roles": [
        { "roleId": 13, "roleName": "OTH", "name": "OTH", "description": "Default" },
        { "roleId": 13, "roleName": "CVPA", "name": "CVPA", "description": "CVPA" }
    ],
    "lobs": [],
    "states": [],
    "categories": [],
    "skipAssignment": null,
    "lastDayLogin": "2020-08-27T04:00:00.000+0000"
};

export const cols = [
    { field: 'ruleCode', header: 'ECL ID' },
    { field: 'identifier', header: 'Mid Rule' },
    { field: 'subIdentifier', header: 'Version' },
    { field: 'implementationDate', header: 'Implementation Date' },
    { field: 'logic', header: 'Logic', width: '50ch' },
    { field: 'ruleHeaderDescription', header: 'Rule Header Description' },
    { field: 'libraryCustomInternal', header: 'Type' }
];

export const cvRuleValues = [
    
    { label: 'select', value: '' },
    { label: 'Yes', value: '1' },
    { label: 'No', value: '0' }
];

export const allowedExtensions = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';;
export const colsWithOnlyInputs = ['ruleCode', 'ruleId', 'identifier', 'subIdentifier', 'ruleHeaderDescription', 'libraryCustomInternal', 'logic']