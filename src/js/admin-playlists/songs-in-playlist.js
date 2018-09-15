{
    let view = {
        el: '#songsInPlaylist',
        templaet:`
            <ul class="songList">
            </ul>
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template)
            let {songs} = data
            let liList = songs.map((song)=>{
                let $li = $('<li></li>').text(song.name).attr('data-songInList-id',song.id)
                $li.addClass('active') 
                return $li
            })
            $el.find('ul').empty()
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
        }
    }
    let model = {
        data:{
            songs:[]
        }

    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('songsInList',(data)=>{
                this.model.data.songs = data
                this.view.render(this.model.data.songs)
            })
        }
    }
    controller.init(view,model)
}