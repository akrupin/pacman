document.addEventListener('DOMContentLoaded', main)
document.addEventListener('keydown', onKeyPress)

let $canvas
let $pacman
let stopped = false
let x, y
let maze
let direction

function main() {
    maze = parseInputFile()

    $canvas = document.getElementById('canvas')
    $canvas.style.width = maze.width * 40 + 'px'
    $canvas.style.height = maze.height * 40 + 'px'

    maze.data.forEach(function(row, y) {
        row.forEach(function(n, x) {
            let $cell = document.createElement('div')
            $cell.className = 'cell'
            $cell.innerHTML = `(${x + 1},${y + 1})`

            maze.data[y][x] = fromNumberToBorders(n)

            assignBorders($cell, maze.data[y][x])

            $canvas.appendChild($cell)
        })
    })

    $pacman = document.getElementById('pacman')

    findWay(4, 4, 9, 9)
    //placePacman(1, 1)

    //setInterval(onInterval, 200)
}

function onKeyPress(event){
    switch (event.code) {
        case 'Enter':
            stopped = !stopped
            break
        case 'ArrowDown':
            direction = 'down'
            break
        case 'ArrowUp':
            direction = 'up'
            break
        case 'ArrowLeft':
            direction = 'left'
            break
        case 'ArrowRight':
            direction = 'right'
            break
        //case 'Space':
        //    onInterval()
        //    break
    }
}

function onInterval() {
    if (stopped) {
        return
    }

    switch (direction) {
        case 'down':
            if (isMovable('bottom', x, y-1)) {
                placePacman(x, y-1)
            }
            break
        case 'up':
            if (isMovable('top', x, y+1)) {
                placePacman(x, y + 1)
            }
            break
        case 'left':
            if (isMovable('left', x-1, y)) {
                placePacman(x - 1, y)
            }
            break
        case 'right':
            if (isMovable('right', x+1, y)) {
                placePacman(x + 1, y)
            }
            break
    }

}

function isMovable(direction, nx, ny){
    if (maze.data[y-1][x-1][direction]) {
        return false
    }

    return true
}

function placePacman(nx, ny){
    if (nx == 0) {
        nx = maze.width
    }
    if (nx == maze.width+1) {
        nx = 1
    }
    if (ny == 0) {
        ny = maze.height
    }
    if (ny == maze.height+1) {
        ny = 1
    }

    x = nx
    y = ny
    $pacman.style.bottom = (y-1) * 40 + 'px'
    $pacman.style.left = (x-1) * 40 + 'px'
}

function parseInputFile() {
    let dataEl = document.getElementById('maze-data')
    let mazeData = dataEl.innerHTML

    mazeData = mazeData.replace('\n', '')

    let mazeInput = mazeData.split('\n')
    mazeInput.pop()

    let maze = {}
    maze.height = mazeInput.length
    maze.width = mazeInput[0].length

    for (let i = 0; i <mazeInput.length; i++) {
        mazeInput[i] = mazeInput[i].split('')
        mazeInput[i] = mazeInput[i].map(function(el) {
            return parseInt(el, 16)
        })
    }

    maze.data = mazeInput

    return maze
}


function fromNumberToBorders(n) {
    const borders = {
        top: false,
        right: false,
        bottom: false,
        left: false,
    }

    let leftovers = n

    if (leftovers >= 8) {
        borders.top = true
        leftovers -= 8
    }

    if (leftovers >= 4) {
        borders.right = true
        leftovers -= 4
    }

    if (leftovers >= 2) {
        borders.bottom = true
        leftovers -= 2
    }

    if (leftovers >= 1) {
        borders.left = true
        leftovers -= 1
    }

    return borders
}

function assignBorders($el, border) {
    ['top', 'right', 'left', 'bottom'].forEach(function(type) {
        if (border[type]) {
            $el.className = $el.className + ' b-'+type
        }
    })
}

function getCell(x, y, startsFromZero = false) {
    if (startsFromZero) {
        x = x+1
        y = y+1
    }

    if (x > maze.width || x < 1 || y > maze.height || y < 1) {
        return null
    }

    return $canvas.children[x - 1 + (y - 1) * maze.width]
}

function findWay(ex, ey, sx, sy) {
    const map = makeEmptyMap()
    let mx = sx-1
    let my = sy-1
    let found = false

    map[my][mx] = 0
    getCell(mx, my, true).innerHTML = 0

    markAround(sx, sy)

    function markAround(x, y) {
        let mx = x-1
        let my = y-1

        const count = map[my][mx]

        if (!maze.data[my][mx].top) {
            let nx = mx
            let ny = (my >= maze.height-1) ? 0 : my+1

            handleNextCell(nx, ny, count)
        }
        if (!maze.data[my][mx].right) {
            let ny = my
            let nx = (mx >= maze.width-1) ? 0 : mx+1

            handleNextCell(nx, ny, count)
        }
        if (!maze.data[my][mx].bottom) {
            let nx = mx
            let ny = (my <= 0) ? maze.height-1 : my-1

            handleNextCell(nx, ny, count)
        }
        if (!maze.data[my][mx].left) {
            let ny = my
            let nx = (mx <= 0) ? maze.width-1 : mx-1

            handleNextCell(nx, ny, count)
        }

        function handleNextCell(nx, ny, count) {
            if (map[ny][nx] !== null && map[ny][nx] < count+1) {
                return
            }

            map[ny][nx] = count+1
            getCell(nx, ny, true).innerHTML = count+1

            if (nx+1 == ex && ny+1 == ey) {
                found = true
            }


            setTimeout(function() {
                if (!found) {
                    markAround(nx+1, ny+1)
                }
            }, 0)
        }
    }

    function makeEmptyMap() {
        const map = []
        maze.data.forEach(function(row, y) {
            map[y] = []
            row.forEach(function(n, x) {
                map[y][x] = null
            })
        })
        return map
    }
}

