export function particlesInit() {
  const script = document.createElement('script')
  script.id = 'particles-script'
  // script.innerHTML = `${particle}`
  document.body.appendChild(script)
}

export function particlesPlay() {
  window.particlesJS('particles-js', {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: '#FF9E5D' },
      shape: {
        type: 'circle',
        stroke: { width: 0, color: '#000000' },
        polygon: { nb_sides: 5 },
        image: { src: 'img/github.svg', width: 100, height: 100 },
      },
      opacity: {
        value: 0.70550130678083,
        random: true,
        anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
      },
      size: {
        value: 8.017060304327615,
        random: true,
        anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
      },
      line_linked: {
        enable: false,
        distance: 112.2388442605866,
        color: '#ffffff',
        opacity: 0.4,
        width: 19.882309554732483,
      },
      move: {
        enable: true,
        speed: 3.206824121731046,
        direction: 'top',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 80.17060304327615,
          rotateY: 160.3412060865523,
        },
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'bubble' },
        onclick: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: {
        grab: { distance: 400, line_linked: { opacity: 0.5 } },
        bubble: {
          distance: 400,
          size: 4,
          duration: 0.3,
          opacity: 1,
          speed: 3,
        },
        repulse: { distance: 200, duration: 0.4 },
        push: { particles_nb: 4 },
        remove: { particles_nb: 2 },
      },
    },
    retina_detect: false,
  })
}

export function particlesDestroy() {
  if (document.querySelector('#particles-script')) {
    document.body.removeChild(document.querySelector('#particles-script'))
  }
}