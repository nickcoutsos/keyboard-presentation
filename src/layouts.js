import { Matrix4, Object3D, Vector3 } from 'three'
import makeKey from './key'
import { searchUserData } from './util'

export const classic = [
  ["",{x:1},"","","","",{x:0.5},"","","","",{x:0.5},"","","","",{x:0.25},"","",""],
  [{y:0.5},"","1","2","3","4","5","6","7","8","9","0","-","=",{w:2},"",{x:0.25},"","","",{x:0.25},"","","",""],
  [{w:1.5},"","q","w","e","r","t","y","u","i","o","p","[","]",{w:1.5},"",{x:0.25},"","","",{x:0.25},"","","",{h:2},""],
  [{w:1.75},"","a","s","d","f","g","h","j","k","l",";","'",{w:2.25},"",{x:3.5},"","",""],
  [{w:2.25},"","z","x","c","v","b","n","m",",",".","/",{w:2.75},"",{x:1.25},"",{x:1.25},"","","",{h:2},""],
  [{w:1.25},"",{w:1.25},"",{w:1.25},"",{w:6.25},"",{w:1.25},"",{w:1.25},"",{w:1.25},"",{w:1.25},"",{x:0.25},"","","",{x:0.25,w:2},"",""]
]

export const apple = [
  [{y:0.75,w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},"",{w:1.0357,h:0.75},""],
  [{y:-0.25},"","1","2","3","4","5","6","7","8","9","0","-","=",{w:1.5},""],
  [{w:1.5},"","q","w","e","r","t","y","u","i","o","p","[","]",""],
  [{w:1.75},"","a","s","d","f","g","h","j","k","l",";","'",{w:1.75},""],
  [{w:2.25},"","z","x","c","v","b","n","m",",",".","/",{w:2.25},""],
  [{h:1.111},"",{h:1.111},"",{h:1.111},"",{w:1.25,h:1.111},"",{w:5,h:1.111},"",{w:1.25,h:1.111},"",{h:1.111},"",{x:1,h:0.611},""],
  [{y:-0.5,x:11.5,h:0.6111},"",{h:0.6111},"",{h:0.6111},""]
]

export const planck = [
  ["","Q","W","E","R","T","Y","U","I","O","P",""],
  ["","A","S","D","F","G","H","J","K","L",";","'"],
  ["","Z","X","C","V","B","N","M",",",".","/",""],
  ["","","","","",{w:2},"","","","","",""]
]

const fn = (id) => {
  return {
    id: `fn-${id}`,
    isKey: true,
    label: ''
  }
}

export const ergodox = [
  [{x:3.5},"3",{x:10.5},"8"],
  [{y:-0.875,x:2.5},"2",{x:1},"4",{x:8.5},"7",{x:1},"9"],
  [{y:-0.875,x:5.5},"5",{a:7},"",{x:4.5},"",{a:4},"6"],
  [{y:-0.875,a:7,w:1.5},fn('l-0'),{a:4},"1",{x:14.5},"0",{a:7,w:1.5},fn('r-0')],
  [{y:-0.375,x:3.5,a:4},"E",{x:10.5},"I"],
  [{y:-0.875,x:2.5},"W",{x:1},"R",{x:8.5},"U",{x:1},"O"],
  [{y:-0.875,x:5.5},"T",{a:7,h:1.5},"",{x:4.5,h:1.5},"",{a:4},"Y"],
  [{y:-0.875,a:7,w:1.5},fn('l-1'),{a:4},"Q",{x:14.5},"P",{a:7,w:1.5},fn('r-1')],
  [{y:-0.375,x:3.5,a:4},"D",{x:10.5},"K"],
  [{y:-0.875,x:2.5},"S",{x:1},"F",{x:8.5},"J",{x:1},"L"],
  [{y:-0.875,x:5.5},"G",{x:6.5},"H"],
  [{y:-0.875,a:7,w:1.5},fn('l-2'),{a:4},"A",{x:14.5},";",{a:7,w:1.5},fn('r-2')],
  [{y:-0.625,x:6.5,h:1.5},"",{x:4.5,h:1.5},""],
  [{y:-0.75,x:3.5,a:4},"C",{x:10.5},","],
  [{y:-0.875,x:2.5},"X",{x:1},"V",{x:8.5},"M",{x:1},"."],
  [{y:-0.875,x:5.5},"B",{x:6.5},"N"],
  [{y:-0.875,a:7,w:1.5},fn('l-3'),{a:4},"Z",{x:14.5},"/",{a:7,w:1.5},fn('r-3')],
  [{y:-0.375,x:3.5},fn('l-7'),{x:10.5},fn('r-7')],
  [{y:-0.875,x:2.5},fn('l-6'),{x:1},fn('l-8'),{x:8.5},fn('r-8'),{x:1},fn('r-6')],
  [{y:-0.75,x:0.5},fn('l-4'),fn('l-5'),{x:14.5},fn('r-5'),fn('r-4')],
  [{r:30,rx:6.5,ry:4.25,y:-1,x:1},fn('l-9'),fn('l-10')],
  [{h:2},fn('l-14'),{h:2},fn('l-13'),fn('l-11')],
  [{x:2},fn('l-12')],
  [{r:-30,rx:13,y:-1,x:-3},fn('r-10'),fn('r-9')],
  [{x:-3},fn('r-11'),{h:2},fn('r-13'),{h:2},fn('r-14')],
  [{x:-3},fn('r-12')]
]

export const split = [
  [{r:15, rx:3}, "","1","2","3","4","5","6"],
  [{w:1.5},"","Q","W","E","R","T"],
  [{w:1.75},"","A","S","D","F","G"],
  [{w:2.25},"","Z","X","C","V","B"],
  [{w:1.25},"",{w:1.25},"",{w:1.25},"",{a:7,w:3.25}, ""],
  [{r:-15, rx:10, ry:1.8, x:.25}, "7","8","9","0","-","=",{w:2},""],
  [{x:0},"Y","U","I","O","P","[","]",{w:1.25},""],
  [{x:0.25},"H","J","K","L",";","'",{w:2},""],
  [{x:0.5},"N","M",",",".","/",{w:2.75},""],
  [{w:2},"",{a:4,w:1.25},"",{w:1.25},"",{w:1.25},"",{w:1.25},""]
]

export const makeKeyboard = layout => {
  const cursor = new Vector3(0, 0, 0)
  let w = 1, h = 1

  const keyboard = new Object3D()
  let rotation = { a: 0, x: 0, y: 0 }
  let matrix = new Matrix4()

  layout.forEach(row => {
    row.forEach(element =>  {
      if (typeof element === 'string' || element.isKey) {
        const label = element.label !== undefined ? element.label : element
        const key = makeKey(w, h, label.length > 0)

        key.userData.label = label ? label.toLowerCase() : null
        key.userData.id = element.id || key.userData.label
        key.position.copy(cursor)
        key.position.x += w / 2
        key.position.y -= h / 2

        key.updateMatrix()
        key.applyMatrix(matrix)

        keyboard.add(key)

        cursor.x += w

        w = 1
        h = 1

        return
      }

      const { x, y, w: w_, h: h_, r, rx, ry } = element

      cursor.x += x || 0
      cursor.y -= y || 0
      w = w_ || w
      h = h_ || h

      if (r || rx || ry) {
        const yOffset = ry || rotation.yOffset

        rotation.a = r
        rotation.xOffset = rx
        rotation.yOffset = yOffset

        matrix = new Matrix4()
          .multiply(new Matrix4().makeTranslation(rx || 0, -(yOffset || 0), 0))
          .multiply(new Matrix4().makeRotationZ(Math.PI * -r/180))

        cursor.set(x || 0, -(y || 0), 0)
      }
    })

    cursor.x = 0
    cursor.y -= h
  })

  const fKey = searchUserData(keyboard, 'label', 'f')
  const jKey = searchUserData(keyboard, 'label', 'j')
  const fPos = fKey.parent.localToWorld(fKey.position.clone())
  const jPos = jKey.parent.localToWorld(jKey.position.clone())
  const center = new Vector3().lerpVectors(fPos, jPos, .5)

  keyboard.children.forEach(node => node.position.sub(center))

  return keyboard
}

export const makeKeymap = keyboard => {
  let map = {}
  keyboard.traverse(node => {
    const { id } = node.userData
    if (id) {
      map[id] = node
    }
  })

  return map
}
