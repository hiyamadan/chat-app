const socket = io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFomButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('Messages',(msg)=>{
    console.log(msg);
    const html = Mustache.render(messageTemplate,{message:msg})
    $messages.insertAdjacentHTML('beforeend',html)
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
