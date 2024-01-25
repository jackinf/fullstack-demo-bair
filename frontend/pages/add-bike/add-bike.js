function addBike(event) {
    event.preventDefault();

    const form = event.target;

    const bike = {
        brand: form.brand.value,
        model: form.model.value,
        year: form.year.value,
        price: form.price.value
    };

    fetch(`${window.Bikes.config.backendUrl}/api/bikes`, {
        method: 'POST',
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
        .then(result => {
            console.log(result);
            window.location.href = '../bike-list/bike-list.html';
        })
        .catch(error => {
            console.error('Failed to add a bike:', error);
        });
}