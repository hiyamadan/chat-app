const socket = io()

socket.on('Messages',(msg)=>{
    console.log(msg);
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const message = e.target.elements.message.value
    console.log('Message sent!');
    socket.emit('newMessage',message)
})

document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
    
    
})
