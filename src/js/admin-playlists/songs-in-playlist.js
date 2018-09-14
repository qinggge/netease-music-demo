{
    let view = {
        el: '#songsInPlaylist',
        templaet:`
            <ul class="songList">
            </ul>
        `,
        render(data){
            
        }
    }
    let model = {
        data:{
            songs:[]
        },
        getData(){
            window.eventHub.on('songsInList',(data)=>{
                console.log(data)
            })
        }

    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.model.getData()
            
        },
        bindEventHub(){
        }
    }
    controller.init(view,model)
}