function addBike(event) {
    event.preventDefault();

    const form = event.target;

    const bike = {
        brand: form.brand.value,
        model: form.model.value,
        year: form.year.value,
        price: form.price.value
    };

    fetch('http://localhost:8000/api/bikes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bike)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            window.location.href = '../bike-list/bike-list.html';
        })
        .catch(error => {
            console.error('Failed to add a bike:', error);
        });
}