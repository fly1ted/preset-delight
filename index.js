import {definePreset} from '@unocss/core'
// import {entriesToCss}from 'https://esm.sh/unocss'
// console.log(entriesToCss(['mt-2', 'mt-5']))

// https://coreui.io/blog/how-to-check-if-string-is-number-in-javascript
export const isNumeric = (string) => string == Number.parseFloat(string)

export const presetDelight = definePreset(({ grayHue = 0 } = {}) => {
  return {
    name:'@fw/preset-delight',
    theme:{
      bp:{s:'40em', m:'52em', l:'64em', x:'80em'},
      c:{
        10:`hsla(${grayHue}, 7%, 10%, 1)`,
        15:`hsla(${grayHue}, 7%, 15%, 1)`,
        20:`hsla(${grayHue}, 7%, 20%, 1)`,
        30:`hsla(${grayHue}, 7%, 30%, 1)`,
        40:`hsla(${grayHue}, 7%, 40%, 1)`,
        50:`hsla(${grayHue}, 7%, 50%, 1)`,
        60:`hsla(${grayHue}, 7%, 60%, 1)`,
        70:`hsla(${grayHue}, 7%, 70%, 1)`,
        80:`hsla(${grayHue}, 7%, 80%, 1)`,
        90:`hsla(${grayHue}, 7%, 90%, 1)`,
        95:`hsla(${grayHue}, 7%, 95%, 1)`,
        97:`hsla(${grayHue}, 7%, 97%, 1)`,
        98:`hsla(${grayHue}, 7%, 98%, 1)`,
        t:'transparent',
        w:'white',
      },
      // https://type-scale.com/ -> 1.333
      fz:{
        0:'1rem',
        0.5:'1.16rem',
        1:'1.333rem',
        1.5:'1.555rem',
        2:'1.777rem',
        2.5:'2.073rem',
        3:'2.369rem',
        4:'3.157rem',
        5:'4.209rem',
        6:'5.61rem',
        7:'7.478rem'
      },
      fw:{
        1:100, // Thin (Hairline)
        2:200, // Extra Light (Ultra Light)
        3:300, // Light
        4:400, // Normal
        5:500, // Medium
        6:600, // Semi Bold (Demi Bold)
        7:700, // Bold
        8:800, // Extra Bold (Ultra Bold)
        9:900 // Black (Heavy)
      },
      fs:{i:'italic'},
      ta:{
        s:'start',
        c:'center',
        e:'end',
        // j:'justify'
      },
      d:{
        b:'block',
        f:'flex',
        g:'grid',
        ib:'inline-block',
        if:'inline-flex',
        ig:'inline-grid',
      },
      cu:{p:'pointer'},
      mxw:{
        // Typographic Measure
        0:'20em', // ~45 characters
        1:'30em', // ~66 characters
        2:'34em', // ~80 characters
      },
      fxf:{
        r:'row',
        c:'column',
      },
      pn:{
        // s: 'static',
        r:'relative',
        a:'absolute',
        f:'fixed'
      },
      pc:{c:'center'},
      pi:{c:'center'},
      of:{
        ah:'auto hidden',
        ha:'hidden auto',
        h:'hidden',
      },
      ws:{nw:'nowrap'},
      v:{h:'hidden',},
      tt:{u:'uppercase'},
      rz:{v:'vertical'},
      bR:{
        c:'999rem',
      },
      get(p, v, sign='') {
        let short = {
          'a':'auto',
          'il':'initial',
          'it':'inherit',
          'n':'none',
          'un':'unset',
          // 'r':'revert'
        }

        // some props use the same scale
        p = {
          bg:'c',
          bc:'c',
          bi:'c',
        }[p] || p

        // console.log({p, v, sign})

        // check respective scale first to allow (a|n) in scale aliases
        if(this[p] && this[p][v]) return `${sign}${this[p][v]}`
        // short globals
        if(short[v]) return `${sign}${short[v]}`
        // content prop cannot use quotes in class name thus the need to use a diff char
        if(['ct'].includes(p)) return `${sign}${v.replaceAll('|','"')}`
        // some props that use numbers need to stay as they are
        if(['z','o','od','fx','lh'].includes(p)) return `${sign}${v}`
        // numbers are to become rems
        if(isNumeric(v)) return v == 0 ? 0 : `${sign}${v}rem`
        // for shortcut props like inset
        // if(v.indexOf('_')) return `${sign}${v.replaceAll('_', ' ')}`
        return `${sign}${v.replaceAll('_', ' ')}`

        // return `${sign}${v}`
      }
    },
    preflights:[
      {
        getCSS:({theme}) => `
                html {
                    font-size: 62.5%;
                    box-sizing: border-box;
                }

                body{
                    font-size: 1.6rem;
                    font-family:${theme.ff[0]};
                    margin: 0;
                }

                [un-cloak] {
                    display: none;
                }

                [aria-disabled=true], [disabled], [readonly]{
                  pointer-events:none;
                  opacity:0.4;
                  userSelect:none;
                }

                // https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/
                *, *:before, *:after{box-sizing: inherit}
            `,
      },
    ],
    rules:[
      // multiples stay higher to be overriden by singles later
      [/^([-]?)(m|p)([xy])-(.+)$/, ([_, sign, v, v2, v3], {theme}) => {
        let o = {
          p:{
            x:{
              'padding-left':theme.get(v, v3, sign),
              'padding-right':theme.get(v, v3, sign)
            },
            y:{
              'padding-top':theme.get(v, v3, sign),
              'padding-bottom':theme.get(v, v3, sign)
            },
          },
          m:{
            x:{
              'margin-left':theme.get(v, v3, sign),
              'margin-right':theme.get(v, v3, sign)
            },
            y:{
              'margin-top':theme.get(v, v3, sign),
              'margin-bottom':theme.get(v, v3, sign)
            },
          }
        }

        return o[v][v2]
      }],

      // singles
      [/^(a)-(.+)$/, ([,, name], {theme}) => {
        const kf = theme.a?.keyframes?.[name]

        if (kf) return [`@keyframes ${name}${kf}`, {animation:theme.a?.[name]}]

        // if no @keyframes found assume they're provided via css import
        return [{animation:theme.a?.[name]}]
      }],
      [/^([-]?)(m|p)([trbl]?)-(.+)$/, ([_, sign, v, v2, v3], {theme}) => {
        let p = {'m':'margin', p:'padding'}[v]

        return {[{'':p, t:`${p}-top`, r:`${p}-right`, b:`${p}-bottom`, l:`${p}-left`}[v2]]:theme.get(v, v3, sign)}
      }],
      [/^(-?)(adl|adu|c|ct|cu|clr|d|bg|bc|bcp|bi|bs|b|bR|bC|bb|bl|br|bt|bw|w|ws|h|lh|mxw|mnw|mxh|mnh|ff|fz|fw|fs|fx|fxf|flt|fr|i|g|ga|gp|gt|gaf|pn|pc|pi|ps|pe|o|ol|of|od|ta|td|tf|tfo|tr|to|tt|ts|ti|rz|v|va|z)-(.+)$/,
        ([_, sign, v, v2], {theme}) => ({[{
          adl:'animation-delay',
          adu:'animation-duration',
          c:'color',
          ct:'content',
          cu:'cursor',
          clr:'clear',
          d:'display',
          bg:'background',
          bc:'background-color',
          bcp:'background-clip',
          bi:'background-image',
          bs:'box-shadow',
          b:'border',
          bR:'border-radius',
          bC:'border-color',
          bb:'border-bottom',
          bl:'border-left',
          br:'border-right',
          bt:'border-top',
          bw:'border-width',
          w:'width',
          ws:'white-space',
          h:'height',
          lh:'line-height',
          mxw:'max-width',
          mnw:'min-width',
          mxh:'max-height',
          mnh:'min-height',
          ff:'font-family',
          fz:'font-size',
          fw:'font-weight',
          fs:'font-style',
          fx:'flex',
          fxf:'flex-flow',
          flt:'float',
          fr:'filter',
          i:'inset',
          g:'grid',
          ga:'grid-area',
          gp:'gap',
          gt:'grid-template',
          gaf:'grid-auto-flow',
          pn:'position',
          pc:'place-content',
          pi:'place-items',
          ps:'place-self',
          pe:'pointer-events',
          o:'opacity',
          ol:'outline',
          of:'overflow',
          od:'order',
          ta:'text-align',
          td:'text-decoration',
          tf:'transform',
          tfo:'transform-origin',
          tr:'transition',
          to:'text-overflow',
          tt:'text-transform',
          ts:'text-shadow',
          ti:'text-indent',
          rz:'resize',
          v:'visibility',
          va:'vertical-align',
          z:'z-index'
        }[v]]:theme.get(v, v2, sign)})
      ]
    ],
    variants:[
      // breakpoints
      (matcher, {theme}) => {
        let m = matcher.match(/^([smlx]*?):(.*)/)

        if (!m) return matcher

        return {
          matcher:matcher.slice(2),
          handle:(input, next) => next({
            ...input,
            parent:`${input.parent ? `${input.parent} $$ ` : ''}@media (min-width: ${theme.bp[m[1]]})`,
          }),
        }
      },

      // [*]: - arbitrary value
      (matcher) => {
        let m = matcher.match(/^\[(.*?)\]:(.*)/)

        if (!m) return matcher

        return m[2].split('_').map(v=>({
          matcher:v,
          selector:s => `${s}${m[1].replace('_', ' ')}`,
        }))
      },
    ],
    shortcuts:[
      {'ctr':'w-100% mxw-110 mx-a px-0.5 m:px-un'},
      {'pnc':'pn-a i-50%_auto_auto_50% tf-translate(-50%,-50%)'},
    ],
  }
})
