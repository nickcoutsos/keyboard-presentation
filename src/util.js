const searchUserData = (object, key, value) => {
  let match
  object.traverse(obj => {
    if (match) return
    if (obj.userData[key] === value) {
      match = obj
      return
    }
  })

  return match
}

module.exports = { searchUserData }
