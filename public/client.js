let session;
const url = new URL(window.location.href);
const roomName = url.pathname.split("/")[3];
const userName = url.searchParams.get("username");
const userType = url.searchParams.get("type");

fetch(location.pathname, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: userName, type: userType })
})
  .then(res => {
    return res.json();
  })
  .then(res => {
    const apiKey = res.apiKey;
    const sessionId = res.sessionId;
    const token = res.token;
    const streamName = res.streamName;
    initializeSession(apiKey, sessionId, token, streamName);
  })
  .catch(handleCallback);

getChatHistory();
registerListeners();

function initializeSession(apiKey, sessionId, token, streamName) {
  // Create a session object with the sessionId
  session = OT.initSession(apiKey, sessionId);
  
  if (userType === 'participant') {
    // Create a publisher
    const publisher = OT.initPublisher(
      "publisher",
      {
        insertMode: "append",
        width: "100%",
        height: "100%",
        name: streamName
      },
      handleCallback
    );
    
    // Connect to the session
    session.connect(token, error => {
      // If the connection is successful, initialize the publisher and publish to the session
      if (error) {
        handleCallback(error);
      } else {
        session.publish(publisher, handleCallback);
      }
    });
  } else {
    // Connect to the session as a viewer
    session.connect(token, error => handleCallback(error));
  }

  initiateSessionListeners(session);
}

function initiateSessionListeners(session) {
  // Subscribe to a newly created stream
  session.on("streamCreated", event => {
    session.subscribe(
      event.stream,
      "subscriber",
      {
        insertMode: "append",
        width: "100%",
        height: "100%",
        name: event.stream.name
      },
      handleCallback
    );
  });

  session.on("signal:msg", event => {
    const content = event.data;
    updateChat(content);
  });
}

function getChatHistory() {
  fetch(`/messages/${roomName}`)
    .then(res => {
      return res.json();
    })
    .then(res => {
      const messageArea = document.getElementById("messageArea");
      res.messagesArray.forEach(message => {
        console.log(message);
        const msg = document.createElement("p");
        msg.textContent = `${message.user}: ${message.content}`;
        messageArea.appendChild(msg);
      });
      messageArea.scroll({
        top: messageArea.scrollHeight,
        behavior: "smooth"
      });
    })
    .catch(handleCallback);
}

function saveMessage(content) {
  const message = {
    _id: Date.now().toString(),
    content: content,
    roomName: roomName,
    user: userName
  };

  fetch("/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  }).catch(handleCallback);
}

function updateChat(content) {
  const msgHistory = document.getElementById("messageArea");
  const msg = document.createElement("p");
  msg.textContent = content;
  msgHistory.appendChild(msg);
  msgHistory.scroll({
    top: msgHistory.scrollHeight,
    behavior: "smooth"
  });
}

function registerListeners() {
  showChatListener();
  messageListener();
  closeChatListener();
}

function messageListener() {
  const chat = document.getElementById("chatForm");
  const msgTxt = document.getElementById("chatInput");
  chat.addEventListener(
    "submit",
    event => {
      event.preventDefault();
      console.log(session);
      session.signal(
        {
          type: "msg",
          data: `${session.connection.data.split("=")[2]}: ${msgTxt.value}`
        },
        () => {
          saveMessage(msgTxt.value);
          msgTxt.value = "";
        }
      );
    },
    false
  );
}

function showChatListener() {
  const button = document.getElementById("showChat");
  button.addEventListener(
    "click",
    event => {
      const chatWindow = document.getElementById("chatWindow");
      chatWindow.classList.toggle("active");
    },
    false
  );
}

function closeChatListener() {
  const button = document.getElementById("closeChat");
  button.addEventListener(
    "click",
    event => {
      const chatWindow = document.getElementById("chatWindow");
      chatWindow.classList.remove("active");
    },
    false
  );
}

function handleCallback(error) {
  if (error) {
    console.log("error: " + error.message);
  } else {
    console.log("callback success");
  }
}
