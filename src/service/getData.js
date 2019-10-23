import fetch from '../config/fetch'
import {getStore} from '../config/mUtils'
import {interfaceUrl} from '../config/constants'

export const orderpayweixin = (attach) => fetch(interfaceUrl.ORDERPAYWEIXIN, {
  attach
},'post');

export const checkpay = (username) => fetch(interfaceUrl.CHECKPAY, {
  username
},'post');

export const sysconfig = () => fetch(interfaceUrl.SYSCONFIG, {
},'post');
