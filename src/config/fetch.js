import {
	baseUrl
} from './env'

import router from '../router'
import {showTip} from '../config/mUtils'

export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
	type = type.toUpperCase();
	url = "/wmxapi/"+url;

	if (type == 'GET') {
		url = url+'?pjson={'
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += '"'+key+'"' + ':' + '"'+data[key]+'"' + ',';
		})

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf(','));
			url = url + dataStr;
		}
		url = url + '}'
	}

	if (false) {
		let requestConfig = {
			credentials: 'include',
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'uid':window.UID
			},
			mode: "cors",
			cache: "force-cache",
			body:'pjson=2'
		}
		if (type == 'POST') {
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			})
		}

		try {
			const response = await fetch(url, requestConfig);
			const responseJson = await response.json();
			return responseJson
		} catch (error) {
			throw new Error(error)
		}
	} else {
		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new ActiveXObject;
			}

			let sendData = '';
			if (type == 'POST') {
				sendData = JSON.stringify(data);
			}

			console.warn(url);

			requestObj.open(type, url, true);
			requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			requestObj.setRequestHeader("uid", window.UID);
			requestObj.setRequestHeader("rid", window.RID);
			requestObj.setRequestHeader("logintype",'pc');
			requestObj.send('pjson='+sendData);

			requestObj.onreadystatechange = () => {
				if (requestObj.readyState == 4) {
					if (requestObj.status == 200) {
						let obj = requestObj.response
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
							if(obj.status == '-2') {
							}
						}
						resolve(obj)
					} else {
						reject(requestObj)
					}
				}
			}
		})
	}
}
