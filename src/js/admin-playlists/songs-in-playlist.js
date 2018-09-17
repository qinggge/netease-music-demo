{
    let view = {
        el: '#songsInPlaylist',
        template:`
            <ul class="songList">
            </ul>
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template)
            let songs = data
            let liList = songs.map((song)=>{
                console.log(song)
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
            songs:[],
            allSongs:[]
        },
        find(playlistId){
            var songList = []
            this.data.songs = []
            var Playlist = AV.Object.createWithoutData('playList', playlistId);
            var query = new AV.Query('PlaylistMap');
            query.equalTo('playlist', Playlist);
            return query.find().then((PlaylistMaps)=>{
                PlaylistMaps.forEach( (scm, i, a)=>{
                    var song = scm.get('song')
                    songList.push(song.id)
                });
            }).then(()=>{
                var query = new AV.Query('Song');
                query.containedIn('objectId',songList)
                return query.find().then((songs)=>{
                    this.data.songs =  songs.map((song)=>{
                        return {id:song.id, ...song.attributes}
                    })
                    return songs
                })
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEventHub()
        },
        getSongs(playlistId){
            this.model.find(playlistId).then(()=>{ 
                this.view.render(this.model.data.songs)
            })
        },
        bindEventHub(){
            window.eventHub.on('songsInList',(playlistId)=>{
                this.getSongs(playlistId)
            })
        }
    }
    controller.init(view,model)
}