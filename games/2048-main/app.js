import gameOptions from "./gameconfig.js"

import Play from './Play.js'
import Boot from './Boot.js'

window.onload = ()=>{

    // config size doesnt == screen size, is more of an esoteric representation
    const config = {
        type: Phaser.AUTO,
        backgroundColor: Phaser.Display.Color.GetColor(240, 240, 240),

        // Your virtual game size
        width: gameOptions.virtualwidth,
        height: gameOptions.virtualheight,

        scale: {
        mode: Phaser.Scale.FIT,              // keep aspect ratio, fit inside viewport
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true
        },

        // Optional but often helps on mobile
        render: { pixelArt: false, antialias: true },

        scene: [Boot, Play],
    };

    let game = new Phaser.Game(config)
    window.focus(); /* Sometimes, especially when the game page is running in a iframe and it's
    controlled by keyboard, if you don't focus the window, keyboard controls simply
    won't work*/
    resizeGame(game)
    window.addEventListener('resize',()=>{
        resizeGame(game)
    })

}

function resizeGame(game){
    let canvas = document.querySelector('canvas')
    // this works on mobiles but not in desktop: window.screen.width 

    let windowWidth =  window.innerWidth;
    let windowHeight =  window.innerHeight;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        // maybe this is needed only for the chrome devtools
        // some mobiles still escape
        console.log('mobile')
        windowWidth = window.screen.width 
        windowHeight = window.screen.height 
    }

    let  windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width/ game.config.height;
    if (windowRatio < gameRatio){
        canvas.style.width = windowWidth + 'px'
        canvas.style.height = (windowWidth/gameRatio) + 'px'
    } else {
        canvas.style.width = (windowHeight*gameRatio) + 'px'
        canvas.style.height = (windowHeight) + 'px'
    }

}