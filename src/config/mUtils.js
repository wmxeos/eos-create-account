
/**
 * 存储localStorage
 */
export const getConfigV = (k,list) => {
	for (let i=0;i<list.length;i++) {
		if (k == list[i].cfg_key){
			return list[i].cfg_value
		}
	}
	return ''
}

export const getConfigMemo = (k,list) => {
	for (let i=0;i<list.length;i++) {
		if (k == list[i].cfg_key){
			return list[i].cfg_memo
		}
	}
	return ''
}

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

export const setCookie = (cname,cvalue,exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//清除cookie
export const clearCookie = name => {
	var d = new Date();
	d.setTime(d.getTime() + (-1*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = name + "='';"+ expires;
}
