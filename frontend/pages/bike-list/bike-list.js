// get the table body
const bikesBody = document.getElementById('bikes-body');

// get the bike-list from the backend
fetch('http://localhost:8000/api/bikes')
    .then(response => response.json())
    .then(bikes => {
        // loop through the bike-list
        bikes.forEach(bike => {
            // create a new row
            const row = document.createElement('tr');

            // create the columns
            const id = document.createElement('td');
            const brand = document.createElement('td');
            const model = document.createElement('td');
            const year = document.createElement('td');
            const price = document.createElement('td');
            const actions = document.createElement('td');

            // set the values for the columns
            id.innerText = bike._id;
            brand.innerText = bike.brand;
            model.innerText = bike.model;
            year.innerText = bike.year;
            price.innerText = bike.price;

            // create the edit button
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-primary';
            editButton.innerText = 'Edit';
            editButton.addEventListener('click', () => {
                // redirect to the edit page
                window.location.href = `../edit-bike/edit-bike.html?id=${bike._id}`;
            });

            // create the delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger';
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete ${bike.brand} ${bike.model}?`) === true) {
                    // delete the bike
                    fetch(`http://localhost:8000/api/bikes/${bike._id}`, {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(() => {
                            // remove the row from the table
                            row.remove();
                        });
                }
            });

            // append the buttons to the actions column
            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            // append the columns to the row
            row.appendChild(id);
            row.appendChild(brand);
            row.appendChild(model);
            row.appendChild(year);
            row.appendChild(price);
            row.appendChild(actions);

            // append the row to the table body
            bikesBody.appendChild(row);
        });
    });