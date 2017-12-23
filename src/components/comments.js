import React, { Component } from 'react';

export default class Comments extends Component {

	constructor(props){
		super(props);
		this.state = {
			error: null,
			song: {commentString: "DLcamry:「 [色] 」", songId: 186016}
		}
		this.fetchNextSong = this.fetchNextSong.bind(this)
		this.transferNextSongToParent = this.transferNextSongToParent.bind(this)
		this.fetchPreSong = this.fetchPreSong.bind(this)
		this.transferPlaySongIdToParent = this.transferPlaySongIdToParent.bind(this)
	}

	fetchNextSong(){
		this.setState ({
			comment: '...'
		})

		if(this.props.canFetchNewSong === true) {

			function startFetch(songId) {
				fetch("http://www.qinlab.net:3000/comment/music?id=" + songId + "&limit=1",{
					method: 'GET'
				})
				.then(res => res.json())
				.then(
					(result) => {
						//console.log(result)
						if(result.hotComments){
							let commentString 
							try {
							  commentString = result.hotComments[0].user.nickname + ":「 " + result.hotComments[0].content + " 」"
							}
							catch(e) {
								this.fetchNextSong()
								return
							}
							that.transferNextSongToParent(commentString,songId)
							that.setState({
								song: {"commentString": commentString, "songId": songId},
							});
						}else{
							that.fetchNextSong()
						}
					},
					(error) => {
						alert("服务器连接失败")
						that.setState({
							error
						});
					}
				)			
			}

			let that = this;

			fetch("http://www.qinlab.net:3000/getasong?getone=1&timestamp="+ Date.parse(new Date()), {
				method: 'GET'
			})
			.then(res => res.json())
			.then(
				(result) => {
					//console.log(result)
					startFetch(result.id)
				}
			)
			
		}else{
			this.setState({
				song: this.props.curSong,
			})
			this.props.funCanFetchNewSong(true)
		}	
	}

	fetchPreSong(){
		if(this.props.preSong && this.props.canFetchNewSong === true) {
			this.setState({
				song: this.props.preSong,
			})
			this.props.funCanFetchNewSong(false)
		}else{
			alert('那些已经离你太远')
		}

	}

	transferNextSongToParent(commentString,musicId){
		this.props.transferMsg(commentString,musicId)
	}

	componentDidMount() {
		this.fetchNextSong()
	}

	transferPlaySongIdToParent(){
		this.props.funPlaySongId(this.state.song.songId)
		//console.log(this.state.song.songId)
	}

	render() {
		return (
			<div className="comments">

				<div className="comment_content">
					<p>{this.state.song.commentString}</p> 
				</div>
				<div className="comment_button">
					{/* ie下恢复状态 onClick="this.blur(); return false;" */}
					<button className="pre_btn"  onClick={this.fetchPreSong}>上一条</button>
					<button className="play_btn" onClick={this.transferPlaySongIdToParent}>播放</button>
					<button className="next_btn" onClick={this.fetchNextSong}>下一条</button>
				</div>
			</div>
		)
	}
}