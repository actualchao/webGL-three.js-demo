export function deepClone (data) {
  const t = getType(data)
  let o
  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepClone(data[i]))
    }
  } else if (t === 'object') {
    for (const i in data) {
      o[i] = deepClone(data[i])
    }
  }
  return o
}

export function getType (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}
