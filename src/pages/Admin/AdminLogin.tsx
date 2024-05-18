import { useState } from "react";
import Popup from "../../components/Popup";

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Invalid username & password combination');
    const [visible, setVisible] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');

    async function handleSubmit(e:any) {
        e.preventDefault();
        try {
            const response = await fetch('https://node-js-jwt-auth.onrender.com/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const data = await response.json();
            console.log(data.token);
            if (!data.success) {
                setErrorMessage(data.message);
                setError(true);
                return;
            }
            localStorage.setItem('adminToken', data.token);
            setVisible(true);
            
        } catch (err) {
            console.log(err);
        }
    }

    async function handleSignup(e:any) {
        e.preventDefault();
        try {
            const response = await fetch('https://node-js-jwt-auth.onrender.com/api/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: signupUsername,
                    password: signupPassword
                })
            });
            const data = await response.json();
            if (!data.success) {
                setErrorMessage(data.message);
                setError(true);
                return;
            }
            setUsername(signupUsername);
            setPassword(signupPassword);
            setShowSignup(false);
            setVisible(true); // Show the popup after successful signup
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className=" min-h-screen flex justify-center items-center shadow-xl">
                <div>
                    <div className="text-5xl font-medium max-w-4xl mx-auto text-center">
                        {showSignup ? 'Admin Signup' : 'Admin Login'}
                    </div>
                    <div className=" mt-16 bg-white max-w-sm mx-auto rounded-md p-8">
                        {!showSignup ? (
                            <form onSubmit={handleSubmit}>
                                <input type="text" className=" focus:bg-white my-2 w-full px-6 py-5 rounded-full bg-gray-100" placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} />
                                <input type="password" className=" focus:bg-white my-2 w-full px-6 py-5 rounded-full bg-gray-100" placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                                <div className={` ${error ? '' : 'hidden'} ml-1 mt-1 text-red-600`}>
                                    <span className="text-white bg-red-600 rounded-full px-2">!</span> {errorMessage}
                                </div>
                                <button
                                    type="submit"
                                    disabled={username === '' || password === ''}
                                    className="w-full text-center px-6 py-5 disabled:bg-zinc-500 rounded-full bg-black text-white my-5 transform active:scale-95 transition duration 300 ease-in-out hover:bg-gray-800 hover:text-white" >Submit</button>
                                <button
                                    onClick={() => setShowSignup(true)}
                                    className="w-full text-center px-6 py-3 rounded-full bg-blue-500 text-white my-2 hover:bg-blue-600 hover:text-white">Signup</button>
                            </form>
                        ) : (
                            <form onSubmit={handleSignup}>
                                <input type="text" className=" focus:bg-white my-2 w-full px-6 py-5 rounded-full bg-gray-100" placeholder="Username"
                                    value={signupUsername}
                                    onChange={(e) => setSignupUsername(e.target.value)} />
                                <input type="password" className=" focus:bg-white my-2 w-full px-6 py-5 rounded-full bg-gray-100" placeholder="Password"
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)} />
                                <button
                                    type="submit"
                                    disabled={signupUsername === '' || signupPassword === ''}
                                    className="w-full text-center px-6 py-3 disabled:bg-zinc-500 rounded-full bg-black text-white my-5 transform active:scale-95 transition duration 300 ease-in-out hover:bg-gray-800 hover:text-white" >Signup</button>
                                <button
                                    onClick={() => setShowSignup(false)}
                                    className="w-full text-center px-6 py-3 rounded-full bg-blue-500 text-white my-2 hover:bg-blue-600 hover:text-white">Back to Login</button>
                            </form>
                        )}
                    </div>
                </div>
            </div >
            {visible && <Popup />}
        </>
    );
}
