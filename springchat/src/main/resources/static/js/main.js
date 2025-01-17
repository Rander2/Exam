'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var filterForm = document.querySelector('#filterForm');
var filterInput = document.querySelector('#filter');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim();

    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {

    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.subscribe('/topic/public2', onMessageReceived2);

    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function sendMessage2(event) {
    var messageContent = filterInput.value.trim();

    if(messageContent && stompClient) {
        var filterMessage = {
            sender: username,
            content: filterInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendFilter", {}, JSON.stringify(filterMessage));
        filterInput.value = '';
    }
    event.preventDefault();
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function onMessageReceived2(payload){
    console.log("Hi!" + payload.body);
    var message = JSON.parse(payload.body);
    var url = '/messages/'+message.content;
    window.open(url);
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    console.log("HELLO!" + payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);
        var usernameElement = document.createElement('span');

        if(message.reply == null){
            var usernameText = document.createTextNode(message.sender);
        }
        else
        {
            var usernameText = document.createTextNode(message.sender + " replied to message #" + message.reply);
        }

        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);

    }
    if (message.type !== 'JOIN' && message.type !== 'LEAVE') {
        var textElement = document.createElement('p');
        var textElement2 = document.createElement('p');
        var messageText = document.createTextNode("#" + message.id + " - " + message.date +'\n' );
        var messageText2 = document.createTextNode(message.content);
        textElement.appendChild(messageText);
        textElement2.appendChild(messageText2);
        messageElement.appendChild(textElement);
        messageElement.appendChild(textElement2);
    }
    else
    {
        var textElement = document.createElement('p');
        var messageText = document.createTextNode( message.content);
        textElement.appendChild(messageText);
        messageElement.appendChild(textElement);

    }

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true)
filterForm.addEventListener('submit', sendMessage2, true)
messageForm.addEventListener('submit', sendMessage, true)
