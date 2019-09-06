import { TweenLite, TimelineLite } from 'gsap';

let odometer = 0;

window.onload = () => {
    const tl = new TimelineLite();

    // MainHeading
    tl.to('#papa', 1, { opacity: 1 });
    tl.to('#happy_birthday', 1, { opacity: 1 })
    tl.to('#text_roulette', 1, { opacity: 1, fill: '#efad36', delay: 4 })
    tl.to('#roulette_love', 2, { opacity: 0, display: 'none' })
    tl.to('#roulette_longeviety', 2, { opacity: 1, display: 'block' })
    tl.to('.first-slide__wish', 1, { opacity: 1 });

    TweenLite.to('#odometer', 1, { opacity: '1', delay: 1.5 });
    TweenLite.to('#odometer_title', 1, { transform: 'translateX(0)', delay: 1 });
    TweenLite.to('#letter_l', 0.5, { opacity: '1', transform: 'translateY(0)', delay: 2 });
    TweenLite.to('#letter_l', 0.2, { transform: 'translateY(-20px)', delay: 2.5 });
    TweenLite.to('#letter_l', 0.2, { transform: 'translateY(0)', delay: 2.7 });
    setTimeout(() => {
        animateToNumber(50);
    }, 3000);
    setTimeout(() => {
        animateToNumber(250, true);
    }, 10000);
    setTimeout(() => {
        changeSlides();
        setTimeout(() => {
            const oldSection = document.querySelector('.first-slide');
            const section = document.querySelector('.second-slide');
            section.classList.remove('inactive-slide');
            oldSection.innerHTML = '';
        }, 3500);
    }, 16000);
};

function animateBalloons() {
    const tl = new TimelineLite();
    tl.to('#friends-family', 2, { opacity: '1' })
    tl.to('#recorded', 2, { opacity: '1' });
    setTimeout(() => {
        document.querySelectorAll('.second-slide__balloons-item').forEach((el) => {
            TweenLite.to(el, Math.random() * 2.5 + 2.5, { transform: 'translateY(0)' });
            el.addEventListener('click', isolateSingleBalloon, false);
        });
    }, 4000);
}

function isolateSingleBalloon(event) {
    const tl = new TimelineLite();
    const target = event.target;
    const other = Array.from(document.querySelectorAll('.second-slide__balloons-item')).filter((el) => el !== target);
    other.forEach((balloon) => {
        TweenLite.to(balloon, 1, { opacity: 0 });
        TweenLite.to(balloon, 1, { 'display': 'none', delay: 1 });
    });
    tl.to('.second-slide__words', 1, { 'max-height': '20px', overflow: 'hidden', delay: 1 });
    setVideo(target.id);
    setTimeout(() => {
        openModal(other);
    }, 2000);
}

function setVideo(person) {
    document.getElementById('video-container').innerHTML = videos[person] ? videos[person] : '';
}

function openModal(other) {
    const modal = document.getElementById("modal-window");
    const closer = document.getElementById("modal-close");
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    closer.onclick = function () {
        closeModal(modal, other);
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal(modal, other);
        }
    }
}

function changeSlides() {
    TweenLite.to('#papa', 3, { transform: 'translateX(-100%)', opacity: 0 });
    TweenLite.to('#text_roulette', 3, { transform: 'translateX(-100%)', opacity: 0 });

    TweenLite.to('#happy_birthday', 3, { transform: 'translateX(100%)', opacity: 0 });
    TweenLite.to('.first-slide__choose-age', 3, { transform: 'translateX(100%)', opacity: 0 });
    TweenLite.to('.first-slide', 2, { 'background-color': '#E7F5FA', delay: 1 });
    setTimeout(() => {
        animateBalloons();
    }, 3500);
}

function closeModal(modal, other) {
    modal.style.display = "none";
    setVideo();

    other.forEach((balloon) => {
        TweenLite.to(balloon, 1, { 'display': 'list-item' });
        TweenLite.to(balloon, 1, { opacity: 0.7, delay: 1 });
    });
    TweenLite.to('.second-slide__words', 1, { 'max-height': '300px', overflow: 'initial', delay: 2 });
}

// TODO: animation on wish block hover - background on input #f6eaeb
function animateToNumber(newNumber, superfast) {
    const frameDuration = superfast ? 0.05 : 0.15;
    if (!newNumber || newNumber < 1 || newNumber > 999) {
        throw new Error(`Некорректное значение одометра: ${newNumber}`);
    } else if (newNumber < odometer) {
        throw new Error(`Одометр не крутится назад! Текущее: ${odometer}, Новое: ${newNumber}`);
    }
    const timeline = new TimelineLite();
    while (odometer < newNumber) {
        const units = getUnits(odometer);
        const tens = getTens(odometer);
        const hundreds = getHundreds(odometer);
        if (units === 9) {
            timeline.to('#number_3', frameDuration / 2, { [property]: ABOVE_NINE });
            TweenLite.set('#number_3', 0, { [property]: SUBZERO });
            if (tens === 9) {
                timeline.to('#number_2', frameDuration / 2, { [property]: ABOVE_NINE });
                TweenLite.set('#number_2', 0, { [property]: SUBZERO });
                timeline.to('#number_1', frameDuration / 2, { [property]: mapValToPercents(hundreds + 1) });
                timeline.to('#number_2', frameDuration / 2, { [property]: ZERO });
            }
            timeline.to('#number_2', frameDuration / 2, { [property]: mapValToPercents(tens + 1) });
            timeline.to('#number_3', frameDuration / 2, { [property]: ZERO });
        } else {
            const nextTick = units + 1;
            timeline.to('#number_3', frameDuration / 2, { [property]: mapValToPercents(nextTick) });
        }
        odometer += 1;
    }
}

function getHundreds(source) {
    const str = source.toString();
    const finish = str.length;
    return finish !== 3 ? 0 : parseInt(str.substring(0, 1));
}
function getTens(source) {
    const str = source.toString();
    const finish = str.length;
    return finish === 1 ? 0 : parseInt(str.substring(finish - 2, finish - 1));
}
function getUnits(source) {
    const str = source.toString();
    const finish = str.length;
    return parseInt(str.substring(finish - 1, finish));
}

function increaseUnits(newVal) {
    const framesPerSec = 5;
    const newCssValues = { [property]: mapValToPercents(newVal) };
    console.log(newCssValues);
    TweenLite.to('#number_3', getTimeToAnimate(newVal, framesPerSec), newCssValues);
    units = newVal;
}

function getTimeToAnimate(newValue, framesPerSec) {
    newValue = newValue === 0 ? 10 : newValue;
    console.log(`Time to animate: ${(newValue - units) / framesPerSec}`);
    return (newValue - units) / framesPerSec;
}

function mapValToPercents(val) {
    switch (val) {
        case 0:
            return ZERO;
        case 1:
            return ONE;
        case 2:
            return TWO;
        case 3:
            return THREE;
        case 4:
            return FOUR;
        case 5:
            return FIVE;
        case 6:
            return SIX;
        case 7:
            return SEVEN;
        case 8:
            return EIGHT;
        case 9:
            return NINE;
    }
}

/**
 * Values
 */
const ABOVE_NINE = '2.7%';
const NINE = '0.1%';
const EIGHT = '-2.45%';
const SEVEN = '-5.05%';
const SIX = '-7.6%';
const FIVE = '-10.2%';
const FOUR = '-12.75%';
const THREE = '-15.35%';
const TWO = '-17.9%';
const ONE = '-20.5%';
const ZERO = '-23.1%';
const SUBZERO = '-25%';
const property = 'background-position-y';
const selector = '.first-slide__odometer-numbers';

const videos = {
    "sonya": '<iframe width="560" height="315" src="https://www.youtube.com/embed/Hrw-zpqyGiM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><div id="sonya-drawing"></div>',
    "store": '<iframe width="560" height="315" src="https://www.youtube.com/embed/yTGvug8PSks" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><iframe width="560" height="315" src="https://www.youtube.com/embed/XmnMpSaFQGo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "artemwife": '<iframe width="560" height="315" src="https://www.youtube.com/embed/UiMRUyISZ00" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "zheltov": '<iframe width="560" height="315" src="https://www.youtube.com/embed/iT6ybVBkS0Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "kravtsov": '<iframe width="560" height="315" src="https://www.youtube.com/embed/FnBK6OrmdXk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "vlasov": '<iframe width="560" height="315" src="https://www.youtube.com/embed/A1t6IppZrSg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "ufa": '<iframe width="560" height="315" src="https://www.youtube.com/embed/1PG_ei5hwlk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "kostya": '<iframe width="560" height="315" src="https://www.youtube.com/embed/bnrCgyxi9lY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "lenya": '<iframe width="560" height="315" src="https://www.youtube.com/embed/M2iVCiFM07w" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "stepka": '<iframe width="560" height="315" src="https://www.youtube.com/embed/Hrw-zpqyGiM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "kalinina": '<iframe width="560" height="315" src="https://www.youtube.com/embed/n1sK7HglgHQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "ozerov": '<iframe width="560" height="315" src="https://www.youtube.com/embed/pgPyUsh8I1I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "zina": '<iframe width="560" height="315" src="https://www.youtube.com/embed/iWzeARatMfI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    "konovalova": '<iframe width="560" height="315" src="https://www.youtube.com/embed/6k3hVtGDKTY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' 
};