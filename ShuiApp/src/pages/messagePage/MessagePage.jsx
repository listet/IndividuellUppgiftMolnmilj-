import axios from 'axios'
import { useState, useEffect } from 'react'
import './messagePage.css'

const getMessages = (setMessages) => {
    axios.get('https://sth8new1el.execute-api.eu-north-1.amazonaws.com/messages')
        .then(response => setMessages(response.data))
}

function MessagePage() {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getMessages(setMessages);
    }, []);

    return (
        <section className='messages-wrapper'>
            <h1 className='messages-header'>Anslagstavla</h1>
            <section>
                {
                    messages.map(message => {
                        return <article className='message-container' key={message.id}>
                            <p>{message.text}</p>
                            <h4>-{message.username}</h4>
                        </article>
                    })
                }
            </section>
        </section>
    )
}

export default MessagePage
