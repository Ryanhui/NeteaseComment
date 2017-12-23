import React, { Component } from 'react';

export default class Dialog extends Component{
	constructor(props){
		super(props)
		this.state = {
			isDisplay: 'none',
			loginMsg: ''
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			isDisplay: nextProps.isDisplay,
			loginMsg: ''
		})
	}

	closeDialog() {
		this.setState({
			isDisplay: 'none'
		})
	}

	setUserInfo(islogin,nickname,avatarUrl) {
		localStorage.setItem('islogin',islogin)
		localStorage.setItem('nickname',nickname)
		localStorage.setItem('avatarUrl',avatarUrl)
	}

	login() {
		//console.log(this.password.value)
		let url = 'http://www.qinlab.net:3000/login/cellphone?phone='+this.account.value+'&password='+this.password.value+''
	
		fetch(url,{
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => {
			let headers = response.headers.get('Set-Cookie')
			console.log(headers)
			return response.json()
		})
		.then((json) => {
			console.log(json)
			if(json.code === 200){
				this.setUserInfo(true, json.profile.nickname, json.profile.avatarUrl)
				this.closeDialog()
				this.props.reFreshUserInfo()
			}else{
				this.setState({
					loginMsg: json.msg
				})
				this.password.value = null
			}
		}).catch((err) => {
			console.log(err);
			alert("服务器异常，请等待修复")
		})
	}

	render(){
		return (
			<div className="login_dialog" style={{display:this.state.isDisplay}}>
				<div className="login_dialog_header">
					<p>登陆</p>
					<button className="dialog_close_button" onClick={()=>{this.closeDialog()}}>X</button>
				</div>
				<div className="phone_number">
					<div className="input_position_container">
						<span>账号</span>
						<input placeholder = "暂时只支持手机号登陆" ref={(input) => {this.account = input}}></input>						
					</div>
				</div>
				<div className="password">
					<div className="input_position_container">
						<span>密码</span>
						<input placeholder="密码" type="password" ref={(input) => {this.password = input}}></input>
					</div>
				</div>
				<p className="login_msg">{this.state.loginMsg}</p>
				<div className="login_button_container">
					<button onClick={()=>this.login()}>登陆</button>
				</div>
			</div>
		)
	}
}
