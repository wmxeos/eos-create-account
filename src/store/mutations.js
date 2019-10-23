import {
	SAVE_ACCOUNT,
	SAVE_EOS,
	SAVE_RPC,
	SAVE_CHANNELUSER,
	SAVE_TABINDEX
} from './mutation-types.js'

export default {
	//获取用户信息存入vuex
	[SAVE_ACCOUNT](state, account) {
		console.warn('vues====');
		console.warn(account);
		state.account = account
	},
	[SAVE_EOS](state, eos) {
		state.eos = eos
	},
	[SAVE_RPC](state, rpc) {
		state.rpc = rpc
	},
	[SAVE_CHANNELUSER](state, channeluser) {
		state.channeluser = channeluser
	},
	[SAVE_TABINDEX](state, tabindex) {
		state.tabindex = tabindex
	}
}
