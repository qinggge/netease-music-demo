{
    let view = {
        el: '#playlist-info',
        template:`
        `,
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let playlist = data
            this.$el.find('.plhead_bg').css('background-image',`url('${playlist.cover}')`)
            this.$el.find('img.u-img').attr('src',`${playlist.cover}`)
            this.$el.find('h2.f-thide2').text(`${playlist.name}`)
            this.$el.find('div.f-brk > span > i').text(`简介：${playlist.summary}`)
        }
    }
    let model = {
        data: {
            playlist: []
        },
        get(id){
            var query = new AV.Query('Playlist')
            return query.get(id).then((playlist)=>{
                Object.assign(this.data.playlist,Object.assign({id:playlist.id},playlist.attributes))
                return playlist
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            let id = this.getPlaylistId()
            this.model.get(id).then(()=>{
                this.view.render(this.model.data.playlist)
            })

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
            return id
        }
    }
    controller.init(view,model)
}