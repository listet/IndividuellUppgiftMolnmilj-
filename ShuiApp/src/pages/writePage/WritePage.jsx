import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logo from '../../assets/logoShui.png'
import './writePage.css'

function WritePage() {

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const messageId = queryParams.get('id');
    const initialText = queryParams.get('text') || '';
    const initialUsername = queryParams.get('username') || '';
    const [text, setText] = useState(initialText);
    const [username, setUsername] = useState(initialUsername);

    useEffect(() => {
        //Om ID skickad med ska text och username fyllas i
        if (messageId) {
            setText(initialText);
            setUsername(initialUsername);
        }
    }, [messageId, initialText, initialUsername]);

    const saveMessage = (e) => {
        e.preventDefault();

        //KOntrollerar att båda fält är ifyllda
        if (text.trim().length < 2 || username.trim().length < 2) {
            alert("Både meddelande och användarnamn måste innehålla minst 2 tecken.");
            return;
        }

        //Om ID finns sker en uppdatering av tidigare meddelande
        if (messageId) {
            axios.put(`https://sth8new1el.execute-api.eu-north-1.amazonaws.com/messages/${messageId}`, {
                text: text.trim(),
                username: username.trim(),
            })
                .then(() => {
                    navigate('/MessagePage');
                })
                .catch(error => {
                    console.error("Error updating message:", error);
                });
        } else {
            //Annars sker en post (nytt meddelande)
            axios.post(`https://sth8new1el.execute-api.eu-north-1.amazonaws.com/messages`, {
                text: text.trim(),
                username: username.trim(),
            })
                .then(() => {
                    navigate('/MessagePage');
                })
                .catch(error => {
                    console.error("Error posting message:", error);
                });
        }
    }

    return (
        <section className='messages-wrapper'>
            <Link aria-label='Navigate to MessagePage' to="/MessagePage">
                <img className='logo' src={logo} alt="logo" />
            </Link>
            <form className='form-container' onSubmit={saveMessage}>
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
                <button className='form-button' type="submit">
                    {messageId ? 'Uppdatera' : 'Publicera'}
                </button>
            </form>
        </section>
    )
}

export default WritePage;
