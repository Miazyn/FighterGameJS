class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 }}) {

        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0
        //How quickly animation plays
        this.framesElapsed = 0
        this.framesHold = 8

        this.offset = offset

    }

    draw() {
        ctx.drawImage(
            this.image,
            //Move crop mark aka Spritesheet frames moving by pixels
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            //Crop of img
            this.image.width / this.framesMax,
            this.image.height,
            //Location of img
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            //Size of image
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames()
    {
        //Controls speed of animation, by checking
        //how many seconds have elapsed until next frame
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0)
        {
            if (this.frameCurrent < this.framesMax - 1)
            {
                this.frameCurrent++
            }
            else
            {
                this.frameCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite{
    constructor({
            position,
            velocity,
            color = 'red',
            imageSrc,
            scale = 1,
            framesMax = 1,
            offset = { x: 0, y: 0 },
            sprites
        })
    {

        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100

        this.frameCurrent = 0
        //How quickly animation plays
        this.framesElapsed = 0
        this.framesHold = 6

        this.sprites = sprites

        for (const sprite in this.sprites)
        {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

        console.log(this.sprites)
    }

    update() {
        this.draw()
        this.animateFrames()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y
            >= canvas.height - 95) {
            this.velocity.y = 0
            this.position.y = 331
        } else {
            this.velocity.y += gravity
        }

    }

    attack()
    {
        this.switchSprite('attack1')
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

    switchSprite(sprite)
    {
        if (
            this.image === this.sprites.attack1.image &&
            this.frameCurrent < this.sprites.attack1.framesMax - 1
        )
            return

        switch (sprite)
        {
            case 'idle':
                if (this.image !== this.sprites.idle.image)
                {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image)
                {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image)
                {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image)
                {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image)
                {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.frameCurrent = 0
                }
                break
            default:
        }
    }
}