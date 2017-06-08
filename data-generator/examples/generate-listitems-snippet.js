function createProject(){
	return spSchemaProvisioner.insertListItems({
	    listTitle: 'Projects',
	    itemsToCreate: [{ ProjectName: 'Sell Car' }]
	});
}

function createTasks(projectListItems){
	var projectId = projectListItems[0].get_id();
	return spSchemaProvisioner.insertListItems({
	    listTitle: 'Tasks',
	    itemsToCreate: [
	    	{ TaskName: 'Wash Car', RelatedProject: spSchemaProvisioner.fieldValues.generateForLookupField(projectId)},
	    	{ TaskName: 'Take Photos', RelatedProject: spSchemaProvisioner.fieldValues.generateForLookupField(projectId)},
	    	{ TaskName: 'Post Ad', RelatedProject: spSchemaProvisioner.fieldValues.generateForLookupField(projectId)}
	    ]
	});
}

createProject()
	.then(createTasks)
	.then(function(){ console.log('Created one project and three tasks...') });