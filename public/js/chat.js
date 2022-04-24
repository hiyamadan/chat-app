const socket = io()

socket.on('Messages',(msg)=>{
    console.log(msg);
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const message = document.querySelector('input').value
    console.log('Message sent!');
    socket.emit('newMessage',message)
})
