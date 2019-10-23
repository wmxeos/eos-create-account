<template>
  <div class="bg">
    <img src="../assets/banner.png">
    <div class="obox">
      <div class="box">
        <div class="boxitem">
          <div class="num">1</div>
          <div>输入账号</div>
        </div>
        <div class="dian">···</div>
        <div class="boxitem">
          <div class="num">2</div>
          <div>绑定公钥</div>
        </div>
        <div class="dian">···</div>
        <div class="boxitem">
          <div class="num">3</div>
          <div>支付创建</div>
        </div>
      </div>

      <div class="box2">
        <div class="f1">
          <input type="text" v-model="account" class="txt" placeholder="输入EOS账号名(a-z和1-5组成的12位字符）"/>
        </div>
        <div class="btn" @click="randomAccount">自动生成</div>
      </div>

      <div class="box3">
        <div class="box3t">
          <div class="f1 jc">
            <textarea v-model="publicKey" class="txt" placeholder="输入要绑定的公钥"></textarea>
          </div>
          <div class="btn" @click="createKey">
            <p v-if="!keyloading">自动生成</p>
            <cube-loading :size="20" v-else></cube-loading>
          </div>
        </div>
        <div class="box3b">
          <div class="f1 jc">
            <textarea v-model="privateKey" class="txt" placeholder="私钥为离线生成,我们不存储,自行保存好私钥"></textarea>
          </div>
          <div class="btn" id="copy" @click="copy" :data-clipboard-text="this.privateKey">复制私钥</div>
        </div>
      </div>

      <div class="sbtn" v-if="!qrcodeShow" @click="pay">确认已备份私钥并支付(￥{{this.price}})</div>

      <div class="paybox" v-else>
        <div>
          <div class="qrcodebox">
            <img :src="this.qrcode"/>
          </div>
          <p>“请用微信扫一扫功能扫此二维码进行支付（暂不能通过相册选中图片识别方式支付）”</p>
          <div class="cancel" @click="cancel">取消</div>
        </div>
      </div>

      <div class="box4">
        <div class="box4in">
          <p>免责声明</p>
          <p>1、本工具仅为了快速、便捷、安全创建EOS账号，因本
          平台创建的账号所产生的后续一切行为与本平台无关。</p>
          <p>2、私钥是您控制账户的唯一凭证，请妥善保管。平台不
          存储且无法通过此平台找回。</p>
          <p>3、账号含0.2 EOS CPU、0.01 EOS NET、4K的RAM</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {mapState, mapActions} from 'vuex'
import ecc from 'eosjs-ecc'
import {JsonRpc, Api} from 'eosjs'
import Clipboard from 'clipboard'
import { Base64 } from 'js-base64'
import { orderpayweixin,sysconfig,checkpay } from '@/service/getData'
export default {

  data () {
    return {
      account:'',
      privateKey:'',
      publicKey:'',
      keyloading:false,
      rpc:null,
      toast:null,
      price:0,
      qrcode:'',
      qrcodeShow:false,
      it:null
    };
  },

  mounted() {
    this.rpc = new JsonRpc('https://nodes.get-scatter.com', { fetch });
    this.getPrice()
  },

  beforeDestroy(){
    if (this.it) {
      clearInterval(this.it)
      this.it = null
    }
  },

  methods: {
    cancel(){
      this.qrcodeShow = false
      if (this.it) {
        clearInterval(this.it)
        this.it = null
      }
    },
    async getPrice(){
      const data = await sysconfig()
      console.warn(data);
      this.price = data.lists.price
    },
    showLoading(){
      const toast = this.$createToast({
        txt: '数据提交中...',
        mask:true,
        time:0
      })
      toast.show()
      this.toast = toast
    },
    hideLoading(){
      if (this.toast) {
        this.toast.hide()
      }
    },
    async  pay(){
      const [account,privateKey,publicKey] = [
        this.account,
        this.privateKey,
        this.publicKey
      ]
      if (!/^[a-z1-5]*$/g.test(account)) {
        this.$createToast({
          txt: '账号格式错误',
          type: 'error'
        }).show()
        return
      }
      if (account.trim().length != 12) {
        this.$createToast({
          txt: '账号格式错误',
          type: 'error'
        }).show()
        return
      }
      if (privateKey.trim() == '' || publicKey.trim() == '') {
        this.$createToast({
          txt: '请先生成公私钥',
          type: 'error'
        }).show()
        return
      }
      if (!ecc.isValidPublic(publicKey)) {
        this.$createToast({
          txt: '公钥格式错误',
          type: 'error'
        }).show()
        return
      }
      if (!ecc.isValidPrivate(privateKey)) {
        this.$createToast({
          txt: '私钥格式错误',
          type: 'error'
        }).show()
        return
      }
      this.showLoading()
      try{
        const data = await this.rpc.get_account(account)
        if (data) {
          this.hideLoading()
          this.$createToast({
            txt: '账号已存在',
            type: 'error'
          }).show()
          return
        }
      } catch{

        const attach = Base64.encode(publicKey+'|'+account)
        console.warn(attach);
        const data2 = await orderpayweixin(attach)
        this.hideLoading()
        console.warn(data2);
        if (data2.status != 0) {
          this.$createToast({
            txt: data2.reason,
            type: 'error'
          }).show()
          return
        }
        this.qrcode = data2.url
        this.qrcodeShow = true
        const o = this
        this.it = setInterval(()=>{
          o.toCheckPay()
        },1000)
      }
    },
    randomAccount(){
      const str = 'abcdefghijklmnoopqstuvwxyz12345'
      let account = ''
      for (let i=0;i<12;i++) {
        account += str.charAt(Math.floor(Math.random()*31));
      }
      this.account = account
    },
    createKey(){
      if (this.keyloading) return
      const o = this
      this.keyloading = true
      ecc.randomKey().then(privateKey => {
        o.privateKey = privateKey
        o.publicKey = ecc.privateToPublic(privateKey)
        o.keyloading = false
      })
    },
    copy(){
      if (this.privateKey.trim() != '') {
        const clipboard = new Clipboard('#copy');
        this.$createToast({
          txt: '私钥已复制',
          type: 'correct'
        }).show()
      }
    },
    async toCheckPay(){
      const data = await checkpay(this.account)
      console.warn('toCheckPay====');
      console.warn(data);
      if (data.res.username) {
        clearInterval(this.it)
        this.it = null
        this.qrcodeShow = false

        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: '账号创建成功'
        }).show()
      }
    }
  }
}
</script>

<style scoped>

.obox{
  margin: 10px;
}
.box{
  background-color: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  margin-bottom: 10px;
}
.boxitem{
  display: flex;
  align-items: center;
}
.num{width: 18px;height: 18px;border-radius: 9px;background-color: #1662ff;
  text-align: center;line-height: 18px;color: #fff;margin-right: 5px}
.dian{color: #999;font-size: 13px;margin: 0 10px}

.box2{padding: 15px 0;border-radius: 6px;display: flex;align-items: center;background-color: #fff;margin-bottom: 10px}
.btn{background-color: #1662ff;width: 70px;height: 30px;margin-left: 10px;
  color: #fff;border-radius: 6px;margin-right: 10px;font-size: 13px;display: flex;
  align-items: center;justify-content: center;}
.f1{flex: 1;}
.txt{height: 30px;margin: 0 10px;width:100%;outline: none;border: none;font-size: 12px;}
.jc{}

.box3{border-radius: 6px;background-color: #fff;margin-bottom: 20px}
.box3t{display: flex;align-items: center;border-bottom: 1px solid #e8e8e8;padding: 15px 0;}
.box3b{display: flex;align-items: center;padding: 15px 0;}

.sbtn{height: 45px;line-height: 45px;margin-bottom: 20px;
  text-align: center;font-size: 14px;color: #fff;background-color: #1662ff;border-radius:6px;}

.box4{background-color: #fff;padding: 10px 0 40px 0;border-radius: 6px;}
.box4in{margin: 0 10px;color: #999;}
.box4 p{margin-bottom: 10px;font-size: 13px;line-height: 20px;}
img{max-width: 100%}

.paybox{display: flex;justify-content: center;margin-bottom: 20px;}
.paybox img{width: 250px;height: 250px;border-radius: 6px;}
.paybox p{color: #666;margin: 10px 0;text-align: center;font-size: 13px;line-height: 20px;}
.paybox .cancel{background-color: #ccc;width: 70px;height: 30px;border-radius: 15px;
  display: flex;justify-content: center;align-items: center;color: #787878;margin: 0px auto;}
.qrcodebox{width: 250px;margin: 0px auto;}
</style>
