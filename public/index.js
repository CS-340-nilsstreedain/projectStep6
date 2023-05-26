const createDialog = document.getElementById('createForm');
const editDialog = document.getElementById('editForm');
const deleteDialog = document.getElementById('deleteForm');

document.getElementById('create').addEventListener('click', () => {
	createDialog.showModal();
});

document.getElementById('createClose').addEventListener('click', () => {
	createDialog.close();
});

document.getElementById('edit').addEventListener('click', () => {
	editDialog.showModal();
});

document.getElementById('editClose').addEventListener('click', () => {
	editDialog.close();
});

document.getElementById('delete').addEventListener('click', () => {
	deleteDialog.showModal();
});

document.getElementById('deleteClose').addEventListener('click', () => {
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

deleteForm.addEventListener('click', () => {
	const selectedRows = document.querySelectorAll('input.select-row:checked');
	const ids = Array.from(selectedRows).map(row => row.parentElement.parentElement.getAttribute('data-id'));

	ids.forEach(id => {
		fetch(window.location.pathname + '/delete/' + id, {
			method: 'POST'
		})
		.then(response => window.location.reload())
		.catch(error => console.error('Error:', error));
	});
});
