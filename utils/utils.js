const moment = require('@/utils/moment.min.js');

export function formatDate(time){
	return moment(time).format('YYYY-MM-DD')
}
