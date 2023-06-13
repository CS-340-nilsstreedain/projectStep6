//document.getElementById('booksSearch').addEventListener('submit', function(event) {
//    event.preventDefault();
//    
//    let genreID = document.getElementById('searchGenre').value;
//    
//    fetch('/books/search', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json',
//        },
//        body: JSON.stringify({ genreID: genreID }),
//    })
//    .then(response => response.json())
//    .then(data => {
//        let table = '<thead><tr><th><input type="checkbox" id="select-all"></th><th>bookID</th><th>title</th><th>author</th><th>price</th><th>stock</th></tr></thead><tbody>';
//        data.forEach(row => {
//            table += '<tr data-id="' + row.bookID + '">';
//            table += '<td><input type="checkbox" class="select-row"></td>';
//            table += '<td>' + row.bookID + '</td>';
//            table += '<td>' + row.title + '</td>';
//            table += '<td>' + row.author + '</td>';
//            table += '<td>' + row.price + '</td>';
//            table += '<td>' + row.stock + '</td></tr>';
//        });
//        table += '</tbody>';
//
//        document.getElementById('results').innerHTML = table;
//        console.log(data);
//    });
//});

document.getElementById('custSearch').addEventListener('submit', function(event) {
    event.preventDefault();
//    console.log("Test");
    
    let name = document.getElementById('searchName').value;
    
    fetch('/customers/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name }),
    })
    .then(response => response.json())
    .then(data => {
        let table = '<thead><tr><th><input type="checkbox" id="select-all"></th><th>customerID</th><th>name</th><th>phone</th><th>email</th><th>address</th><th>favoriteGenre</th></tr></thead><tbody>';
        data.forEach(row => {
            table += '<tr data-id="' + row.customerID + '">';
            table += '<td><input type="checkbox" class="select-row"></td>';
            table += '<td>' + row.customerID + '</td>';
            table += '<td>' + row.name + '</td>';
            table += '<td>' + row.phone + '</td>';
            table += '<td>' + row.email + '</td>';
            table += '<td>' + row.address + '</td>';
            table += '<td>' + row.favoriteGenre + '</td></tr>';
        });
        table += '</tbody>';

        document.getElementById('results').innerHTML = table;
//        console.log(data);
    });
});

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
const editForm = editDialog.querySelector('form');
const deleteForm = deleteDialog.querySelector('form');

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

editForm.addEventListener('submit', event => {
	event.preventDefault();
	let dataObj = {};
	for (let i = 0; i < editForm.elements.length; i++)
		if (editForm.elements[i].name)
			dataObj[editForm.elements[i].name] = editForm.elements[i].value;
    
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

deleteForm.addEventListener('submit', event => {
	event.preventDefault();
	const selectedRows = document.querySelectorAll('input.select-row:checked');
	const ids = Array.from(selectedRows).map(row => row.parentElement.parentElement.getAttribute('data-id'));

	ids.forEach(id => {
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
