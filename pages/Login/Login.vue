<template>
	<view class="body">
		<form @submit="formSubmit">
			<view class="face-wapper">
				<image src="../../static/timg.jpeg" class="face"></image>
				<!-- <view>任务管理</view> -->
			</view>

			<view class="info-wapper">
				<label class="words-lbl">用户名</label>
				<input name="username" type="text" value="" class="input" placeholder="请输入用户名" />
			</view>

			<view class="info-wapper" style="margin-top: 40rpx;">
				<label class="words-lbl">密码</label>
				<input name="password" type="text" value="" password="true" class="input" placeholder="请输入密码" placeholder-class="graywords" />
			</view>
			<view class='registeButton' @tap="registBtn">
				立即注册
			</view>

			<button form-type="submit" class="loginButton">登录</button>
		</form>




		<!-- 第三方登录H5不支持，所以隐藏掉 -->
		<!-- #ifndef H5 -->
		<view class="third-wapper">

			<view class="third-line">
				<view class="single-line">
					<view class="line"></view>
				</view>

				<view class="third-words">第三方账号登录</view>

				<view class="single-line">
					<view class="line"></view>
				</view>
			</view>

			<view class="third-icos-wapper">
				<!-- 5+app 用qq/微信/微博 登录 小程序用微信小程序登录 h5不支持 -->
				<!-- #ifdef APP-PLUS -->
				<image src="../../static/icos/weixin.png" data-logintype="weixin" @click="appOAuthLogin" class="third-ico"></image>
				<image src="../../static/icos/QQ.png" data-logintype="qq" @click="appOAuthLogin" class="third-ico" style="margin-left: 80rpx;"></image>
				<image src="../../static/icos/weibo.png" data-logintype="sinaweibo" @click="appOAuthLogin" class="third-ico" style="margin-left: 80rpx;"></image>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<button open-type='getUserInfo' @getuserinfo="wxLogin" class="third-btn-ico">
				</button>
				<!-- #endif -->
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>


<script>
	import uniRequest from '@/utils/uni-request';
	export default {
		data() {
			return {
				username: '',
				password: ''
			};
		},
		methods: {
			registBtn(){
				uni.navigateTo({
					url:'../regist/regist'
				})
			},
			formSubmit(e) {
				var me = this;
				var username = e.detail.value.username;
				var password = e.detail.value.password;
				// 发起注册/登录的请求
				uniRequest.post('/login',{
					"username": username,
					"password": password
				}).then((res)=>{
					if (res.data.success) {
						uni.switchTab({
							url:'../index/index'
						})
						uni.setStorageSync('token',res.data.result);
						uniRequest.defaults.headers.common['Authorization'] = res.data.result;
					} else {
						uni.showModal({
							title: res.data.msg,
							showCancel:false
						})
					}
				})
				
			},

			appOAuthLogin(e) {
				var me = this;
				// 获取用户的登录类型
				var logintype = e.currentTarget.dataset.logintype;

				// 授权登录
				uni.login({
					provider: logintype,
					success(loginRes) {

						// 授权登录成功以后，获取用户的信息
						uni.getUserInfo({
							provider: logintype,
							success(info) {
								// console.log(JSON.stringify(info));

								var userInfo = info.userInfo;
								var face = "";
								var nickname = "";
								var openIdOrUid = "";
								if (logintype == "weixin") {
									face = userInfo.avatarUrl;
									nickname = userInfo.nickName;
									openIdOrUid = userInfo.openId;
								} else if (logintype == "qq") {
									openIdOrUid = userInfo.openId;
									nickname = userInfo.nickname;
									face = userInfo.figureurl_qq_2;
								} else if (logintype == "sinaweibo") {
									openIdOrUid = userInfo.id;
									nickname = userInfo.nickname;
									face = userInfo.avatar_large;
								}

								// 调用开发者后台，执行一键注册或登录
								uni.request({
									url: me.serverUrl + "/appUnionLogin/" + logintype,
									data: {
										"openIdOrUid": openIdOrUid,
										"nickname": nickname,
										"face": face
									},
									method: "POST",
									success(result) {
										if (result.data.status == 200) {
											var userInfo = result.data.data;
											// 保存用户信息到全局的缓存中
											uni.setStorageSync("globalUser", userInfo);
											// 切换页面跳转，使用tab切换的api
											uni.switchTab({
												url: "../me/me"
											});
										}
									}
								})

							}
						})

					}
				});
			},
			// 实现在微信小程序端的微信登录
			wxLogin(e) {
				var me = this;
				// console.log(e);
				// 通过微信开发能力，获得微信用户的基本信息
				var userInfo = e.detail.userInfo;

				// 实现微信登录
				uni.login({
					provider: "weixin",
					success(loginResult) {
						// console.log(loginResult);
						// 获得微信登录的code：授权码
						var code = loginResult.code;
						// 设置登录到哪个对于的微信小程序，大家可以根据自己的后端去实现业务参数
						// [0:NEXT超英预告][1:超英预告][2:NEXT学院电影预告]
						var loginToWhichMP = 1;
						uni.request({
							url: me.serverUrl + "/mpWXLogin/" + code,
							data: {
								"avatarUrl": userInfo.avatarUrl,
								"nickName": userInfo.nickName,
								"whichMP": loginToWhichMP
							},
							method: "POST",
							success(userResult) {
								console.log(userResult);
								var userInfo = userResult.data.data;
								// 保存用户信息到全局的缓存中
								uni.setStorageSync("globalUser", userInfo);
								// 切换页面跳转，使用tab切换的api
								uni.switchTab({
									url: "../me/me"
								});
							}
						});

					}
				})
			},
			
		}
	}
</script>

<style>
	@import url("Login.css");
</style>
