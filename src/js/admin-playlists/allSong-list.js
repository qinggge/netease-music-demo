{
    let view = {
        el: '#songs',
        template: `
            <ul class="songList">
            </ul>
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template)
            let songs = data
            let liList = songs.map((song)=> {
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
            songs:[],
            selectedSongId: undefined,
            selectStatus: false
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id:song.id, ...song.attributes}
                })
                return songs
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.getSongs()
            this.bindEvents()
        },
        getSongs(){
            this.model.find().then(()=>{
                this.view.render(this.model.data.songs)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                $(e.currentTarget).addClass('active').siblings('.active').removeClass('active')
                let songId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectedSongId = songId
                this.model.data.selectStatus = true
                window.eventHub.emit('selectSong',[JSON.parse(JSON.stringify(this.model.data.selectedSongId)),this.model.data.selectStatus])
            })
        }
    }
    controller.init(view,model)
}