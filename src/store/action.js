import {
	SAVE_ACCOUNT,
	SAVE_EOS,
	SAVE_RPC,
	SAVE_CHANNELUSER,
	SAVE_TABINDEX
} from './mutation-types.js'
export default {

	async saveAccount({commit,state},account) {
		commit(SAVE_ACCOUNT,account)
	},
	async saveEos({commit,state},eos) {
		commit(SAVE_EOS,eos)
	},
	async saveRpc({commit,state},rpc) {
		commit(SAVE_RPC,rpc)
	},
	async saveChanneluser({commit,state},channeluser) {
		commit(SAVE_CHANNELUSER,channeluser)
	},
	async saveTabindex({commit,state},tabindex) {
		commit(SAVE_TABINDEX,tabindex)
	}
}
