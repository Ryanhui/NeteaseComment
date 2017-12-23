import React, { Component } from 'react';

export default class Player extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			isPlaying: false,
			playerCurrentTime: 0,
			buttonClassName:'play_button_play',

			likeSong: false,
			likeSongClass:'unlike',

			firstPlay: true,
			playSongId: 186016,
			songLength: 269,
			songInfo: {"songs":[{"name":"晴天","id":186016,"pst":0,"t":0,"ar":[{"id":6452,"name":"周杰伦","tns":[],"alias":[]}],"alia":[],"pop":100.0,"st":0,"rt":"600902000006889364","fee":8,"v":94,"crbt":"e93f07bd4132712ecec16f1a2eb473a6","cf":"","al":{"id":18905,"name":"叶惠美","picUrl":"http://p1.music.126.net/yjVbsgfNeF2h7fIvnxuZDQ==/18894007811887644.jpg","tns":[],"pic_str":"18894007811887644","pic":18894007811887644},"dt":269000,"h":{"br":320000,"fid":0,"size":10792855,"vd":-2.65076E-4},"m":{"br":160000,"fid":0,"size":5396480,"vd":-2.65076E-4},"l":{"br":96000,"fid":0,"size":3237930,"vd":-2.65076E-4},"a":null,"cd":"1","no":3,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":1,"s_id":0,"mst":9,"cp":1007,"mv":504177,"rtype":0,"rurl":null,"publishTime":1059580800000}],"privileges":[{"id":186016,"fee":8,"payed":0,"st":0,"pl":128000,"dl":0,"sp":7,"cp":1,"subp":1,"cs":false,"maxbr":999000,"fl":128000,"toast":false,"flag":0}],"code":200}
		};
	}

	componentWillReceiveProps(nextProps) {
		//console.log(this.props.playSongId)
		if(nextProps.playSongId !== this.props.playSongId){
			this.getSongInfo(nextProps.playSongId)

			this.setState({
				playSongId: nextProps.playSongId,
				isLikeSong: false,
				likeSongClass:'unlike'
			},() => {
				//console.log('换歌了:' + this.state.playSongId)
				this.playerStop()
				this.playerLoad(this.state.playSongId)
				this.initPlay()
				this.playerPlay()
			})
		}

	//console.log(this.props.canPlay)
	/*
			this.playControl.load();

			let canvas = this.playingCanvas; 	//清除进度条
			let ctx = canvas.getContext('2d');
	  		ctx.fillStyle = '#fff';
	  		ctx.fillRect(0, 10, 300, 3);

	  		let that = this;
	  		this.playControl.oncanplay = () => {
	  			that.playControl.play()
	  			that.setState({
					isPlaying: true,
					playerCurrentTime: 0,
					buttonClassName: 'play_button_pause',
					songLength: that.playControl.duration,
				})
	  		} 
	  */
		
	}
	componentDidMount() {
	
		var that = this;
		var canvas = this.playingCanvas;	//canvas 绘制进度条

		if (canvas.getContext) {
	  		
	  		function getMousePos(canvas, evt) {
	  			var rect = canvas.getBoundingClientRect();
	  			return {
	  				x: evt.clientX - rect.left,
	  				y: evt.clientY - rect.top
	  			};
	  		}

	  		let mousePos;
	  		let ctx = canvas.getContext('2d');
	  		
	  		ctx.fillStyle = 'rgba(255,255,255,0.9)';
	  		ctx.fillRect(0,10,300,3);

	  		function drawProgressBar(e) {
	  			mousePos = getMousePos(canvas,e);
	  			ctx.fillStyle = 'rgba(255,255,255,1)';
	  			ctx.fillRect(0,10,300,3);
	  			ctx.fillStyle = '#ff9500';
	  			ctx.fillRect(0,10,mousePos.x,3);
	  			that.setCurrentTime(mousePos.x * that.state.songLength / 300);	//根据拖动进度条和歌曲总长换算播放位置
	  		}

	  		canvas.addEventListener('mousedown',function(e){	//单击鼠标拖动触发事件
	  			drawProgressBar(e);
	  			canvas.onmousemove = function(e) {
	  				drawProgressBar(e);
	  			}
	  		})

	  		canvas.addEventListener('mouseup',function(e){ 	//结束单击取消事件
	  			canvas.onmousemove = null;
	  		})

	  		canvas.addEventListener('mouseout',function(e){ 	//拖动出canvas结束事件
	  			canvas.onmousemove = null;
	  		})

		} else {
			alert('请使用chrome或者Firefox等支持canvas的浏览器');
		}

		this.playControl.addEventListener('timeupdate',updateCurrentTime,false);	//监听播放进度更新
		function updateCurrentTime(e) {
			that.setState({
				playerCurrentTime:  Math.floor(that.playControl.currentTime)
			})

			let canvas = that.playingCanvas; 	//自动前进的进度条
			let ctx = canvas.getContext('2d');
	  		function autoProgressBar(time) {
	  			ctx.fillStyle = '#ff9500';
	  			ctx.fillRect(0, 10, 300 * time / that.state.songLength, 3);
	  		}
	  		autoProgressBar(that.state.playerCurrentTime);
		}

		this.playControl.addEventListener('ended',playingend,false);	//一首歌播放结束时恢复状态
		function playingend(e) {
			that.setState({
				isPlaying: false,
				playerCurrentTime: 0,
				buttonClassName: 'play_button_play'
			})
			let canvas = that.playingCanvas; 	//清除进度条
			let ctx = canvas.getContext('2d');
	  		ctx.fillStyle = '#fff';
	  		ctx.fillRect(0, 10, 300, 3);
		}
	}

	getSongInfo(id) {
		fetch("http://www.qinlab.net:3000/song/detail?ids="+id ,{
			 method: 'get'
		})
			.then(res => res.json())
			.then(
				(result) => {
					//console.log(result)
					this.setState({
						songInfo: result
					})
				},
				(error) => {
					//console.log(error)
				}
			)
	}
	initPlay(){
		let that = this

		this.playControl.onerror = () => {
			setTimeout(()=>{
				alert('音乐源失效了')
			},1000)	
		}
		this.playControl.removeEventListener('loadedmetadata', that.setSongLength)
		this.playControl.addEventListener('loadedmetadata', that.setSongLength.bind(this))
	}

	setSongLength(){
		this.setState({
			songLength: this.playControl.duration
		})
	}
	
	setCurrentTime(time) { 	//设置当前播放时间为给定值
		this.playControl.currentTime = time;
	}

	playerPlay() {
		this.setState({
			isPlaying: true,
			buttonClassName:'play_button_pause',
		},()=>{
			this.playControl.play()
		})
	}

	playerPause() {
		this.setState({
			isPlaying: false,
			buttonClassName:'play_button_play',
		},()=>{
			this.playControl.pause()
		})
	}

	playerStop() {
		this.playerPause()
		this.setCurrentTime(0)

		let canvas = this.playingCanvas; 	//清除进度条
		let ctx = canvas.getContext('2d');
	  	ctx.fillStyle = '#fff';
	  	ctx.fillRect(0, 10, 300, 3);
	}

	playerLoad(id) {
		this.playControl.src = "http://music.163.com/song/media/outer/url?id=" + id + ".mp3"
	}

	backgroundUrl() {
		return {
			backgroundImage:'url(' +  this.state.songInfo.songs[0].al.picUrl + ')',
			backgroundSize: 'contain'
		}
	}

    isLikeSong() {
    	if(localStorage.getItem("islogin") === 'true'){
        	//console.log(document.cookie)
    		let url = 'http://www.qinlab.net:3000/like?id='+this.state.playSongId+'&like='+!this.state.isLikeSong
    		fetch(url,{
    			method: 'GET',
    			credentials: 'include'
    		})
   			.then(res => res.json())
			.then(
				(result) => {
					//console.log(result)
					if(result.code !== 200){
						alert('登录失效，请退出后重新登录')
						return
					}
					changeIslikeClass.bind(this)()

				},
				(error) => {
					//console.log(error)
					alert('请尝试退出重新登录')
				}
			)
			function changeIslikeClass() {
				if(!this.state.isLikeSong) {
					this.setState({
	    				isLikeSong: true,
	 					likeSongClass: "like"   		
    				})
				}else{
					this.setState({
    					isLikeSong: false,
 						likeSongClass: "unlike"   		
    				})
				}
			}
    	}else{
    		alert('请登录')
    	}

    }
	render() {
		return (
			<div className="player">
				<div className="panel" style={ this.backgroundUrl() }>
					<div className="bottom_cover"></div>
					<div className="left_blurry"></div>
					<div className="left_cover">
						<div className="playing_song">
							<p style={{ fontSize: '30px' }}>{this.state.songInfo.songs[0].name}</p>
							<p>{this.state.songInfo.songs[0].ar[0].name}</p>
						</div>
						<div className="play_control">
							<button className={this.state.buttonClassName} onClick={ () => {if(this.state.isPlaying){this.playerPause()}else{this.playerPlay()}}}></button>

							<audio ref={(target) => { this.playControl = target; }} src={"http://music.163.com/song/media/outer/url?id=" + 186016 + ".mp3"}>
								
							</audio>
							<p className="timePlayed">{ ('00'+Math.floor(this.state.playerCurrentTime/60)).slice(-2)+':'+('00'+Math.floor(this.state.playerCurrentTime % 60)).slice(-2) }</p>
							<p className="songLength">{ ('00'+Math.floor(this.state.songLength/60)).slice(-2)+':'+('00'+Math.floor(this.state.songLength % 60)).slice(-2) }</p>
							
							<canvas className="progress_bar" ref={(target) => {this.playingCanvas = target}} width="300" height="20"></canvas>
						</div>
					</div>
					<div className="heart">
						<button className={this.state.likeSongClass} onClick={() => this.isLikeSong() }>like</button>
					</div>
				</div>
			</div>
		)
	}
}