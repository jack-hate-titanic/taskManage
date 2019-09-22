<template>
	<view>
		<form @submit="formSubmit">

			<view class="taskTitle item">
				<input name="taskTitle" type="text" value="" class="input" placeholder="在这里输入任务标题" />
			</view>
			<view class="taskContent item">
				<textarea @blur="bindTextAreaBlur" auto-height placeholder='在这里输入任务内容(需求要明确)' />
				</view>
			<view class="startTime item uni-list-cell">
				<view class="uni-list-cell-left">
					预计开始日期
				</view>
				<view class="uni-list-cell-db" @tap="open('start')">
					{{startTime}}
				</view>
			</view>
			<view class="endTime item uni-list-cell">
				<view class="uni-list-cell-left">
				    预计结束日期
				</view>
				<view class="uni-list-cell-db" @tap="open('end')">
					{{endTime}}
				</view>
			</view>
			<view class="uni-list-cell item">
			    <view class="uni-list-cell-left">
			        优先级
			    </view>
			    <view class="uni-list-cell-db">
			        <picker @change="bindPickerChange" :value="priIndex" :range="priArray">
			            <view class="uni-input">{{priArray[priIndex]}}</view>
			        </picker>
			    </view>
			</view> 
			<view class="estimate item">
				<view class="name">估时</view>
				<input type="text"/>
				<view class="unit">(小时)</view>
			</view>
			<view class="uni-list-cell item">
			    <view class="uni-list-cell-left">
			        状态
			    </view>
			    <view class="uni-list-cell-db">
			        <picker @change="bindPickerChange" :value="statusIndex" :range="statusArray" :range-key="'name'">
			            <view class="uni-input">{{statusArray[statusIndex].name}}</view>
			        </picker>
			    </view>
			</view> 
			<uni-calendar
			    ref="calendar"
			    :insert="false"
			    @confirm="confirm"
			     />           
			<button type="primary" form-type="submit" style="margin-top: 60rpx;width: 90%;">创建</button>
		</form>
	</view>
</template>

<script>
	import {uniCalendar} from "@/components/uni-calendar/uni-calendar"
	import {formatDate} from '@/utils/utils.js';
	import uniRequest from '@/utils/uni-request';
	export default {
		components: {
		        uniCalendar
		    },
		data() {
			return {
				priArray: ['严重', '高', '中', '低'],
				priIndex: 0,
				startTime:formatDate(new Date()),
				endTime:formatDate(new Date()),
				timeType:'',
				statusArray:[{
					name:'新',
					enName:'new'
				},{
					name:'需求明确中',
					enName:'explicit'
				},{
					name:'实现中',
					enName:'doing'
				},{
					name:'已完成',
					enName:'finish'
				}],
				statusIndex:0
			}
		},
		onShow() {
			uniRequest.get('/priority/get').then((res)=>{
				debugger;
			})
		},
		methods: {
			 bindTextAreaBlur(e) {
			            console.log(e.detail.value)
			        },
			bindPickerChange(e) {
			            console.log('picker发送选择改变，携带值为', e.target.value)
			            this.statusIndex = e.target.value
			        },	
			open(type){
			            this.$refs.calendar.open();
						this.timeType=type;
			        },
			confirm(e) {
			            if(this.timeType==='start'){
							this.startTime=e.fulldate;
						}
						if(this.timeType==='end'){
							this.endTime=e.fulldate;
						}
			        }
		}
	}
</script>

<style lang="less">
	.item{
		border-bottom: 1px solid #dfdfdf;
		padding: 20rpx;
	}
	
	.taskTitle{
		height:60rpx;
		line-height: 60rpx;
		
	}
	
	.taskContent{
		height:300rpx;
		
	}
	
	.uni-list-cell{
		height:60rpx;
		line-height: 60rpx;
		display: flex;
		justify-content: space-between;
	}
	
	.estimate{
		display: flex;
		justify-content: space-between;
		.name{
			flex:1;
		}
		input{
			width:10%;
		}
		
	}
	
	
	

</style>
