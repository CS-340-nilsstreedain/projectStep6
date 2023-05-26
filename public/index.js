const createButton = document.getElementById('create');
const editButton = document.getElementById('edit');
const deleteButton = document.getElementById('delete');

const createCloseButton = document.getElementById('createClose');
const editCloseButton = document.getElementById('editClose');
const deleteCloseButton = document.getElementById('deleteClose');

const createDialog = document.getElementById('createForm');
const editDialog = document.getElementById('editForm');
const deleteDialog = document.getElementById('deleteForm');

createButton.addEventListener('click', () => {
	createDialog.showModal();
});

createCloseButton.addEventListener('click', () => {
	createDialog.close();
});

editButton.addEventListener('click', () => {
	editDialog.showModal();
});

editCloseButton.addEventListener('click', () => {
	editDialog.close();
});

deleteButton.addEventListener('click', () => {
	deleteDialog.showModal();
});

deleteCloseButton.addEventListener('click', () => {
	deleteDialog.close();
});

// Select all check box in table
var boxes = document.getElementsByClassName('select-row');
document.getElementById('select-all').addEventListener('change', function(e) {
	for(var i = 0; i < boxes.length; i++)
		boxes[i].checked = e.target.checked;
});

// De-select "select all" if one box unchecked.
for(var i = 0; i < boxes.length; i++) {
	boxes[i].addEventListener('change', function(e) {
		if(!e.target.checked)
			document.getElementById('select-all').checked = false;
	});
}

const createForm = createDialog.querySelector('form');
//const editForm = editDialog.querySelector('form');
//const deleteForm = deleteDialog.querySelector('form');

createForm.addEventListener('submit', event => {
	event.preventDefault();
	let dataObj = {};
	for (let i = 0; i < createForm.elements.length; i++)
		if (createForm.elements[i].name)
			dataObj[createForm.elements[i].name] = createForm.elements[i].value;
	
	fetch(window.location.pathname + '/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(dataObj)
	})
	.then(response => window.location.reload())
	.catch(error => console.error('Error:', error));
});

//editForm.addEventListener('submit', event => {
//	event.preventDefault();
//	const formData = new FormData(editForm);
//	fetch(window.location.pathname + '/update/:id', {
//		method: 'POST',
//		body: formData
//	})
//	.then(response => window.location.reload())
//	.catch(error => console.error('Error:', error));
//});
//
//deleteForm.addEventListener('submit', event => {
//	event.preventDefault();
//	const id = /* The ID of the row to delete. This will need to come from somewhere. */;
//	fetch(window.location.pathname + '/delete/' + id, {
//		method: 'POST'
//	})
//	.then(response => window.location.reload())
//	.catch(error => console.error('Error:', error));
//});
