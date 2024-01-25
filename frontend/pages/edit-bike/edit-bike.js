// get the bike id from the url
const urlParams = new URLSearchParams(window.location.search);
const bikeId = urlParams.get('id');

// get the bike from the backend
fetch(`${window.Bikes.config.backendUrl}/api/bikes/${bikeId}`, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})
    .then(response => {
        if (response.status === 401) {
            window.location.href = '../login/login.html';
            throw new Error('Not authenticated');
        }
        return response.json();
    })
    .then(bike => {
        // set the values for the form
        document.getElementById('brand').value = bike.brand;
        document.getElementById('model').value = bike.model;
        document.getElementById('year').value = bike.year;
        document.getElementById('price').value = bike.price;
    });

// edit the bike
function editBike(event) {
    event.preventDefault();

    const form = event.target;

    const bike = {
        brand: form.brand.value,
        model: form.model.value,
        year: form.year.value,
        price: form.price.value,
    };

    // send the bike to the backend
    fetch(`${window.Bikes.config.backendUrl}/api/bikes/${bikeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bike)
    })
        .then(response => {
            if (response.status === 401) {
                window.location.href = '../login/login.html';
                throw new Error('Not authenticated');
            }
            return response.json();
        })
        .then(() => {
            // redirect to the bikes page
            window.location.href = '../bike-list/bike-list.html';
        });
}