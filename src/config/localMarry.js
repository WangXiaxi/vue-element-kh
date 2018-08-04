import address from './address.js'

export const localMarry = (data) => {
  let arr = []
  address.area.forEach((cur, index) => {
    if (cur.children && cur.children instanceof Array) {
      cur.children.forEach((cur2, index2) => {
        if (cur2.value === Number(data)) {
          arr = [cur.value, cur2.value]
        } else if (cur2.children && cur.children instanceof Array) {
          cur2.children.forEach((cur3, index3) => {
            if (cur3.value === Number(data)) {
              arr = [cur.value, cur2.value, cur3.value]
            }
          })
        }
      })
    }
  })
  return arr
}

export const deleMarry = (datastr) => {
  let data = datastr
  let arrString = '北京,天津,上海,重庆';
  address.area.forEach((cur, index) => {
    if (arrString.indexOf(cur.label) === -1) {
      let length = cur.label.length;
      if (data.slice(0, length) === cur.label) {
        data = data.slice(length)
      }
    }
    if (cur.children && cur.children instanceof Array) {
      cur.children.forEach((cur2, index2) => {
        let length = cur2.label.length;
        if (data.slice(0, length) === cur2.label) {
          data = data.slice(length)
        }
        if (cur2.children && cur.children instanceof Array) {
          cur2.children.forEach((cur3, index3) => {
            let length = cur3.label.length;
            if (data.slice(0, length) === cur3.label) {
              data = data.slice(length)
            }
          })
        }
      })
    }
  })
  return data
}