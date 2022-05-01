const socket = io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFomButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username,room} = Qs.parse(location.search,{ ignoreQueryPrefix : true})
socket.on('Messages',(msg)=>{
    console.log(msg);
    const html = Mustache.render(messageTemplate,{
        username: msg.username,
        message:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm a')
        })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(msg)=>{
    console.log(msg);
    const html = Mustache.render(locationTemplate,{
        username: msg.username,
        url : msg.url,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    //disable
    $messageFomButton.setAttribute('disabled','disabled')
    
    const message = e.target.elements.message.value
    
    socket.emit('newMessage',message,(error)=>{
        //enable
        $messageFomButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()       //move cursor inside 

        if(error)
        {
            return console.log(error);
        }
        console.log('The message was Delivered.');
    })
})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared!');
        })
    })
    
    
})
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }

})
