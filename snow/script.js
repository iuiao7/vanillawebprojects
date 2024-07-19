class Snow {
  constructor(opt = {}) {
    this.el = null

    this.dir = opt.dir || 'r'
    // 直径
    this.width = 0

    this.maxWidth = opt.maxWidth || 80

    this.minWidth = opt.minWidth || 2

    this.opacity = 0

    this.x = 0

    this.y = 0
    // 水平速度
    this.sx = 0
    // 垂直速度
    this.sy = 0

    this.maxSpeed = opt.maxSpeed || 4

    this.minSpeed = opt.minSpeed || 1
    // 窗口宽度
    this.windowWidth = window.innerWidth
    // 窗口高度
    this.windowHeight = window.innerHeight

    this.z = 0
    // 快速划过的最大速度
    this.quickMaxSpeed = opt.quickMaxSpeed || 10
    // 快速划过的最小速度
    this.quickMinSpeed = opt.quickMinSpeed || 8
    // 快速划过的宽度
    this.quickWidth = opt.quickWidth || 80
    // 快速划过的透明度
    this.quickOpacity = opt.quickOpacity || 0.2
    // 是否左右摇摆
    this.isSwing = false
    // 左右摇摆正弦函数 x 变量区间中点
    this.swingRadian = 1
    // 左右摇摆正弦函数 x 步长
    this.swingStep = 0.01

    this.init()
  }

  init(reset) {
    let isQuick = Math.random() > 0.8
    this.isSwing = Math.random() > 0.5
    this.width = isQuick
      ? this.quickWidth
      : Math.floor(Math.random() * this.maxWidth + this.minWidth)
    this.opacity = isQuick ? this.quickOpacity : Math.random()
    this.sy = isQuick
      ? Math.random() * this.quickMaxSpeed + this.quickMinSpeed
      : Math.random() * this.maxSpeed + this.minSpeed
    this.sx = (this.dir === 'r' ? this.sy : -this.sy) * Math.random()
    this.x = Math.floor(Math.random() * (this.windowWidth - this.width))
    this.y = Math.floor(Math.random() * (this.windowHeight - this.width))
    this.z = isQuick ? Math.random() * 300 + 200 : 0
    if (reset && Math.random() > 0.8) {
      this.x = -this.width
    } else if (reset) {
      this.y = -this.width
    }
    this.swingStep = 0.01 * Math.random()
    this.swingRadian = Math.random() * (1.1 - 0.9) + 0.9
  }

  setStyle() {
    this.el.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            width: ${this.width}px;
            height: ${this.width}px;
            opacity: ${this.opacity};
            background-image: radial-gradient(#ffffff 0%, rgba(255, 255, 255, 0) 60%);
            border-radius: 50%;
            z-index: 999999999999;
            pointer-events: none;
            transform: translate3d(${this.x}px, ${this.y}px, ${this.z}px);
        `
  }

  render() {
    this.el = document.createElement('div')
    this.setStyle()
    document.body.appendChild(this.el)
  }

  move() {
    if (this.isSwing) {
      if (this.swingRadian > 1.1 || this.swingRadian < 0.9) {
        this.swingStep = -this.swingStep
      }
      this.swingRadian += this.swingStep
      this.x += this.sx * Math.sin(this.swingRadian * Math.PI)
      this.y -= this.sy * Math.cos(this.swingRadian * Math.PI)
    } else {
      this.x += this.sx
      this.y += this.sy
    }
    if (this.x > this.windowWidth || this.y > this.windowHeight) {
      this.init(true)
      this.setStyle()
    }
    // this.el.style.left = this.x + 'px'
    // this.el.style.top = this.y + 'px'
    this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, ${this.z}px)`
  }
}

let snowList = []
for (let i = 0; i < 100; i++) {
  let snow = new Snow()
  snow.render()
  snowList.push(snow)
}

function moveSnow() {
  window.requestAnimationFrame(() => {
    snowList.forEach(item => {
      item.move()
    })
    moveSnow()
  })
}

moveSnow()
