    {
        let view = {
            el: '.playlistForm-wrapper',
            init(){
                this.$el = $(this.el)
                this.$form = this.$el.find('form')
            },
            render(data = {}){
                let name = document.querySelector('input[name="name"]')
                let summary = document.querySelector('textarea[name="summary"]')
                let cover = document.querySelector('input[name="cover"]')
                $(name).val(data.name)
                $(summary).val(data.summary)
                $(cover).val(data.cover)
            },
            reset(){
                this.render({})
            }

        }
        let model = {
            data:{
                playlists: []
            },
            update(data){
                var playlist = AV.Object.createWithoutData('Playlist', this.data.id)
                playlist.set('name',data.name)
                playlist.set('summary',data.summary)
                playlist.set('cover',data.cover)
                return playlist.save().then((response)=>{
                    Object.assign(this.data,data)
                    return response
                })
            },
            create(data){
                var Playlist =  AV.Object.extend('Playlist')
                var playlist = new Playlist()
                playlist.set('name',data.name)
                playlist.set('summary',data.summary)
                playlist.set('cover',data.cover)
                return playlist.save().then((newPlaylist) => {
                    let {
                        id,
                        attributes
                    } = newPlaylist
                    Object.assign(this.data, {
                        id,
                        ...attributes
                    })
                }, (error) => {
                    console.error(error)
                })
            }
        }
        let controller = {
            init(view,model){
                this.view = view
                this.view.init()
                this.model = model
                this.view.render(this.model.data)

                this.bindEvents()
                this.bindEventHub()
            },
            create(){
                let needs ='name summary cover'.split(' ') 
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.create(data)
                    .then(() => {
                        this.view.reset()
                        let string = JSON.stringify(this.model.data)
                        let object = JSON.parse(string)
                        window.eventHub.emit('create', object)
                        console.log(123)
                    })
            },
            update(){
                let needs = 'name summary cover'.split(' ')
                let data = {}
                needs.map((string)=>{
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.update(data)
                    .then(()=>{
                        console.log(111)
                        window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
                    })
            },
            bindEvents(){
                this.view.$el.on('submit','form',(e)=>{
                    e.preventDefault();
                    if(this.model.data.id){
                        this.update()
                    }else{
                        this.create()
                    }
                })
            },
            bindEventHub(){
                window.eventHub.on('selecePlaylist',(data)=>{
                    this.model.data = data
                    this.view.render(this.model.data)
                })
            }
        }
        controller.init(view,model)
    }