import axios from 'axios'
import { useState, useEffect } from 'react'
import writeMessageIcon from '../../assets/writemessage.png'
import logo from '../../assets/logoShui.png'
import './messagePage.css'
import { Link } from 'react-router-dom'

const getMessages = (setMessages) => {
    axios.get('https://sth8new1el.execute-api.eu-north-1.amazonaws.com/messages')
        .then(response => setMessages(response.data))
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formattedDate = date.toLocaleDateString('sv-SE', options);
    const formattedTime = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} kl. ${formattedTime}`;
}

function MessagePage() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getMessages(setMessages);
    }, []);

    return (
        <section className='messages-wrapper'>
            <Link aria-label='Navigate to MessagePage' to="/MessagePage">
                <img className='logo' src={logo} alt="logo" />
            </Link>
            {/* <h1 className='messages-header'>Anslagstavla</h1> */}
            <section>
                {messages.length === 0 ? (
                    <p className='nomessage-text'>Det finns inga meddelanden att visa.</p>
                ) : (
                    messages.map(message => {
                        return <article className='message-container' key={message.id}>
                            <p className='message-date'>{formatDate(message.createdAt)}</p>
                            <p className='message-text'>{message.text}</p>
                            <h4 className='message-username'>- {message.username}</h4>
                        </article>
                    })
                )}
                <Link aria-label='Navigate to WritePage' to="/WritePage">
                    <img className='writeMsg-btn' src={writeMessageIcon} alt="writemessage button" />
                </Link>
            </section>
        </section>
    )
}

export default MessagePage
