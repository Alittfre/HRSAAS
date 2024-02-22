import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Screenfull from './ScreenFull'
import ThemePicker from './ThemePicker'
import lang from './lang'
import TagsView from './TagsView'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('ScreenFull', Screenfull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('lang', lang)
    Vue.component('TagsView', TagsView)
  }
}
