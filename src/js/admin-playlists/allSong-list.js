{
    let view = {
        el: '#songs',
        render(data){
            let $el = $(this.el)
            $el.html(this.template)
            let songs = data
            let liList = songs.map((song)=> {
                console.log(song)
                let $li = $('<li></li>').text(song.name).attr('data-song-id',song.id)
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
        },
        findSongs(){
            var query = new AV.Query('Song');
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id:song.id, ...song.attributes}
                })
                this.data.songs = songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.getSongs()
        },
        getSongs(){
            this.model.findSongs().then(()=>{
                this.view.render(this.model.data.songs)
            })
        }
    }
    controller.init(view,model)
}