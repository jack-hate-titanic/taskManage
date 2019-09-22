<template>
	<view class='body'>
		<form @submit="formSubmit">
			<view class="face-wapper">
				<image src="../../static/timg.jpeg" class="face"></image>

			</view>

			<view class="info-wapper">
				<label class="words-lbl">用户名</label>
				<input name="username" type="text" value="" class="item" placeholder="请输入用户名" placeholder-class="graywords" />
			</view>

			<view class="info-wapper" style="margin-top: 40rpx;">
				<label class="words-lbl">密码</label>
				<input name="password" type="text" value="" password="true" class="item" placeholder="请输入密码" placeholder-class="graywords" />
			</view>
			<view class="info-wapper" style="margin-top: 40rpx;">
				<label class="words-lbl">确认密码</label>
				<input name="confirmPassword" type="text" value="" password="true" class="item" placeholder="请输入密码"
				 placeholder-class="graywords" />
			</view>
			<view class="info-wapper" style="margin-top: 40rpx;">
				<label class="words-lbl">性别</label>
				<view class="uni-list item">
					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in gender" :key="item.value">
							<radio :value="item.value" :checked="index === genderCurrent" /><text style="margin-right: 30rpx;">{{item.name}}</text>
						</label>
					</radio-group>
				</view>
			</view>


			<button form-type="submit" class="loginButton">注册</button>
		</form>
	</view>
</template>

<script>
	import uniRequest from '@/utils/uni-request';
	export default {
		data() {
			return {
				gender: [{
					name: '男',
					value: 'man',
				}, {
					name: '女',
					value: 'women'
				}],
				genderCurrent: 0
			};
		},
		methods: {
			formSubmit(e) {
				const {
					username,
					password,
					confirmPassword
				} = e.detail.value;
				if (!username) {
					uni.showModal({
						title: '请输入用户名',
						showCancel: false
					})
					return;
				}
				if (!password && !confirmPassword) {
					uni.showModal({
						title: '请输入密码',
						showCancel: false
					})
					return;
				}
				if (username.length < 5) {
					uni.showModal({
						title: '名称不得少于5位字符',
						showCancel: false
					})
					return;
				}
				if (password.length < 8) {
					uni.showModal({
						title: '密码不得少于8位字符',
						showCancel: false
					})
					return;
				}
				if (confirmPassword !== password) {
					uni.showModal({
						title: '两次密码输入不一致',
						showCancel: false
					})
					return;
				}
				uniRequest.post('/regist', {
						username: username,
						password: password
					})
					.then((res) => {
						if (res.data.success) {
							uni.showToast({
								title: res.data.msg
							})
							uni.setStorageSync('token',res.data.result);
							uni.navigateTo({
								url: '../Login/Login'
							})
						}
						if (!res.data.success) {
							uni.showModal({
								title:res.data.msg,
								showCancel:false
							})
						}
					})
			},
			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.genderCurrent = i;
						break;
					}
				}
			}
		}
	}
</script>

<style lang="less">
	@import url("../Login/Login.css");
</style>
