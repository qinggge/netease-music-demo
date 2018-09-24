{
    let view ={
        el: 'section.playlists',
        template: `
        <li>
            <a href="playlist.html?id={{playlist.id}}">
                <div class="cover">
                    <img width=105 src="{{playlist.cover}}" alt="封面">
                </div>
                <p>{{playlist.name}}</p>
            </a>
        </li>
        `,
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {playlists} = data
            playlists.map((playlist)=>{
                let $li = $(this.template
                    .replace('{{playlist.cover}}',playlist.cover)
                    .replace('{{playlist.name}}',playlist.name)
                    .replace('{{playlist.id}}',playlist.id)
                )
                this.$el.find('ol.songs').append($li)
            })
        }
    }
    let model ={
        data:{
            playlists: []
        },
        find(){
            var query = new AV.Query('Playlist');
            return query.find().then((songs)=>{
                this.data.playlists = songs.map((song)=>{
                    return Object.assign( {id:song.id},song.attributes)
                })
                return songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}