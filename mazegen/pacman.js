const OPPOSITES = {
    top: 'bottom',
    bottom: 'top',
    right: 'left',
    left: 'right',
}

let $active
let $canvas
let $cell
let x, y
let w, h

main()

function main() {
    $canvas = document.getElementById('canvas')

    createField()

    document.addEventListener('keydown', onKeyPress)
}


function createField() {
    $canvas.innerHTML = ''

    w = +document.getElementById('width').value
    h = +document.getElementById('height').value

    $canvas.style.width = w * 40 + 'px'
    $canvas.style.height = h * 40 + 'px'

    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            $cell = document.createElement('div')
            $cell.className = 'cell'
            $cell.innerHTML = `(${x + 1},${y + 1})`

            $cell.dataset.x = x + 1
            $cell.dataset.y = y + 1
            $cell.dataset.top = 0
            $cell.dataset.bottom = 0
            $cell.dataset.left = 0
            $cell.dataset.right = 0

            if (x == 0) {
                $cell.dataset.left = 1
                $cell.className += ' b-left'
            }
            if (y == 0) {
                $cell.dataset.bottom = 1
                $cell.className += ' b-bottom'
            }
            if (x == w-1) {
                $cell.dataset.right = 1
                $cell.className += ' b-right'
            }
            if (y == h-1) {
                $cell.dataset.top = 1
                $cell.className += ' b-top'
            }


            $cell.addEventListener('dblclick', onElementClick)

            $canvas.appendChild($cell)
        }
    }
}

function onElementClick($event) {
    setActive($event.target)
}

function onKeyPress($event) {
    if (!$active) {
        return
    }

    console.log($event.code)
    switch ($event.code) {
        case 'ArrowLeft':
            setActive(getCell(+$active.dataset.x - 1, +$active.dataset.y))
            break;
        case 'ArrowRight':
            setActive(getCell(+$active.dataset.x + 1, +$active.dataset.y))
            break;
        case 'ArrowUp':
            setActive(getCell(+$active.dataset.x, +$active.dataset.y + 1))
            break;
        case 'ArrowDown':
            setActive(getCell(+$active.dataset.x, +$active.dataset.y - 1))
            break;
        case 'Numpad2':
            setBorder($active, 'bottom')
            break;
        case 'Numpad4':
            setBorder($active, 'left')
            break;
        case 'Numpad6':
            setBorder($active, 'right')
            break;
        case 'Numpad8':
            setBorder($active, 'top')
            break;
        case 'Numpad1':
            setBorder($active, 'bottom')
            setBorder($active, 'left')
            break;
        case 'Numpad7':
            setBorder($active, 'left')
            setBorder($active, 'top')
            break;
        case 'Numpad9':
            setBorder($active, 'right')
            setBorder($active, 'top')
            break;
        case 'Numpad3':
            setBorder($active, 'right')
            setBorder($active, 'bottom')
            break;
    }
}

function getCell(x, y) {
    if (x > w || x < 1 || y > h || y < 1) {
        return null
    }

    return $canvas.children[x - 1 + (y - 1) * w]
}

function setActive($cell) {
    if ($active) {
        toggleClass($active, 'active')
    }

    $active = $cell
    toggleClass($active, 'active')
}

function toggleClass($el, className) {
    if ($el.className.indexOf(className) == -1) {
        $el.className = $el.className + ' ' + className
    } else {
        $el.className = $el.className.replace(className, '')
    }
}

function setBorder($cell, type) {
    var $adjacent

    switch (type) {
        case 'top':
            $adjacent = getCell($cell.dataset.x, +$cell.dataset.y + 1)
            break;
        case 'bottom':
            $adjacent = getCell($cell.dataset.x, +$cell.dataset.y - 1)
            break;
        case 'left':
            $adjacent = getCell(+$cell.dataset.x - 1, +$cell.dataset.y)
            break;
        case 'right':
            $adjacent = getCell(+$cell.dataset.x + 1, +$cell.dataset.y)
            break;
    }

    toggleClass($cell, ' b-' + type)
    $cell.dataset[type] = +!+$cell.dataset[type]
    if ($adjacent) {
        toggleClass($adjacent, 'b-' + OPPOSITES[type])
        $adjacent.dataset[OPPOSITES[type]] = +!+$adjacent.dataset[OPPOSITES[type]]
    }
}

function bordersToNumber($el) {
    var binary = $el.dataset.top + $el.dataset.right
        + $el.dataset.bottom + $el.dataset.left

    return Number(parseInt(binary, 2)).toString(16)
}

function saveBorders() {
    console.log($canvas.children)
    var i
    var result = ''

    for (i = 0; i < $canvas.children.length; i++) {
        result += bordersToNumber($canvas.children[i])

        if (i % w == w-1) {
            result += '\n'
        }
    }

    return result
}

function download() {
    var element = document.createElement('a');
    var text = saveBorders()

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'maze.dat');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
