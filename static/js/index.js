import { Application } from "https://cdn.skypack.dev/@splinetool/runtime@0.9.416";

const keyduration = .2
const keyease = "sine"

const canvas = document.getElementById("canvas3d");
const app = new Application(canvas);
app
  .load("https://prod.spline.design/IOkt1f9seAuksDww/scene.splinecode")
  .then(() => {
    const keyboard = app.findObjectByName("keyboard");

    const key_ctrl = app.findObjectByName("ct")
    const key_c = app.findObjectByName("c")
    const key_v = app.findObjectByName("v")

    const key_ctrl_b = app.findObjectByName("ctrl-key-base")
    const key_c_b = app.findObjectByName("c-key-base")
    const key_v_b = app.findObjectByName("v-key-base")

    let colorCycleProgress = 0;
    let colorCycleEvents = ["red","blue","green","white","purple"]
        
    document.addEventListener("keydown",(event) => {
      switch (event.key) {

        case "c":
          gsap.to(key_c.position, { y: -35, duration:keyduration,ease:keyease });
          break;

        case "v":
          gsap.to(key_v.position, { y: -35, duration:keyduration,ease:keyease });
          break;

        case "Control":
          gsap.to(key_ctrl.position, { y: -35, duration:keyduration,ease:keyease });
          break;
      }

    })
        
    document.addEventListener("keyup",(event) => {
      switch (event.key) {

        case "c":
          gsap.to(key_c.position, { y: 0, duration:keyduration,ease:keyease });
          break;

        case "v":
          gsap.to(key_v.position, { y: 0, duration:keyduration,ease:keyease });
          break;

        case "Control":
          gsap.to(key_ctrl.position, { y: 0, duration:keyduration,ease:keyease });
          break;
      }
    })
    
    let colorCycleKeyMap = {
      "red":"mouseUp",
      "blue":"mouseDown",
      "green":"mouseHover",
      "white":"keyDown",
      "purple":"keyUp"
    }
    
    let colorCycleBgMap = {
      "red":"#b12026",
      "blue":"#1881c7",
      "green":"#5b8f04",
      "white":"#818181",
      "purple":"#7432cf"
    }

    const setKeyColor = (color) => {

      let event = colorCycleKeyMap[color]

      key_ctrl_b.emitEvent(event)
      key_c_b.emitEvent(event)
      key_v_b.emitEvent(event)
      
    }

    const setBgcolor = (color) => {

      let col = colorCycleBgMap[color]
      gsap.to("body",{backgroundColor:col,duration:.2})

      console.log(col)
    }

    document.getElementById("colorhovertrigger").addEventListener("mouseenter",(event) => {
      let color = colorCycleEvents[colorCycleProgress%colorCycleEvents.length]

      setKeyColor(color)
      setBgcolor(color)

      colorCycleProgress++
    })

    setKeyColor("blue")


    gsap.set(keyboard.scale, { x: .5, y: .5, z: .5 });
    gsap.set(keyboard.position, { x: 150, y: 25 });

    let rotateKeyboard = gsap.to(keyboard.rotation, {
      y: Math.PI * 2 + keyboard.rotation.y,
      x: 0,
      z: 0,
      duration: 10,
      repeat: -1,
      ease: "none"
    });

    let rotationProgress = 0;

    gsap.to("body", {
      scrollTrigger: {
        trigger: "#part1",
        start: "top 40%",
        end: "bottom 80%",
        scrub: true,

        onEnter: () => {
          setKeyColor("purple")
        },

        onEnterBack: () => {
          setKeyColor("purple")
        },

        onLeave: () => {
          setKeyColor("red")
        },

        onLeaveBack: () => {
          setKeyColor("blue")
        }
      }
    })

    gsap.to("body", {
      scrollTrigger: {
        trigger: "#part3",
        start: "top 50%",
        end: "top 50%",
        scrub: true,

        onEnter: () => {
          setKeyColor("white")
          setTimeout(() => {setBgcolor("red")},200)
        },

        onLeaveBack: () => {
          setKeyColor("red")
          setBgcolor("red")
        }
      }
    })

    // part 1
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#part1",
          start: "top 60%",
          end: "bottom bottom",
          scrub: true,

          onEnter: () => {
            rotationProgress = rotateKeyboard.progress();

            rotateKeyboard.pause();
            gsap.to(keyboard.rotation, {
              y: Math.PI / 12,
              duration: 1
            });
          },

          onLeaveBack: () => {
            const newProgress = keyboard.rotation.y / (Math.PI * 2);
            rotateKeyboard.progress(newProgress).resume();
          }
        }
      })
      .to(keyboard.rotation, { x: -Math.PI / 14, z: Math.PI / 36 }, 0)
      .to(keyboard.position, { x: -300, y: -100 }, 0)
      .to(keyboard.scale, { x: 1.6, y: 1.6, z: 1.6 }, 0)
      .to(document.body, {backgroundColor: "#7432cf"}, 0);

    // part 2
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#part2",
          start: "top bottom",
          end: "center bottom",
          scrub: true,

          onEnterBack: () => {
            setKeyColor("red")
          }
        }
      })
      
      .to(keyboard.rotation, { x: Math.PI / 36, y: Math.PI / 4 }, 0)
      .to(keyboard.position, { x: 150, y: 50 }, 0)
      .to(keyboard.scale, { x: 0.8, y: 0.8, z: 0.8 }, 0)
      .to(document.body, {backgroundColor: "#b12026"}, 0);
    
    // part 3
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#part3",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true
        },

        onEnterBack: () => {
          setKeyColor("white")
        },

        onLeave: () => {
          setKeyColor("white")
        }
      })
      .to(keyboard.position, { x: 0, y: 0 }, 0)
  });



// background progress bar

function animateBar(triggerElement, onEnterWidth, onLeaveBackWidth) {
  gsap.to(".bar", {
    scrollTrigger: {
      trigger: triggerElement,
      start: "top center",
      end: "bottom bottom",
      scrub: true,
      onEnter: () => {
        gsap.to(".bar", {
          width: onEnterWidth,
          duration: 0.2,
          ease: "none"
        });
      },
      onLeaveBack: () => {
        gsap.to(".bar", {
          width: onLeaveBackWidth,
          duration: 0.2,
          ease: "none"
        });
      }
    }
  });
}

animateBar("#part1", "35%", "0%");
animateBar("#part2", "65%", "35%");
animateBar("#part3", "100%", "65%");


// keyboard text effect
const keys = document.querySelectorAll(".key");

function pressRandomKey() {
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  randomKey.style.animation = "pressDown 0.2s ease-in-out";

  randomKey.onanimationend = () => {
    randomKey.style.animation = "";
    setTimeout(pressRandomKey, 100 + Math.random() * 300);
  };
}

pressRandomKey();