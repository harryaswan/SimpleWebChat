
const start = () => {
    const form = document.querySelector('form');
    const message_list = document.querySelector('#messages_list');
    const textbox = document.querySelector('#textbox');
    const socket = io();

    const findConversation = (message) => {
        let conversation = document.querySelector('form#\\' + message.sender.id);
        if (!conversation) {
            conversation = addConversation(message);
        }
        return conversation;
    }

    const addConversation = (message) => {
        let new_conversation = document.createElement('form');
        new_conversation.setAttribute('id', message.sender.id);
        new_conversation.innerHTML = "<p>Conversation with User "+message.sender.id+"</p><ul class='messages_list'></ul><input type='text' class='textbox' />";
        document.querySelector('body').appendChild(new_conversation);
        new_conversation.onsubmit = (e) => {
            e.preventDefault();
            let textbox = new_conversation.querySelector('.textbox');
            let new_message = formatMsg(textbox.value);
            addMessage(new_conversation, new_message.message, true);
            socket.emit('send_chat_message', new_message);
            textbox.value = '';
        }
        return new_conversation;
    }

    const addMessage = (conversation, msg, user_present) => {
        let li = document.createElement('li');
        if (!user_present) {
            li.setAttribute('style', 'color: blue;');
        }
        li.innerText = JSON.stringify(msg.content);
        conversation.querySelector('.messages_list').appendChild(li);
    }

    const formatMsg = text => {
        let tmp_msg = {
            message: {
                content: text,
                sender: {
                    id: 1,
                    channel_type: 'gecko-chat'
                },
                recipient: {
                    id: 2,
                    channel_type: 'facebook',
                    meta: {
                        facebook_id: 1417851894921344
                    }
                }
            }
        };

        return tmp_msg;
    };

    socket.on('recieve_chat_message', (msg) => {
        console.debug('msg', msg);
        let conversation = findConversation(msg);
        addMessage(conversation, msg, false);
    });

};

window.onload = start;
