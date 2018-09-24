{
    let view = {
        el: '#playlist-songs',
        template: `
            <li class="u-song">
                <div class="sgi_fl">{{index}}</div>
                <div class="sgi_fr f-bd f-bd-btm">
                    <div class="sgich_fl">
                        <div class="f-thide sgich_tl">
                            {{song.name}}
                        </div>
                        <div class="f-thide sgich_info">
                            {{song.singer}}
                        </div>
                    </div>
                    <div class="sgich_fr">
                        <a class="u-hmsprt sgich_ply" href="./song.html?id={{song.id}}"></a>
                    </div>
                </div>
            </li>
        `,
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {songs} = data
            songs.map((song,index)=>{
                console.log(song)
                let $li = $(this.template
                .replace('{{index}}',index+1)
                .replace('{{song.name}}',song.name)
                .replace('{{song.singer}}',song.singer)
                .replace('{{song.id}}',song.id)
            )
                this.$el.find('ol.u-songs').append($li)
            })
        }
    }
    let model = {
        data:{
            songs:[],
            playlistId: undefined
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
            this.view.init()
            this.model = model
            this.getPlaylistId()

        },
        getPlaylistId(){
            let search = window.location.search
            if(search.indexOf('?') === 0){
                search = search.substring(1)
            }
            
            let array = search.split('&').filter((v=>v))
            let id = ''
            
            for(let i = 0;i<array.length;i++){
                let kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if(key === 'id'){
                    id = value
                    break
                }
            }
            this.model.data.playlistId = id
            this.model.find(id).then(()=>{
                this.view.render(this.model.data)
            })
            return id
        }
    }
    controller.init(view,model)
}