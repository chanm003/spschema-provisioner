# SPSchema Provisoner

Plain old Javascript libary to generate lists and list items.   This code can be used inside F12 console or a custom application

## Installation
This project contains only one folder `data-generator`.  Copy the folder to a SharePoint subsite. Open your browser and navigate to the `data-generator/index.aspx`. Instructions and links to code snippets can be found there.

## Snippet Creating Lists
![alt text](https://raw.githubusercontent.com/chanm003/spschema-provisioner/master/data-generator/examples/generate-lists-snippet.PNG)

## Snippet Creating List Items
![alt text](https://raw.githubusercontent.com/chanm003/spschema-provisioner/master/data-generator/examples/generate-listitems-snippet.PNG)

## Snippet Creating Files in Document Library
![alt text](https://raw.githubusercontent.com/chanm003/spschema-provisioner/master/data-generator/examples/generate-items-in-doclib-snippet.PNG)

## Representing Different types of SPField
Above screenshots only show Single line of text, Multiple lines of text, and Lookup.

Also supported are:
* Choice (Dropdown, Radio, Checkboxes)
* Number
* Date and Time
* Lookup (allow multiple)
* Yes/No
* Person or Group
* Person or Group (allow multiple)
* Hyperlink/Picture
* Calculated

When defining your fields ensure illegal characters inside strings are escaped:
```
{ Description: 'Use &quot; for single quote, &amp; for ampersand, etc.'}
```
Please refer to `data-generator/examples/how-to-represent-spfields.js`
