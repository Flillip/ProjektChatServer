const form = document.getElementById('sing-in-form');

function redirectIfLoggedIn() {
    if (localStorage.getItem('token') !== null) {
        window.location.href = '/chat';
    }
}

function handleRe() {
    const re = new URLSearchParams(queryString).get('re');
    if (re === 'unauthorized')
        alert("You are not logged in!");
    else if (re === 'forbidden')
        alert("You have to login again!");

    localStorage.removeItem('token');
}

function handleErr() {
    const err = new URLSearchParams(queryString).get('err');
    const errPara = document.getElementById('err');
    errPara.innerText = err;
}


form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === '' || password === '') {
        alert("Please fill in all fields!");
        return;
    }
    
    const password_hash = md5(password);
    
    const type = event.submitter.name;
    
    if (type === 'Sign in')
    signIn(username, password_hash);
else if (type === 'Sign up')
signUp(username, password_hash);

});

async function signIn(user, password) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password })
    });
    
    if (response.status !== ResponseCode.Success) return handleSignInError(response.status);
    
    const { token } = await response.json();
    localStorage.setItem('token', token);
    redirectIfLoggedIn();
}

async function signUp(user, password) {
    const response = await fetch('/api/new-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password })
    });
    
    if (response.status !== ResponseCode.Created) return handleSignUpError(response.status);
    
    const { token } = await response.json();
    localStorage.setItem('token', token);
    redirectIfLoggedIn();
}

function handleSignInError(status) {
    if (status === ResponseCode.BadRequest) {
        alert("Bad request!");
    }
    
    else if (status === ResponseCode.InternalServerError) {
        alert("There was an error on the server, try again later!");
    }
    
    else {
        alert("Unknown error, try again later!");
    }
}

function handleSignUpError(status) {
    if (status === ResponseCode.Conflict) {
        alert("Username already exists!");
    }
    
    else if (status === ResponseCode.BadRequest) {
        alert("Bad request!");
    }
    
    else if (status === ResponseCode.InternalServerError) {
        alert("There was an error on the server, try again later!");
    }
    
    else {
        alert("Unknown error, try again later!");
    }
}

const queryString = window.location.search;
if (!queryString.includes("re=") && !queryString.includes("err="))
    redirectIfLoggedIn();
else {
    if (queryString.includes("err="))
        handleErr();
    else if (queryString.includes("re="))
        handleRe();
}