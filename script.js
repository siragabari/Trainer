"use-strict";

let trainer = document.getElementById("trainer");
let color = "transparent";
let harmony = 0;
let inputColor = {'h': 0, 's': 100, 'l': 50};

fetch("trainer-01.svg")
.then(function (response) {
    return response.text();
})
.then(function (elementToPaint) {
    trainer.innerHTML = elementToPaint;
    document.getElementById("tab").classList.add("g_to_interact_with");
    document.getElementById("arch").classList.add("g_to_interact_with");
    document.getElementById("quarter").classList.add("g_to_interact_with");
    document.getElementById("toeCap").classList.add("g_to_interact_with");
    document.getElementById("sole").classList.add("g_to_interact_with");
    document.getElementById("toeVamp").classList.add("g_to_interact_with");
    document.getElementById("logo").classList.add("g_to_interact_with");
    document.getElementById("inside").classList.add("g_to_interact_with");
    document.getElementById("tongue").classList.add("g_to_interact_with");
    document.getElementById("laces").classList.add("g_to_interact_with");
    start();
})

function start() {
    selectHarmony();
    createColors();
    selectColor();
    document.querySelectorAll(".g_to_interact_with").forEach(selectTrainerPart);
}

function selectColor() {
    let colors = document.querySelectorAll(".colorDisplay");
    colors.forEach(function(c) {
        c.addEventListener("click", function() {
            for(let i=0; i<colors.length; i++) {
                colors[i].setAttribute("stroke", "grey");
                colors[i].setAttribute("stroke-width", "0.2");
            }
            c.setAttribute("stroke", "lightgrey");
            c.setAttribute("stroke-width", "7");
            color = this.getAttribute("fill");
        });
    });
}

function selectTrainerPart(element) {
    hovering(element);
    element.addEventListener('click', function() {
        element.querySelectorAll('*').forEach(function(e) {
            e.setAttribute("fill", color);
        });
    });
}

function hovering(element) {
    element.addEventListener('mouseover', function() {
        element.querySelectorAll('*').forEach(function(e) {
            e.classList.add("over");
        });
    });
    element.addEventListener('mouseout', function() {
        element.querySelectorAll('*').forEach(function(e) {
            e.classList.remove("over");
        });
    });
}


/**
 * CREATE THE COLOR PALETTE
 */

function createColors() {
    displayColors(inputColor);
    const color = document.getElementById("color");
    color.addEventListener('input', function() {
        const hex = color.value;
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb);
        inputColor = hsl;
        displayColors(hsl);
    });
}

function displayColors(hsl) {
    const colors = getColors(hsl);
    for (let i=0; i<colors.length; i++) {
        let colorDisplay = document.getElementById("colorDisplay" + (i+1));
        colorDisplay.setAttribute("fill", parseHsl(colors[i].h, colors[i].s, colors[i].l));
    }
}

function selectHarmony() {
    let harmonies = document.querySelectorAll(".checkbox");
    harmonies.forEach(function(box) {
        box.addEventListener('click', function() {
            harmony = parseInt(box.value);
            for (let i=0; i < harmonies.length; i++) {
                harmonies[i].checked = false;
            }
            harmonies[harmony].checked = true;
            color = "transparent";
            const colors = document.getElementsByClassName("colorDisplay");
            for(let i=0; i<colors.length; i++) {
                colors[i].setAttribute("stroke", "grey");
                colors[i].setAttribute("stroke-width", "0.2");
            }
            createColors();
        });
    });
}

function getColors(hsl) {
    let colors = [];
    let c = [];
    switch(harmony) {
        case 0:
            c = analogous(hsl);
            break;
        case 1:
            c = monochromatic(hsl);
            break;
        case 2:
            c = triad(hsl);
            break;
        case 3:
            c = complementary(hsl);
            break;
        case 4:
            c = compound(hsl);
            break;
        case 5:
            c = shades(hsl);
            break;
    }
    colors = [c[4], c[3], c[2], c[1], c[0], c[5], c[6],c[7], c[8]];
    return colors;
}

function hexToRgb(hex) {
    r = parseInt(''+hex[1]+hex[2], 16);
    g = parseInt(''+hex[3]+hex[4], 16);
    b = parseInt(''+hex[5]+hex[6], 16);
    return {r, g, b};
}

function rgbToHsl(rgb) {
    let r = rgb.r/255;
    let g = rgb.g/255;
    let b = rgb.b/255;

    let h = 0;
    let l = 0;
    let s = 0;

    const min = Math.min(r,g,b);
    const max = Math.max(r,g,b);
    
    if(max === min) {
        h = 0;
    } else
    if (max === r) {
        h = 60 * (0 + (g - b) / (max - min) );
    } else
    if (max === g) {
        h = 60 * (2 + (b - r) / (max - min) );
    } else
    if (max === b) {
        h = 60 * (4 + (r - g) / (max - min) );
    }
    
    if (h < 0) {h = h + 360; }
    
    l = (min + max) / 2;
    
    if (max === 0 || min === 1 ) {
        s = 0;
    } else {
        s = (max - l) / ( Math.min(l,1-l));
    }
    // multiply s and l by 100 to get the value in percent, rather than [0,1]
    s *= 100;
    l *= 100;

    h = Math.round(h,0);
    s = Math.round(s,0);
    l = Math.round(l,0);

    return {h, s, l};
}

function parseHsl(h,s,l) {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function analogous(hsl) {
    let colors = [hsl];
    for(let i=1; i<=8; i++) {
        let color = [];
        if (i<=4) {
            color.h = (hsl.h - 15*i) % 360;
        }else {
            color.h = (hsl.h + 15*(i-4)) % 360;
        }
        color.s = hsl.s;
        color.l = hsl.l;
        color = fixColor(color);
        colors.push(color);
    }
    return colors;
}

function monochromatic(hsl) {
    let colors = [hsl];
    for(let i=1; i<=8; i++) {
        let color = [];
        color.h = hsl.h;
        if (i<=4) {
            color.s = hsl.s - 15*i;
            color.l = hsl.l;
        }else {
            color.s = hsl.s;
            color.l = hsl.l - 15*(i-4);
        }
        color = fixColor(color);
        colors.push(color);
    }
    return colors;
}

function triad(hsl) {
    let colors = [hsl];
    for(let i=8; i>=1; i--) {
        let color = [];
        if(i > 4) {
            color.h = hsl.h + 120;
            color.l = hsl.l + 8*(i-4);
        }else {
            color.h = hsl.h + 240;
            color.l = hsl.l + 8*i;
        }
        color.s = hsl.s;
        color = fixColor(color);
        colors.push(color);
    }
    return colors;
}

function complementary(hsl) {
    let colors = [hsl];
    for(let i=1; i<=4; i++) {
        let color = [];
        color.h = hsl.h;
        color.s = hsl.s - 10 * i;
        color.l = hsl.l - 10 * i;
        color = fixColor(color);
        colors.push(color);
    }
    for(let i=8; i>=4; i--) {
        let color = [];
        color.h = hsl.h + 180;
        color.s = hsl.s;
        color.l = hsl.l + 10*(i-4);
        color = fixColor(color);
        colors.push(color);
    }
    return colors;
}

function compound(hsl) {
    let colors = [hsl];
    for(let i=1; i<=4; i++) {
        let color = [];
        color.h = (hsl.h + 15*i) % 360;
        color.s = hsl.s;
        color.l = hsl.l;
        color = fixColor(color);
        colors.push(color);
    }
    for(let i=8; i>=4; i--) {
        let color = [];
        color.h = hsl.h + 180;
        color.s = hsl.s;
        color.l = hsl.l - 10*(i-4);
        color = fixColor(color);
        colors.push(color);
    }
    return colors;
}

function shades(hsl) {
    let colors = [hsl];
    for(let i=1; i<=8; i++) {
        let color = [];
        color.h = hsl.h;
        color.s = hsl.s;
        if (i<=4) {
            color.l = hsl.l - 10*i;
        }else {
            color.l = hsl.l + 10*(i-4);
        }
        color = fixColor(color);
        colors.push(color);
    }
    return colors;
}

function fixColor(color) {
    if (color.h > 360) {
        color.h = color.h - 360;
    }
    if (color.h < 0) {
        color.h = 360 + color.h;
    }
    if (color.s > 100) {
        color.s = 100;
    }
    if (color.s < 0) {
        color.s = 0;
    }
    if (color.l > 100) {
        color.l = 100;
    }
    if (color.l < 0) {
        color.l = 0;
    }
    return color;
}



