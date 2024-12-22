
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});


const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });

            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
});


const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});



const gridConfig = {
    minSquares: 1,
    maxSquares: 9,
    numColumns: 3,
    minWickSize: 1,
    maxWickSize: 3,
    minGap: 1,
    minOpacity: 0.05,
    maxOpacity: 0.3,
    squareSize: 40
};

function createGridOverlay() {
    const existingOverlay = document.querySelector('.grid-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'grid-overlay';

    const columns = Math.ceil(window.innerWidth / gridConfig.squareSize);
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'grid-column';
        overlay.appendChild(column);
    }

    document.body.appendChild(overlay);
    return overlay;
}

let lastColumnIndex = -1;

function handleGridEffect(e) {
    const rect = document.querySelector('.grid-overlay').getBoundingClientRect();
    const columns = document.querySelectorAll('.grid-column');
    const currentColumnIndex = Math.floor((e.clientX - rect.left) / gridConfig.squareSize);

    if (currentColumnIndex !== lastColumnIndex) {
        lastColumnIndex = currentColumnIndex;


        columns.forEach(col => {
            while (col.firstChild) {
                col.removeChild(col.firstChild);
            }
        });


        const opacities = Array(gridConfig.numColumns).fill(0).map(() => {
            return gridConfig.minOpacity + Math.random() * (gridConfig.maxOpacity - gridConfig.minOpacity);
        });


        opacities[Math.floor(Math.random() * opacities.length)] = gridConfig.maxOpacity;


        const usedIndices = new Set();
        const forbiddenIndices = new Set();
        let velaCount = 0;

        for (let i = 0; i < gridConfig.numColumns; i++) {
            let randomColumnIndex;
            let attempts = 0;
            const maxAttempts = 100;

            do {
                randomColumnIndex = Math.floor(Math.random() * columns.length);
                attempts++;
                if (attempts > maxAttempts) break;
            } while (usedIndices.has(randomColumnIndex) ||
                forbiddenIndices.has(randomColumnIndex));

            if (attempts > maxAttempts) continue;

            usedIndices.add(randomColumnIndex);
            forbiddenIndices.add(randomColumnIndex);
            for (let gap = 1; gap <= gridConfig.minGap; gap++) {
                forbiddenIndices.add(randomColumnIndex - gap);
                forbiddenIndices.add(randomColumnIndex + gap);
            }

            const column = columns[randomColumnIndex];
            const currentOpacity = opacities[velaCount];


            const vela = document.createElement('div');
            vela.className = 'vela';


            const numSquares = Math.floor(Math.random() *
                (gridConfig.maxSquares - gridConfig.minSquares + 1)) +
                gridConfig.minSquares;

            const height = numSquares * gridConfig.squareSize;


            const maxTop = window.innerHeight - height;
            const top = Math.floor(Math.random() * maxTop);


            vela.style.setProperty('--opacity', currentOpacity);
            vela.style.height = `${height}px`;
            vela.style.top = `${top}px`;


            const topWick = document.createElement('div');
            topWick.className = 'wick top-wick';
            topWick.style.height = `${gridConfig.squareSize *
                (Math.floor(Math.random() *
                    (gridConfig.maxWickSize - gridConfig.minWickSize + 1)) +
                    gridConfig.minWickSize)}px`;

            const bottomWick = document.createElement('div');
            bottomWick.className = 'wick bottom-wick';
            bottomWick.style.height = `${gridConfig.squareSize *
                (Math.floor(Math.random() *
                    (gridConfig.maxWickSize - gridConfig.minWickSize + 1)) +
                    gridConfig.minWickSize)}px`;

            vela.appendChild(topWick);
            vela.appendChild(bottomWick);
            column.appendChild(vela);

            velaCount++;
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    createGridOverlay();
    document.addEventListener('mousemove', handleGridEffect);
});


let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        createGridOverlay();
        lastColumnIndex = -1;
    }, 250);
});


function updateGridConfig(minSquares, maxSquares, numColumns = 3, minWickSize = 0.3, maxWickSize = 3, minGap = 1) {
    gridConfig.minSquares = Math.max(1, minSquares);
    gridConfig.maxSquares = Math.min(Math.max(minSquares, maxSquares), 20);
    gridConfig.numColumns = numColumns;
    gridConfig.minWickSize = minWickSize;
    gridConfig.maxWickSize = maxWickSize;
    gridConfig.minGap = minGap;
    lastColumnIndex = -1;
}
function r(from, to) {
    return ~~(Math.random() * (to - from + 1) + from);
}

function pick() {
    return arguments[r(0, arguments.length - 1)];
}

function getChar() {
    return String.fromCharCode(pick(
        r(0x3041, 0x30ff),
        r(0x2000, 0x206f),
        r(0x0020, 0x003f)
    ));
}

function loop(fn, delay) {
    let stamp = Date.now();
    function _loop() {
        if (Date.now() - stamp >= delay) {
            fn();
            stamp = Date.now();
        }
        requestAnimationFrame(_loop);
    }
    requestAnimationFrame(_loop);
}

class Char {
    constructor() {
        this.element = document.createElement('span');
        this.mutate();
    }
    mutate() {
        this.element.textContent = getChar();
    }
}

class Trail {
    constructor(list = [], options) {
        this.list = list;
        this.options = Object.assign(
            { size: 10, offset: 0 }, options
        );
        this.body = [];
        this.move();
    }
    traverse(fn) {
        this.body.forEach((n, i) => {
            let last = (i == this.body.length - 1);
            if (n) fn(n, i, last);
        });
    }
    move() {
        this.body = [];
        let { offset, size } = this.options;
        for (let i = 0; i < size; ++i) {
            let item = this.list[offset + i - size + 1];
            this.body.push(item);
        }
        this.options.offset =
            (offset + 1) % (this.list.length + size - 1);
    }
}

class Rain {
    constructor({ target, row }) {
        this.element = document.createElement('p');
        this.build(row);
        if (target) {
            target.appendChild(this.element);
        }
        this.drop();
    }
    build(row = 20) {
        let root = document.createDocumentFragment();
        let chars = [];


        const fujiPosition = r(0, row - 5);
        const word = "ALCHDAO";

        for (let i = 0; i < row; ++i) {
            let c = new Char();


            if (i >= fujiPosition && i < fujiPosition + word.length) {
                c.element.textContent = word[i - fujiPosition];
                c.element.classList.add('fuji-letter');
            }

            root.appendChild(c.element);
            chars.push(c);


            if (Math.random() < .5 && (i < fujiPosition || i >= fujiPosition + word.length)) {
                loop(() => c.mutate(), r(1e3, 5e3));
            }
        }

        this.trail = new Trail(chars, {
            size: r(10, 30),
            offset: r(0, 100)
        });
        this.element.appendChild(root);
    }
    drop() {
        let trail = this.trail;
        let len = trail.body.length;
        let delay = r(10, 100);
        loop(() => {
            trail.move();
            trail.traverse((c, i, last) => {
                if (c.element.classList.contains('fuji-letter')) {
                    c.element.style = `
                        color: #fff;
                        text-shadow: 0 0 8px #fff;
                    `;
                } else {
                    c.element.style = `
                        color: hsl(286, 92%, ${60 / len * (i + 1)}%)
                    `;
                    if (last) {
                        c.mutate();
                        c.element.style = `
                            color: hsl(286, 92.1%, 60.2%);
                            text-shadow:
                                0 0 .5em #fff,
                                0 0 .5em currentColor;
                        `;
                    }
                }
            });
        }, delay);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.querySelector('.banner-container');
    const logo = document.querySelector('.logo-container');
    const pumpButton = document.querySelector('.pop-title .join-button');
    const heroImage = document.querySelector('.pop-hero-image');


    const candleEffect = document.createElement('div');
    candleEffect.className = 'candle-effect';
    document.body.appendChild(candleEffect);

    function startCandleEffect() {
        candleEffect.classList.add('active');


        setTimeout(() => {
            candleEffect.classList.remove('active');
        }, 3000);
    }

    function startMatrixEffect() {
        const effectContainer = document.createElement('div');
        effectContainer.className = 'matrix-effect';

        const main = document.createElement('main');
        effectContainer.appendChild(main);

        const messageContainer = document.createElement('div');
        messageContainer.className = 'matrix-message';
        messageContainer.innerHTML = `
            <div class="typing-text">Follow ALCHDAO  </div>
        `;
        effectContainer.appendChild(messageContainer);

        document.body.appendChild(effectContainer);
        effectContainer.classList.add('active');

        for (let i = 0; i < 50; ++i) {
            new Rain({ target: main, row: 50 });
        }

        setTimeout(() => {
            messageContainer.classList.add('show');
        }, 500);

        setTimeout(() => {
            messageContainer.classList.remove('show');
            effectContainer.classList.remove('active');
            setTimeout(() => {
                effectContainer.remove();
            }, 100);
        }, 3000);
    }

    if (banner) banner.addEventListener('click', startMatrixEffect);
    if (logo) logo.addEventListener('click', startMatrixEffect);
    if (pumpButton) pumpButton.addEventListener('click', startCandleEffect);
    if (heroImage) heroImage.addEventListener('click', startCandleEffect);
});


document.querySelector('.pop-title').addEventListener('click', pumpitFunction);

document.querySelector('.pop-hero-image').addEventListener('click', pumpitFunction);

function pumpitFunction() {
    const popWord = document.querySelector('.pop-word');
    const animations = popWord.getAnimations();

    animations.forEach(anim => {
        anim.cancel();
        anim.play();
    });

    setTimeout(() => {
        popWord.classList.add('expand');


        const multiplierContainer = document.createElement('div');
        multiplierContainer.className = 'multiplier-container';
        document.body.appendChild(multiplierContainer);


        const multipliers = [
            { text: 'x10', size: 34 },
            { text: 'x50', size: 38 },
            { text: 'x100', size: 44 },
            { text: 'x250', size: 50 },
            { text: 'x500', size: 56 },
            { text: 'x1300', size: 65 }
        ];
        let currentMultiplier = 0;


        function addMultiplier() {
            if (currentMultiplier < multipliers.length) {
                const multiplier = document.createElement('div');
                multiplier.className = 'multiplier';
                multiplier.textContent = multipliers[currentMultiplier].text;
                multiplier.style.fontSize = `${multipliers[currentMultiplier].size}px`;

                const screenHeight = window.innerHeight;
                const totalHeight = screenHeight * 0.4;
                const spacing = totalHeight / (multipliers.length - 1);
                const startY = screenHeight - (screenHeight - totalHeight) / 2;
                const topPosition = startY - (spacing * currentMultiplier);

                multiplier.style.top = `${topPosition}px`;

                multiplierContainer.appendChild(multiplier);
                setTimeout(() => multiplier.classList.add('show'), 50);

                currentMultiplier++;

                if (currentMultiplier < multipliers.length) {
                    setTimeout(addMultiplier, 300);
                }
            }
        }

        let scrollDuration = 2000;
        let scrollStep = -window.scrollY / (scrollDuration / 15);

        function smoothScroll() {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
                requestAnimationFrame(smoothScroll);
            }
        }

        smoothScroll();
        addMultiplier();

        setTimeout(() => {
            document.body.classList.add('fade-out');
            multiplierContainer.remove();
            setTimeout(() => {
                window.location.reload();
            }, 300);
        }, 2000);
    }, 1000);
}



function decodeText() {
    const texts = document.getElementsByClassName('decode-text');

    Array.from(texts).forEach(text => {

        const letters = text.getElementsByClassName('text-animation');
        let state = [];


        for (let i = 0; i < letters.length; i++) {
            letters[i].classList.remove('state-1', 'state-2', 'state-3');
            state[i] = i;
        }

        const shuffled = shuffle(state);

        shuffled.forEach((index, i) => {
            const letter = letters[index];
            const state1Time = Math.round(Math.random() * (2000 - 300)) + 50;
            setTimeout(() => firstStages(letter), state1Time);
        });
    });
}


function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


function firstStages(child) {
    if (child.classList.contains('state-2')) {
        child.classList.add('state-3');
    } else if (child.classList.contains('state-1')) {
        child.classList.add('state-2')
    } else if (!child.classList.contains('state-1')) {
        child.classList.add('state-1');
        setTimeout(() => secondStages(child), 100);
    }
}

function secondStages(child) {
    if (child.classList.contains('state-1')) {
        child.classList.add('state-2')
        setTimeout(() => thirdStages(child), 100);
    } else if (!child.classList.contains('state-1')) {
        child.classList.add('state-1')
    }
}

function thirdStages(child) {
    if (child.classList.contains('state-2')) {
        child.classList.add('state-3')
    }
}


function startContinuousAnimation() {
    decodeText();
    setTimeout(() => {

        document.querySelectorAll('.text-animation').forEach(letter => {
            letter.classList.remove('state-1', 'state-2', 'state-3');
        });
        requestAnimationFrame(startContinuousAnimation);
    }, 6000);
}


document.addEventListener('DOMContentLoaded', () => {

    startContinuousAnimation();


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const textElements = element.getElementsByClassName('text-animation');
                Array.from(textElements).forEach(letter => {
                    letter.classList.remove('state-1', 'state-2', 'state-3');
                });
                decodeText();
            }
        });
    }, {
        threshold: 0.1
    });


    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
});



