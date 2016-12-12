import Vue from 'vue'
import { MessageBox } from 'element-ui'
import VueResource from 'vue-resource'
Vue.use(VueResource)

class BaseResource {
  constructor(path) {
    this.res = Vue.resource(path)
  }

  get() {
    if (arguments.length === 0) {
      return transPromise(this.res.get())
    } else if (typeof arguments[0] === 'number') {
      return transPromise(this.res.get({id:arguments[0]}))
    } else {
      return transPromise(this.res.query(Object.assign(arguments[0], {type:'sel'})))
    }
  }

  save(data) {
    return transPromise(this.res.save(data))
  }

  update(id, data) {
    return transPromise(this.res.update({id:id}, data))
  }

  delete() {
    if (arguments.length === 1) {
      if (typeof arguments[0] === 'number') {
        return transPromise(this.res.delete({id:arguments[0]}))
      } else {
        return transPromise(this.res.delete({}, arguments[0]))
      }
    } else {
      throw new Error(`delete方法参数个数不正确，必须为一个,实际为${arguments.length}个`)
    }
  }
}

function transPromise(promise) {
  return promise.then((resp) => {
      let result = resp.body
      if (result.success) {
        return result.data
      } else {
        alertMsg(result.error)
      }
    })
}

function alertMsg(msg) {
  MessageBox.alert(msg, '错误提示', {
    confirmButtonText: '确定'
  })
}

export default BaseResource
