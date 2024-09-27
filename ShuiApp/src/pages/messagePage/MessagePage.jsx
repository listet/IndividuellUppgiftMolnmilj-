import axios from 'axios'
import { useState, useEffect } from 'react'
import writeMessageIcon from '../../assets/writemessage.png'
import logo from '../../assets/logoShui.png'
import deletemessageIcon from '../../assets/cross.png'
import changemessageIcon from '../../assets/pen.png'
import './messagePage.css'
import { Link } from 'react-router-dom'

//Hämtar meddelanden
const getMessages = async () => {
    try {
        const response = await axios.get('https://sth8new1el.execute-api.eu-north-1.amazonaws.com/messages');
        return response.data;
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};

//Formaterar datum/tid
const formatDate = (dateString) => {
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

//Tar bort meddelande via ID och updaterar Messages
const deleteMessage = async (id, setMessages, messages) => {
    try {
        await axios.delete(`https://sth8new1el.execute-api.eu-north-1.amazonaws.com/messages/${id}`);
        setMessages(messages.filter(message => message.pk !== id));
    } catch (error) {
        console.error("Error deleting message:", error);
    }
};


function MessagePage() {
    const [messages, setMessages] = useState([]);
    const [allMessages, setAllMessages] = useState([]);
    const [sortOrder, setSortOrder] = useState('');
    const [searchUsername, setSearchUsername] = useState('');

    //Vid första rendering kallas alla meddelanden, läggs in i setMessages och sorteras
    useEffect(() => {
        getMessages().then(fetchedMessages => {
            setMessages(fetchedMessages);
            //AllMessages behövs för att kunna göra nya sökningar på alla meddelanden efter första sökning är gjord
            setAllMessages(fetchedMessages);
            sortMessages('desc', fetchedMessages);
        });
    }, []);

    //Sorterar meddelanden efter datum/tid 
    const sortMessages = (order, messagesToSort = messages) => {
        // Kopierar arrayen och sorterar efter datum stigande alt. fallande
        const sorted = [...messagesToSort].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setMessages(sorted);
        setSortOrder(order);
    };

    //Hanterar sökning av användarnamn
    const handleSearch = (e) => {
        e.preventDefault();
        const filteredMessages = allMessages.filter(message =>
            message.username.toLowerCase().includes(searchUsername.toLowerCase())
        );
        setMessages(filteredMessages);
    };

    return (
        <section className='messages-wrapper'>
            <Link aria-label='Navigate to MessagePage' to="/MessagePage"
                onClick={() => {
                    setSearchUsername(''); // Återställer sökningen
                    getMessages().then(fetchedMessages => {
                        sortMessages(fetchedMessages); // Sorterar och uppdaterar meddelanden
                    });
                    window.location.reload();
                }}>
                <img className='logo' src={logo} alt="logo" />
            </Link>
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
                <form onSubmit={handleSearch}>
                    <p>Sök efter användare:</p>
                    <input
                        className='sort-input'
                        type="text"
                        value={searchUsername}
                        onChange={(e) => setSearchUsername(e.target.value)}
                    />
                    <button className='sort-button' type="submit">Sök</button>
                </form>
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
                                        onClick={() => deleteMessage(message.pk, setMessages, messages)}
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
