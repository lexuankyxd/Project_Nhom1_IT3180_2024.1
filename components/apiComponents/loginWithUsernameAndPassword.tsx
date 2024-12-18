import React from 'react'

function LoginWithUsernameAndPassword(username: string, password: string) {
    // -----------------------------------------
    // Post API
    const reply = "Return value of API" + username + password
    // -----------------------------------------   

    return reply
}

export default LoginWithUsernameAndPassword