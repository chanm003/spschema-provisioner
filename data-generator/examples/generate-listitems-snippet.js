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
	    	{ TaskName: 'Wash Car', RelatedProjectId: projectId},
	    	{ TaskName: 'Take Photos', RelatedProjectId: projectId},
	    	{ TaskName: 'Post Ad', RelatedProjectId: projectId}
	    ]
	});
}

createProject()
	.then(createTasks)
	.then(function(){ console.log('Created one project and three tasks...') });