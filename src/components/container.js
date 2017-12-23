import React, { Component } from 'react';
import Comment from './comments.js'
import Player from './player.js'

export default class Container extends Component {

	constructor(props){
		super(props)
		this.state = {
			preSong: null,
			curSong: null,
			canFetchNewSong: true,
			
			playSongId: 186016,
			canPlay: false
		}
		this.funPlaySongId = this.funPlaySongId.bind(this)
	}

	transferMsg(commentString, songId) {

		this.setState({
			preSong: this.state.curSong,
			curSong: {"commentString": commentString, "songId": songId}
		});
	}

	funCanFetchNewSong(argv){
		this.setState({
			canFetchNewSong: argv
		})
	}

	funPlaySongId(id){
		this.setState({
			playSongId: id
		})
	}

	render() {
		return (
			<div className="container">
				<Comment funPlaySongId={(id) => this.funPlaySongId(id)} funCanFetchNewSong={(argv) => this.funCanFetchNewSong(argv)} transferMsg={(commentString,songId) => this.transferMsg(commentString, songId)} preSong = {this.state.preSong} curSong = {this.state.curSong} canFetchNewSong = {this.state.canFetchNewSong}/>
				<Player playSongId={this.state.playSongId} />
			</div>
		)
	}
}