/**
 * @providesModule I18n
 */
import I18n from 'react-native-i18n'

import ko from './locales/ko'
import zh from './locales/zh'

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true

I18n.translations = {
  en: zh,
  ko: ko,
  "zh-cn": zh,
  "zh-hk": zh
}

export default I18n;