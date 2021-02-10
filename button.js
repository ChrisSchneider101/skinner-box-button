init = function() {
    let tmr = gTimer();
    let btn = gButton(); 
    let game = gGame(btn, tmr);
    
    tmr.setDisplayedTime(36);
    
    document.getElementById("button_container").appendChild(btn.div);
    document.getElementById("timer_container").appendChild(tmr.div);

    return game;
}

gButton = function() {
    const button_size = 300;
    const button_color_r = 200;
    const button_color_g = 50;
    const button_color_b = 50;

    let btn = Object();
    let game;

    btn.div = document.createElement("div");
    btn.div.style.width = button_size + "px";
    btn.div.style.height = button_size + "px";
    btn.div.style.borderRadius = button_size + "px";
    btn.div.style.pointerEvents = "auto";
    btn.div.style.userSelect = "none";
    

    btn.setColor = function(r,g,b) {
        btn.div.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    }

    btn.div.addEventListener("mouseover", function() {
        btn.setColor(button_color_r+20, button_color_g+20, button_color_b+20);
    }.bind(btn));
    btn.div.addEventListener("mouseout", function() {
        btn.setColor(button_color_r, button_color_g, button_color_b);
    }.bind(btn));
    btn.div.addEventListener("mousedown", function() {
        btn.setColor(button_color_r-40, button_color_g-40, button_color_b-40);
    }.bind(btn));
    btn.div.addEventListener("mouseup", function() {
        btn.setColor(button_color_r+20, button_color_g+20, button_color_b+20);
    }.bind(btn));
    btn.div.addEventListener("click", function() {
        btn.game.buttonClicked();
    }.bind(btn));


    btn.setColor(button_color_r, button_color_g, button_color_b);

    return btn;
}

gTimer = function() {
    const timer_width = 350;
    const timer_height = 150;
    const timer_color_r = 75;
    const timer_color_g = 75;
    const timer_color_b = 75;
    const timer_font_size = 120;

    let tmr = Object();
    let game;

    tmr.div = document.createElement("div");
    //tmr.div.style.width = timer_width + "px";
    tmr.div.style.height = timer_height + "px";
    tmr.div.style.borderRadius =  "15%";
    tmr.div.style.backgroundColor = "rgb(" + timer_color_r + "," + timer_color_g + "," + timer_color_b + ")";
    tmr.div.setAttribute("class", "flex-center");
    tmr.div.style.pointerEvents = "auto";
    tmr.div.style.userSelect = "none";
    tmr.div.style.fontSize = timer_font_size + "px";
    tmr.div.style.fontFamily = "monospace";
    tmr.div.style.color = "white";

    tmr.setDisplayedTime = function(s) {
        let sec = Math.round(s);
        let hour = Math.floor(sec/3600);
        sec = sec % 3600;
        let min = Math.floor(sec/60);
        sec = sec % 60;
        
        tmr.div.innerHTML = String(sec).padStart(2, '0');
        if (s >= 60) tmr.div.innerHTML = String(min).padStart(2, '0') + ":" + tmr.div.innerHTML;
        if (s >= 3600) tmr.div.innerHTML = String(hour).padStart(2, '0') + ":" + tmr.div.innerHTML;
    }

    return tmr;
}

gGame = function(button, timer) {
    let game = Object();

    game.btn = button;
    game.tmr = timer;
    button.game = game;
    timer.game = game;

    game.lvl = 0;
    game.lvl_duration = 0;
    game.next_lvl_date = Date();
    game.tmr_interval = null;

    game.getSecondsToNextLevel = function() {
        let cur_date = new Date();
        let ret = (1000 * (game.next_lvl_date.getTime() - cur_date.getTime()));
        //console.log("Seconds to next level = " + ret);
        if (ret < 0) ret = 0;
        return ret;
    }

    game.advanceLevel = function() {
        game.lvl++;
        game.lvl_duration = Math.round(Math.pow(game.lvl, 2.75));
        let cur_date = new Date();
        game.next_lvl_date = new Date(cur_date.getTime() + (game.lvl_duration * 1000));
        console.log("level " + game.lvl + " duration: " + game.lvl_duration);
        console.log("level " + game.lvl + " started at: " + Date());
        console.log("level " + game.lvl + " ends at: " + game.next_lvl_date);

    }

    game.buttonClicked = function() {
        game.advanceLevel();
        game.startTimer();
    }

    game.startTimer = function() {
        if (game.tmr_interval == null) {
            console.log("timer started")
            tmr_interval = setInterval(function() {
                this.tmr.setDisplayedTime(this.getSecondsToNextLevel());
                if (this.getSecondsToNextLevel() == 0) {
                    console.log("ready for next level");
                    this.pauseTimer();
                }
            }.bind(game), 200);
        }
        else console.log("tried to start timer while its running already");
    }

    game.pauseTimer = function() {
        console.trace();
        if (game.tmr_interval != null) {
            console.log("timer paused");
            clearInterval(game.tmr_interval);
        }
    }

    return game;
}