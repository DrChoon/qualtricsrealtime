Qualtrics.SurveyEngine.addOnReady(function() {
    const socket = io("https://qualtrics-pairing-backend.onrender.com");
    const dyadId = "${e://Field/dyadId}"; 
    const myRole = "${e://Field/role}";

    // 1. Join the specific room for this pair
    socket.emit("join_room", dyadId);

    // 2. Listen for incoming messages
    socket.on("receive_message", function(data) {
        const display = document.getElementById('chat-display');
        const newMessage = document.createElement('div');
        newMessage.innerHTML = `<b>${data.role}:</b> ${data.text}`;
        display.appendChild(newMessage);
        display.scrollTop = display.scrollHeight; // Auto-scroll
    });

    // 3. Send message on button click
    document.getElementById('send-btn').onclick = function() {
        const text = document.getElementById('chat-input').value;
        socket.emit("send_message", { dyadId, role: myRole, text });
        document.getElementById('chat-input').value = '';
    };
});