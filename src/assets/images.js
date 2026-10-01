import airMax from './images/urban/90.png'
import airForce from './images/urban/air.png'
import blazer from './images/urban/blazer.png'
import courtVision from './images/urban/court.png'
import jordanHero from './images/michael-jordan-1587661339.avif'
import jordanRetro from './images/jordan/retro3/r3.webp'
import jordanStreet from './images/jo.png'
import nikeRun from './images/nkrun.webp'
import nikeSports from './images/nksports.png'
import running from './images/run.avif'
import urbanStory from './images/urban.avif'
import nikeAuth from './images/urban/tn.png'
import brandLogo from './images/logo/logoFinal.jpg'
import legacyLogo from './images/logo/lgo.png'
import nikeSportsLogo from './images/logo/descarga.jpg'
import jordanLogo from './images/logo/ljordan.jpg'
import nikeUrbanBackground from './images/logo/urb.jpg'
import nikeSportsBackground from './images/logo/ney.jpg'
import jordanBackground from './images/logo/njor.jpg'
import retro1 from './images/re1.png'
import retro3 from './images/re3.png'
import retro4 from './images/re4.png'
import retro5 from './images/re5.png'
import retro11 from './images/re11.png'
import retro12 from './images/re12.png'
import retro13 from './images/re13.png'
import trailShoe from './images/tra1.png'
import urbanB1 from './images/urban/b1.png'
import urbanB2 from './images/urban/b2.png'
import urbanB3 from './images/urban/b3.png'
import sportE1 from './images/imgsp/e1.png'
import sportE2 from './images/imgsp/e2.png'
import sportE3 from './images/imgsp/e3.png'
import sportG1 from './images/imgsp/g1.png'
import sportG2 from './images/imgsp/g2.png'
import sportG3 from './images/imgsp/g3.png'

const images = {
  'urban/90.png': airMax,
  'urban/air.png': airForce,
  'urban/blazer.png': blazer,
  'urban/court.png': courtVision,
  'michael-jordan-1587661339.avif': jordanHero,
  'jordan/retro3/r3.webp': jordanRetro,
  'jo.png': jordanStreet,
  'nkrun.webp': nikeRun,
  'nksports.png': nikeSports,
  'run.avif': running,
  'urban.avif': urbanStory,
  'urban/tn.png': nikeAuth,
  'logo/logoFinal.jpg': brandLogo,
  'logo/lgo.png': legacyLogo,
  'logo/descarga.jpg': nikeSportsLogo,
  'logo/ljordan.jpg': jordanLogo,
  'logo/urb.jpg': nikeUrbanBackground,
  'logo/ney.jpg': nikeSportsBackground,
  'logo/njor.jpg': jordanBackground,
  're1.png': retro1,
  're3.png': retro3,
  're4.png': retro4,
  're5.png': retro5,
  're11.png': retro11,
  're12.png': retro12,
  're13.png': retro13,
  'tra1.png': trailShoe,
  'urban/b1.png': urbanB1,
  'urban/b2.png': urbanB2,
  'urban/b3.png': urbanB3,
  'imgsp/e1.png': sportE1,
  'imgsp/e2.png': sportE2,
  'imgsp/e3.png': sportE3,
  'imgsp/g1.png': sportG1,
  'imgsp/g2.png': sportG2,
  'imgsp/g3.png': sportG3,
}

export function getImage(path) {
  return images[path] || ''
}

export function resolveProductImage(source) {
  if (!source) return ''
  const path = String(source)
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  const assetPath = path
    .replace(/\\/g, '/')
    .replace(/^\/?(?:pagina(?:%20| )web(?:%20| )obsoleta\/)?WEBos-1\/img\//i, '')
    .replace(/^\/?img\//i, '')
    .replace(/^\/+/, '')
  return getImage(assetPath) || path
}
