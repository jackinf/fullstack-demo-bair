const form = document.getElementById('login-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch(`${window.Bikes.config.backendUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (result.status !== 200) {
        alert('Invalid username or password');
        return;
    }

    const resultJson = await result.json();
    localStorage.setItem('token', resultJson.accessToken);
    window.location.href = '../bike-list/bike-list.html';
});