
export const userService = {
    login,
    logout,
};

function login() {
    // const requestOptions = {
    //     method: 'POST',
    //     dataType: "jsonp",
    // };

    // return fetch(`http://127.0.0.1:8000/api_v2/auth/?sso`, requestOptions)
    //     .then(handleResponse)
    //     .then(user => {
    //         // login successful if there's a jwt token in the response
    //         if (user.token) {
    //             // store user details and jwt token in local storage to keep user logged in between page refreshes
    //             localStorage.setItem('user', JSON.stringify(user));
    //         }

    //         return user;
    //     });
    window.location.href = 'auth_url'
    this.loaded = true
}

function logout() {
    // remove user from local storage to log user out
    console.log("loggedout")
    localStorage.removeItem('user');
    console.log(localStorage.getItem('user'))
    localStorage.setItem('isAutheticated', false)

}



// function handleResponse(response) {
//     return response.text().then(text => {
//         const data = text && JSON.parse(text);
//         if (!response.ok) {
//             if (response.status === 401) {
//                 // auto logout if 401 response returned from api
//                 logout();
//                 location.reload(true);
//             }

//             const error = (data && data.message) || response.statusText;
//             return Promise.reject(error);
//         }

//         return data;
//     });
// }
