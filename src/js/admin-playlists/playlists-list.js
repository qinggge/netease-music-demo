{
    let view = {
        el: '#playlists',
        template: `
            <ul class="playList">
            </ul>
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template)
            let {playlists,selectedePlaylistId} = data
            let liList = playlists.map((playlist)=>{
                let $li = $(`<li data-playlist-id="${playlist.id}">
                            <img src="${playlist.cover}">
                            <p>${playlist.name}</p>
                            <p class="summary">${playlist.summary}</p>
                        </li>`)
                if(playlist.id === selectedePlaylistId){
                    $li.addClass('active')
                }
                return $li
            })
            $el.find('ul').empty()
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
        }
    }
    let model = {
        data: {
            playlists: [],
            songs:[],
            selectedePlaylistId: undefined,  
        },
        find(){
            var query = new AV.Query('Playlist')
            return query.find().then((playlists)=>{
                this.data.playlists = playlists.map((playlist)=>{
                    return {id:playlist.id, ...playlist.attributes}
                })
                return playlists
            })
        },
        findSongsInList(playlistId){
            // 微积分课程
            var songList = []
            this.data.songs = []
            var Playlist = AV.Object.createWithoutData('playList', playlistId);
            
            // 构建 StudentCourseMap 的查询
            var query = new AV.Query('PlaylistMap');
            
            // 查询所有选择了线性代数的学生
            query.equalTo('playlist', Playlist);
            
            // 执行查询
            query.find().then((PlaylistMaps)=>{
                // studentCourseMaps 是所有 course 等于线性代数的选课对象
                // 然后遍历过程中可以访问每一个选课对象的 student,course,duration,platform 等属性
                PlaylistMaps.forEach( (scm, i, a)=>{
                    var song = scm.get('song')
                    songList.push(song.id)
                });
            }).then(()=>{
                var query = new AV.Query('Song');
                for(let i = 0;i<songList.length;i++){
                    query.get(songList[i]).then((songs)=>{
                        this.data.songs.push(songs)
                    }, function (error) {
                        console.log(error)
                    })
                }
            }).then(()=>{
                window.eventHub.emit('songsInList',this.data.songs)
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.bindEvents()
            this.bindEventHub()
            this.getAllPlaylists()
        },
        getAllPlaylists(){
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                let playlistId = e.currentTarget.getAttribute('data-playlist-id')
                this.model.data.selectedePlaylistId = playlistId
                this.view.render(this.model.data)
                let data
                let playlists = this.model.data.playlists
                for(let i = 0;i<playlists.length;i++){
                    if(playlists[i].id === playlistId){
                        data = playlists[i]
                        break
                    }
                }
                window.eventHub.emit('selecePlaylist',JSON.parse(JSON.stringify(data)))
                this.model.findSongsInList(playlistId)
            })
        },
        bindEventHub(){
            window.eventHub.on('create', (playlistData) => {
                this.model.data.playlists.push(playlistData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('update',(playlist)=>{
                let playlists = this.model.data.playlists
                for(let i = 0; i<playlists.length; i++){
                    if(playlists[i].id === playlist.id){
                        Object.assign(playlists[i], playlist)
                    }
                }
                console.log(this.model.data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}
// // 微积分课程
// var Playlist = AV.Object.createWithoutData('playList', '5b93982f17d0090034c73eec');

// // 构建 StudentCourseMap 的查询
// var query = new AV.Query('PlaylistMap');

// // 查询所有选择了线性代数的学生
// query.equalTo('playlist', Playlist);

// // 执行查询
// query.find().then(function (PlaylistMaps) {
//     // studentCourseMaps 是所有 course 等于线性代数的选课对象
//     // 然后遍历过程中可以访问每一个选课对象的 student,course,duration,platform 等属性
//     PlaylistMaps.forEach(function (scm, i, a) {
//         var playlist = scm.get('playlist');
//         var author = scm.get('author')
//         console.log(author)
//     });
// });


// 构建关系表
// var Playlist = AV.Object.createWithoutData('playList', '5b93a0311b69e6005b52855d')

// var Song = AV.Object.createWithoutData('Song', '5b8f04e467f35600349a2f67')

// var PlaylistMap = new AV.Object('PlaylistMap');

// PlaylistMap.set('author', Song)
// PlaylistMap.set('playlist', Playlist)

// PlaylistMap.save()