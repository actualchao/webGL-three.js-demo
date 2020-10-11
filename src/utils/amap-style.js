import AMap from 'AMap'
// import Location from '@/assets/three-page/images/location-icon.png'
// import ashbinMarker from '@/assets/three-page/images/ashbin.png'
// import companyMarker from '@/assets/three-page/images/company.png'

const BASE_URL = (process.env.VUE_APP_BASEURL || '') + '/three-page/images/'

export default {
  // 定位图标
  location: {
    image: BASE_URL + 'location-icon.png',
    imagesize: new AMap.Size(18, 27),
    size: new AMap.Size(18, 27)
  }
}
