// Get dialog elements
const createDialog = document.getElementById('createForm');
const editDialog = document.getElementById('editForm');
const deleteDialog = document.getElementById('deleteForm');

// Add event listener for 'create' button click
document.getElementById('create').addEventListener('click', () => {
    createDialog.showModal(); // Show create dialog
});

// Add event listener for 'createClose' button click
document.getElementById('createClose').addEventListener('click', () => {
    createDialog.close(); // Close create dialog
});

// Add event listener for 'edit' button click
document.getElementById('edit').addEventListener('click', () => {
    editDialog.showModal(); // Show edit dialog
});

// Add event listener for 'editClose' button click
document.getElementById('editClose').addEventListener('click', () => {
    editDialog.close(); // Close edit dialog
});

// Add event listener for 'delete' button click
document.getElementById('delete').addEventListener('click', () => {
    deleteDialog.showModal(); // Show delete dialog
});

// Add event listener for 'deleteClose' button click
document.getElementById('deleteClose').addEventListener('click', () => {
    deleteDialog.close(); // Close delete dialog
});

// Select all checkbox in table
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

// Get form elements from dialogs
const createForm = createDialog.querySelector('form');
const editForm = editDialog.querySelector('form');
const deleteForm = deleteDialog.querySelector('form');

// Add event listener to createForm submit
createForm.addEventListener('submit', event => {
    event.preventDefault(); // Prevent form submission
    let dataObj = {};

    // Iterate through form elements and populate dataObj
    for (let i = 0; i < createForm.elements.length; i++)
        if (createForm.elements[i].name)
            dataObj[createForm.elements[i].name] = createForm.elements[i].value;
    
    // Send POST request with dataObj
    fetch(window.location.pathname + '/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObj)
    })
    .then(response => {
        if (!response.ok) {
            // If HTTP status is not ok (e.g. 500), get the error message from the response
            return response.json().then(errData => {
                throw new Error(errData.error);
            });
        }
        // If HTTP status is ok, reload the page
        window.location.reload();
    })
    .catch(error => {
        // Catch any error that happened along the way
        document.getElementById('createError').innerText = 'There is a problem with your input:\n' + error.message;
    });
});

// Add event listener to editForm submit
editForm.addEventListener('submit', event => {
    event.preventDefault(); // Prevent form submission
    let dataObj = {};

    // Iterate through form elements and populate dataObj
    for (let i = 0; i < editForm.elements.length; i++)
        if (editForm.elements[i].name)
            dataObj[editForm.elements[i].name] = editForm.elements[i].value;
    
    // Send POST request with dataObj
    fetch(window.location.pathname + '/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObj)
    })
    .then(response => {
        if (!response.ok) {
            // If HTTP status is not ok (e.g. 500), get the error message from the response
            return response.json().then(errData => {
                throw new Error(errData.error);
            });
        }
        // If HTTP status is ok, reload the page
        window.location.reload();
    })
    .catch(error => {
        // Catch any error that happened along the way
        document.getElementById('editError').innerText = 'There is a problem with your input:\n' + error.message;
    });
});

// Add event listener to deleteForm submit
deleteForm.addEventListener('submit', event => {
    event.preventDefault(); // Prevent form submission
    const selectedRows = document.querySelectorAll('input.select-row:checked');
    const ids = Array.from(selectedRows).map(row => row.parentElement.parentElement.getAttribute('data-id'));

    ids.forEach(id => {
        // Send POST request to delete specific item
        fetch(window.location.pathname + '/delete/' + id, {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                // If HTTP status is not ok (e.g. 500), get the error message from the response
                return response.json().then(errData => {
                    throw new Error(errData.error);
                });
            }
            // If HTTP status is ok, reload the page
            window.location.reload();
        })
        .catch(error => {
            // Catch any error that happened along the way
            document.getElementById('deleteError').innerText = 'There was a problem communicating with the database:\n' + error.message;
        });
    });
});
