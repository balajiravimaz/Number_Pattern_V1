var indicator = null

function indicatorAnimation() {
	
	
    indicator = TweenMax.to($('#f_nextIndicator'), 0.3, {

        css: {
            top: -35
        },
        ease: Linear.easeIn,
        onComplete: function() {
            TweenMax.to($('#f_nextIndicator'), 0.3, {
                css: {
                    top: -30
                },
                ease: Linear.easeIn,
                onComplete: function() {
                    indicatorAnimation();
                }
            })
        }
		
    })

}

function animateZoomfromTo(_el, _dur, _scale, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    });

    var tl = new TimelineLite({
        paused: true
    }).to(_el, _dur, {
        scale: _scale,
        marginLeft: _pos + 'px'

    });

    return tl;
}

function fnScaleTo(_el, scaleVal) {
    TweenLite.set(_el, {
        clearProps: 'all'
    });
    var tl = new TimelineLite({
        paused: true
    }).to(_el, 0.2, {
        css: {
            scaleX: scaleVal,
            scaleY: scaleVal
        },
        ease: Back.easeOut,

    });
    return tl;

}


function animateFadeIn(_el, _duration) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        opacity: 1,
        display: "block"
    })
    return tl
}

function animateFadeInWoDisplay(_el, _duration) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        opacity: 1
    })
    return tl
}



function animateFadeOut(_el, _duration) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        opacity: 0,
        display: "none"
    })
    return tl
}

function animateFadeOutWoDisplay(_el, _duration) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        opacity: 0
    })
    return tl
}

function animateFromLeft(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        left: _pos
    })
    return tl
}

function animateFromLeftWithDisplay(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        left: _pos,
        display: 'block'
    })
    return tl
}

function animateFromLeftWoDisplay(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        left: _pos
    })
    return tl
}

function animateFromRight(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        right: _pos
    })
    return tl
}

function animateFromRightWoDisplay(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        right: _pos
    })
    return tl
}

function animateFromTop(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        top: _pos,
        display: 'block'
    })
    return tl
}

function animateFromTopWoDisplay(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        top: _pos
    })
    return tl
}

function animateFromBottom(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        bottom: _pos
    })
    return tl
}

function animateFromBottomWoDisplay(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        bottom: _pos,
        display: 'block'
    })
    return tl
}

function animateFromMarginLeft(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        marginLeft: _pos + 'px',
        display: "block"
    })
    return tl
}

function animateFromMarginTop(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        marginLeft: _pos + 'px',
        display: "block"
    })
    return tl
}

function animateFromMarginRight(_el, _duration, _pos) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        alpha: 1,
        marginRight: _pos + 'px',
        display: "block"
    })
    return tl
}

function animatePaddingBottom(_el, _duration, _size) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        paddingBottom: _size + 'px'
    })
    return tl
}

function animateFadeInAndFadeOut(el, duration, delaytime) {
    TweenLite.set(el, {
        clearProps: 'opacity'
    })
    var tl = new TimelineLite({
        paused: true
    }).from(el, duration, {
        autoAlpha: 0
    }).to(el, duration, {
        autoAlpha: 0
    }, delaytime)
    return tl
}

function animateFadeInDisplayBlock(_el, _duration) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        opacity: 1
    })
    return tl
}

function animateOutDisplayNone(el) {
    TweenLite.set(el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(el, 1, {
        opacity: 0,
        display: 'none'
    })
    return tl
}

function animateDisplayBlock(el) {
    TweenLite.set(el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(el, 0.3, {
        display: 'block'
    })
    return tl
}

function animateDisplayNone(el) {
    TweenLite.set(el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(el, 0.3, {
        display: 'none'
    })
    return tl
}

function animateChangeWidth(_el, _duration, _width) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        width: _width,
        display: 'block'
    })
    return tl
}

function animateChangeWidthNone(_el, _duration, _width) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        width: _width,
        display: 'none'
    })
    return tl
}

function animateChangeWidthWoDisplay(_el, _duration, _width) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        width: _width
    })
    return tl
}

function animateChangeHeight(_el, _duration, _height) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        height: _height,
        display: 'block'
    })
    return tl
}

function animateChangeHeightWoDisplay(_el, _duration, _height) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        height: _height
    })
    return tl
}

function animateIntroBg(_el, _scale, _duration) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        css: {
            scale: _scale,
            opacity: 1
        }
    })
    return tl
}

function animateScale(_el, _duration, _scale) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        css: {
            scale: _scale,
            opacity: 1
        }
    })
    return tl
}

function animateScaleElastic(_el, _duration, _scale) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        css: {
            scale: _scale,
            opacity: 1,
            ease: Elastic.easeOut
        }
    })
    return tl
}


function animateScaleX(_el, _duration, _scale) {
    TweenLite.set(_el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(_el, _duration, {
        css: {
            scaleX: _scale,
            opacity: 1
        }
    })
    return tl
}

function fnAnimateStaggerLeftTo(id, opacityVal, leftVal, topVal) {
    TweenLite.set(id, {
        clearProps: 'all'
    });
    var tl = new TimelineLite({
        paused: true
    }).staggerTo(id, 0.3, {
        autoAlpha: opacityVal,
        left: leftVal + "px",
        top: topVal + "px",
        transformOrigin: "right bottom",
        ease: Back.easeIn
    }, 2);
    return tl;
}
function animateDisplayBorder(el) {
    TweenLite.set(el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(el, 0.3, {
        "border": '3px dashed #7a130D'
    })
    return tl
}
function animateDisplayBordernone(el) {
    TweenLite.set(el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(el, 0.3, {
        "border": '1px solid #747480'
    })
    return tl
}
function animateDisplayBorder1px(el) {
    TweenLite.set(el, {
        clearProps: 'all'
    })
    var tl = new TimelineLite({
        paused: true
    }).to(el, 0.3, {
        "border": '1px solid #747480'
    })
    return tl
}

function animateDisplayRedOutline(el) {
    TweenLite.set(el, {
        clearProps: 'all'
    });
    var tl = new TimelineLite({
        paused: true
    }).to(el, 10, { outline: '3px solid #FF4136' })
    .to(el, 0.3, { outline: 'none' })
    .to(el, 0.5, { outline: '3px solid #FF4136' })
    .to(el, 0.3, { outline: 'none' })
    .to(el, 0.5, { outline: '3px solid #FF4136' })
    .to(el, 0.3, { outline: 'none' })
    .to(el, 0.5, { outline: '3px solid #FF4136' })
    .to(el, 0.3, { outline: 'none' })
    .to(el, 0.5, { outline: '3px solid #FF4136' });
    return tl;
}
 
 
function animateRemoveRedOutline(el) {
    TweenLite.set(el, {
        clearProps: 'all'
    });
 
    var tl = new TimelineLite({
        paused: true
    }).to(el, 0.3, {
        outline: 'none'
    });
    return tl;
}
function animateRemoveClipPath(el) {
    TweenLite.set(el, {
        clearProps: 'all'
    });
 
    var tl = new TimelineLite({
        paused: true
    }).to(el, 0.3, {
        clipPath: 'inset(0 0 0 0)'
    });
 
    return tl;
}