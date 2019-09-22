<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="isCanUse">
			<view>
				<view class='header'>
					<image src='../../static/icos/weixin.png'></image>
				</view>
				<view class='content'>
					<view>申请获取以下权限</view>
					<text>获得你的公开信息(昵称，头像、地区等)</text>
				</view>

				<button class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
					授权登录
				</button>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				SessionKey: '',
				OpenId: '',
				nickName: null,
				avatarUrl: null,
				isCanUse: uni.getStorageSync('isCanUse')
			};
		},
		methods: {
			//第一授权获取用户信息===》按钮触发
			wxGetUserInfo() {
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						_this.nickName = infoRes.userInfo.nickName; //昵称
						_this.avatarUrl = infoRes.userInfo.avatarUrl; //头像
						try {
							uni.setStorageSync('isCanUse', false); //记录是否第一次授权  false:表示不是第一次授权
							_this.isCanUse = false;
							_this.updateUserInfo();
						} catch (e) {
							console.log(e)
						}
					},
					fail(res) {}
				});
			},
			//登录
			login() {
				let _this = this;
				uni.showLoading({
					title: '登录中...'
				});

				// 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						let code = loginRes.code;
						if (!_this.isCanUse) {
							//非第一次授权获取用户信息
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {
									//获取用户信息后向调用信息更新方法
									_this.nickName = infoRes.userInfo.nickName; //昵称
									_this.avatarUrl = infoRes.userInfo.avatarUrl; //头像
									uni.hideLoading();
									uni.switchTab({
										url: "/pages/index/index"
									})
								}
							});
						}
					},
				});
			},

			updateUserInfo() {
				let _this = this;
				uni.request({
					url: `${_this.serverUrl}/user/registOrLogin`, //服务器端地址
					data: {
						nickName: _this.nickName,
						headUrl: _this.avatarUrl
					},
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					success: (res) => {
						if (res.data.code == 0) {
							uni.reLaunch({ //信息更新成功后跳转到小程序首页
								url: '/pages/index/index'
							});
						}
					}

				});
			}
		},
		onLoad() { //默认加载

			// if (!this.isCanUse) {
			// 	this.login();
			// }

		}
	}
</script>

<style>
	@import url("me.css");
</style>
