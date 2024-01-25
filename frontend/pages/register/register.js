const form = document.getElementById('register-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await fetch(`${window.Bikes.config.backendUrl}/register`, {
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

    window.location.href = '../login/login.html';
});