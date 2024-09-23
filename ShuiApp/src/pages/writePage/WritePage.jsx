import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logoShui.png'
import './writePage.css'

function WritePage() {

    const [text, setText] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const postMessage = (e) => {
        e.preventDefault();
        axios.post(`https://sth8new1el.execute-api.eu-north-1.amazonaws.com/messages`, {
            text: text,
            username: username
        })
            .then(() => {
                navigate('/MessagePage');
            })
            .catch(error => {
                console.error("Error posting message:", error);
            });
    }

    return (
        <section className='messages-wrapper'>
            <Link aria-label='Navigate to MessagePage' to="/MessagePage">
                <img className='logo' src={logo} alt="logo" />
            </Link>

            <form className='form-container' onSubmit={postMessage}>
                <textarea
                    className='form-message'
                    placeholder="Skriv ditt meddelande här..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={500}
                />
                <input className='form-user'
                    type="text"
                    placeholder="Användarnamn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={50}
                />
                <button className='form-button' type="submit">Publicera</button>
            </form>
        </section>
    )
}

export default WritePage
