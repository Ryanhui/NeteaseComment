import React, { Component } from 'react';

export default class Dialog extends Component{
	constructor(props){
		super(props)
		this.state = {
			isDisplay: 'none'
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			isDisplay: nextProps.isDisplay
		})
	}

	closeDialog() {
		this.setState({
			isDisplay: 'none'
		})
	}

	setUserInfo(islogin,nickname,avatarUrl) {
		let myPromise = new Promise((res) => {
			localStorage.setItem('islogin',islogin)
			localStorage.setItem('nickname',nickname)
			localStorage.setItem('avatarUrl',avatarUrl)
			res()
		})
		myPromise.then(() => {
			this.props.reFreshUserInfo()
			console.log(localStorage.getItem('islogin'))
			this.closeDialog()
		})
	}

	render(){
		return (
			<div className="logout_dialog" style={{display:this.state.isDisplay}}>
				<button className="dialog_close_button" onClick={()=>{this.closeDialog()}}>X</button>
				<button className="logout_button" onClick={()=>{this.setUserInfo(false, '网易云账号登陆', 'http://p1.music.126.net/_gPNCeKtZczi3cdWkxCCPQ==/3264450033699913.jpg')}}>退出登录</button>
			</div>
		)
	}
}
