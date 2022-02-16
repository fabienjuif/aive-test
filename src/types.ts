export type Point = {
  x: number
  y: number
}

export type Appearance = {
  boxes: {
    box: {
      bottomRight: Point
      topLeft: Point
    }
    time: number
  }[]
}

export type Object = {
  appearances: Appearance[]
  currentAppearance?: Appearance
  id: string
  objectClass: string
}
