const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

ctx.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.8

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/background.png'
})

const shop = new Sprite({
    position: {
        x: 630,
        y: 160
    },
    imageSrc: './Assets/shop.png',
    scale: 2.5,
    framesMax: 6
})

const player = new Fighter({
    position: {
    x: 200,
    y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './Assets/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './Assets/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './Assets/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Assets/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './Assets/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './Assets/samuraiMack/Take hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './Assets/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 700,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './Assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: './Assets/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './Assets/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './Assets/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Assets/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './Assets/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './Assets/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './Assets/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -100,
            y: 50
        },
        width: 160,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    shop.update()

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    
    //player Movement
    if (keys.a.pressed && player.lastKey === 'a')
    {
        player.velocity.x = -5
        player.switchSprite('run')
    }
    else if (keys.d.pressed && player.lastKey === 'd')
    {
        player.velocity.x = 5
        player.switchSprite('run')
    }
    else
    {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0)
    {
        player.switchSprite('jump')
    }
    else if (player.velocity.y > 0)
    {
        player.switchSprite('fall')
    }

    //Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') 
    {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')
    {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }
    else
    {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0)
    {
        enemy.switchSprite('jump')
    }
    else if (enemy.velocity.y > 0)
    {
        enemy.switchSprite('fall')
    }

    //Detect for Collisions
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
        }) &&
        player.isAttacking &&
        player.frameCurrent === 4)
    {
        enemy.takeHit()
        player.isAttacking = false
        
        //document.querySelector('#enemyHealthbar').style.width = enemy.health + '%'
        gsap.to('#enemyHealthbar', {
            width: enemy.health + '%'
        })
    }

    if (player.isAttacking && player.frameCurrent === 4)
    {
        player.isAttacking = false
    }

    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
        }) &&
        enemy.isAttacking &&
        enemy.frameCurrent === 2)
    {
        player.takeHit()

        enemy.isAttacking = false
        //document.querySelector('#playerHealthbar').style.width = player.health + '%'
        gsap.to('#playerHealthbar', {
            width: player.health + '%'
        })
    }

    if (enemy.isAttacking && enemy.frameCurrent === 2)
    {
        enemy.isAttacking = false
    }

    //End game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) =>
{
    if (!player.dead)
    {
        switch (event.key)
        {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break
            default:
        }
    }


    if (!enemy.dead)
    {
        switch (event.key)
        {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break
            default:
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        default:
    }

    //Enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        default:
    }
})