import React, { Component } from 'react';
import Logindialog from './logindialog.js'
import Logoutdialog from './logoutdialog.js'

export default class Header extends Component {
	constructor(props){
		super(props);
		this.state = {
			isLogin: false,
			nickname: '惠氏集团挖坑手',
			avatarUrl: '',
			isDisplayLoginDialog: 'none',
			isDisplayLogoutDialog: 'none'
		}
		this.getLocalStotage = this.getLocalStotage.bind(this)
		
	}

	componentDidMount(){
		this.getLocalStotage()
		//console.log('localStorage: '+localStorage.getItem('islogin'))
		setTimeout(()=>{
			//console.log('state: '+this.state.isLogin)
		},1000)
	}

	funIsDisplayLoginDialog(argv) {
		this.setState({
			isDisplayLoginDialog: argv
		})
	}
	funIsDisplayLogoutDialog(argv) {
		this.setState({
			isDisplayLogoutDialog: argv
		})
	}
	reFreshUserInfo() {
		this.getLocalStotage()
		this.setState({
			isDisplayLoginDialog: 'none',
			isDisplayLogoutDialog: 'none'
		})
	}

	getLocalStotage(){
		this.setState({
			isLogin: localStorage.getItem("islogin"),
			nickname: localStorage.getItem('nickname'),
			avatarUrl: localStorage.getItem('avatarUrl')
		})
	}

	whichDialogToShow(){
		
		//console.log('点击时：'+this.state.isLogin)
		if(this.state.isLogin === 'true'){
			
			return this.funIsDisplayLogoutDialog('block')
		}
		if(this.state.isLogin === 'false'){
			return this.funIsDisplayLoginDialog('block')
		}
		return this.funIsDisplayLoginDialog('block')
	}

	render() {
		return (
			<div className="header">
				<div className = "logo"><span className="red">网易云</span>评论</div>
				<div className = "login">
					<img className="avatar" alt="" src={this.state.avatarUrl}></img>
					<button className="login_btn" onClick = { ()=> { this.whichDialogToShow() }}>{this.state.isLogin ? this.state.nickname : '网易云账号登陆' }</button>
				</div>
				<Logindialog isDisplay = {this.state.isDisplayLoginDialog} reFreshUserInfo={ ()=>{this.reFreshUserInfo()} }/>
				<Logoutdialog isDisplay = {this.state.isDisplayLogoutDialog} reFreshUserInfo={ ()=>{this.reFreshUserInfo()} } />
			</div>
		)
	}
}
