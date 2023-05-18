const createButton = document.getElementById('create');
const editButton = document.getElementById('edit');
const deleteButton = document.getElementById('delete');
const createDialog = document.getElementById('createForm');
const editDialog = document.getElementById('editForm');
const deleteDialog = document.getElementById('deleteForm');

createButton.addEventListener('click', () => {
	createDialog.showModal();
});

editButton.addEventListener('click', () => {
	editDialog.showModal();
});

deleteButton.addEventListener('click', () => {
	deleteDialog.showModal();
});
