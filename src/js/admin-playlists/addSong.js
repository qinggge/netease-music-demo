{
    let view = {
        el: '#addToList > button'
    }
    let model = {
        data: {
            songId: undefined,
            selectStatus: false,
            playlistId: undefined
        },
        addSongToList(songId,listId){
            let playlist = AV.Object.createWithoutData('playList', listId)
            let song = AV.Object.createWithoutData('Song', songId)
            let map = new AV.Object('PlaylistMap')
            map.set('playlist',playlist)
            map.set('song',song)
            map.save().then(()=>{
                window.eventHub.emit('addSongToList',JSON.parse(JSON.stringify(listId)))
            })

        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEventHub()
            this.bindEvent()
        },
        bindEvent(){
            $(this.view.el).on('click',()=>{
                if(this.model.data.songId && this.model.data.selectStatus && this.model.data.playlistId){
                    this.model.addSongToList(this.model.data.songId,this.model.data.playlistId)
                }else if(!this.model.data.songId){
                    alert('请选中一首歌曲！')
                }else{
                    alert('请选中一个歌单！')
                }
            })
        },
        bindEventHub(){
            window.eventHub.on('selectSong',(arr)=>{
                this.model.data.songId = arr[0]
                this.model.data.selectStatus = arr[1]
            })
            window.eventHub.on('songsInList',(data)=>{
                this.model.data.playlistId = data
            })
        }
    }
    controller.init(view,model)
}