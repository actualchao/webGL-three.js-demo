import AMap from 'AMap'
// import Location from '@/assets/images/location-icon.png'
// import ashbinMarker from '@/assets/images/ashbin.png'
// import companyMarker from '@/assets/images/company.png'

const BASE_URL = (process.env.VUE_APP_BASEURL || '') + '/images/'

export default {
  // 定位图标
  location: {
    image: BASE_URL + 'location-icon.png',
    imageSize: new AMap.Size(18, 27),
    size: new AMap.Size(18, 27)
  }
}
