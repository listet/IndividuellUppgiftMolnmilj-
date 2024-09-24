import axios from 'axios'
import { useState, useEffect } from 'react'
import writeMessageIcon from '../../assets/writemessage.png'
import logo from '../../assets/logoShui.png'
import deletemessageIcon from '../../assets/cross.png'
import changemessageIcon from '../../assets/pen.png'
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

const deleteMessage = (id, setMessages) => {
    axios.delete(`https://sth8new1el.execute-api.eu-north-1.amazonaws.com/messages/${id}`)
        .then(() => {
            getMessages(setMessages);
        })
        .catch(error => console.error("Error deleting message:", error));
}

function MessagePage() {
    const [messages, setMessages] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        getMessages(setMessages);
    }, []);

    const sortMessages = (order) => {
        const sortedMessages = [...messages].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setMessages(sortedMessages);
        setSortOrder(order);
    };

    return (
        <section className='messages-wrapper'>
            <Link aria-label='Navigate to MessagePage' to="/MessagePage">
                <img className='logo' src={logo} alt="logo" />
            </Link>
            {/* <h1 className='messages-header'>Anslagstavla</h1> */}

            <section className='sort-container'>
                <p>Sortera meddelanden:</p>
                <section className='sort-buttons'>
                    <button className='sort-button' onClick={() => sortMessages('asc')} disabled={sortOrder === 'asc'}>
                        äldst till nyast
                    </button>
                    <button className='sort-button' onClick={() => sortMessages('desc')} disabled={sortOrder === 'desc'}>
                        nyast till äldst
                    </button>
                </section>
            </section>
            <section>
                {messages.length === 0 ? (
                    <p className='nomessage-text'>Det finns inga meddelanden att visa.</p>
                ) : (
                    messages.map(message => {
                        return <article className='message-container' key={message.id}>
                            <div className='messageinfo-container'>
                                <p className='message-date'>{formatDate(message.createdAt)}</p>
                                <section>
                                    <img
                                        className='message-icon'
                                        src={deletemessageIcon}
                                        alt="deletemessage Icon"
                                        onClick={() => deleteMessage(message.pk, setMessages)}
                                    />
                                    <Link to={`/WritePage?id=${message.pk}&text=${message.text}&username=${message.username}`}>
                                        <img
                                            className='message-icon'
                                            src={changemessageIcon}
                                            alt="changemessage Icon"
                                        />
                                    </Link>
                                </section>
                            </div>
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
