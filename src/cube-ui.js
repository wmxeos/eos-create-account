import Vue from 'vue'

// By default we import all the components.
// Only reserve the components on demand and remove the rest.
// Style is always required.
import {
  /* eslint-disable no-unused-vars */
  Style,
  // basic
  TabBar,
  // form
  // popup
  Toast,
  Dialog,
  // scroll
  Scroll,
} from 'cube-ui'

Vue.use(TabBar)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Scroll)
