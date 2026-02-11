var thisVar
var SpriteAnimation = function() {
    thisVar = this
    this.count = 0
    this.posL = 0
    this.posTop = 0
    this.totalFrame = 0
    this.imgWidth = 0
    this.imgHeight = 0
    this.colCount = 0
    this.rowCount = 0
    this.speed = 0
    this.repeatAni = false
    this.spriteAnimInterval = null
}

SpriteAnimation.prototype.spriteAnim = function(objName, totalFrame, imgWidth, imgHeight, colCount, rowCount, aniSpeed, repeatAni) {
    this.count = 0
    this.posL = 0
    this.posTop = 0
    this.totalFrame = totalFrame
    this.imgWidth = imgWidth
    this.imgHeight = imgHeight
    this.colCount = colCount
    this.rowCount = rowCount
    this.speed = aniSpeed
    this.repeatAni = repeatAni

    this.spriteAnimInterval = setInterval(function() {
        thisVar.count++
            if (thisVar.count <= thisVar.totalFrame) {
                if (thisVar.count == 1) {
                    objName.css({
                        'background-position': '0px 0px'
                    })
                } else {
                    if (Number(thisVar.count % thisVar.colCount) != 0) {
                        thisVar.posL -= thisVar.imgWidth
                    } else {
                        thisVar.posL = 0
                        thisVar.posTop -= thisVar.imgHeight
                    }
                    objName.css({
                        'background-position': +thisVar.posL + 'px ' + thisVar.posTop + 'px'
                    })
                }
            } else {
                thisVar.count = 0
                thisVar.posL = 0
                thisVar.posTop = 0

                if (!thisVar.repeatAni) {
                    clearInterval(thisVar.spriteAnimInterval)
                } else {
                    objName.css({
                        'background-position': '0px 0px'
                    })
                }
            }
    }, thisVar.speed)
}

SpriteAnimation.prototype.clearAnimation = function() {
    console.log(this.spriteAnimInterval);
    clearInterval(this.spriteAnimInterval)
	this.spriteAnimInterval = null;
	this.count = 0
    this.posL = 0
    this.posTop = 0
    this.totalFrame = 0
    this.imgWidth = 0
    this.imgHeight = 0
    this.colCount = 0
    this.rowCount = 0
    this.speed = 0
    this.repeatAni = false
	console.log("clear", this.spriteAnimInterval);
}