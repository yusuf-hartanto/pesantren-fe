// ** React Imports
import { useState, createContext } from 'react'

// ** Intl Provider Import
import { IntlProvider } from 'react-intl'

// ** Core Language Data
import messagesEn from '@assets/data/locales/en.json'
import messagesDe from '@assets/data/locales/de.json'
import messagesFr from '@assets/data/locales/fr.json'
import messagesPt from '@assets/data/locales/pt.json'

// ** User Language Data
import userMessagesEn from '@src/assets/data/locales/en.json'
import userMessagesDe from '@src/assets/data/locales/de.json'
import userMessagesFr from '@src/assets/data/locales/fr.json'
import userMessagesPt from '@src/assets/data/locales/pt.json'
import userMessagesId from '@src/assets/data/locales/id.json'

// ** Menu msg obj
const menuMessages = {
  en: { ...messagesEn, ...userMessagesEn },
  id: { ...userMessagesId }
}

// ** Create Context
const Context = createContext()

const IntlProviderWrapper = ({ children }) => {
  // ** States
  const [locale, setLocale] = useState('id')
  const [messages, setMessages] = useState(menuMessages['id'])

  // ** Switches Language
  const switchLanguage = lang => {
    setLocale(lang)
    setMessages(menuMessages[lang])
  }

  return (
    <Context.Provider value={{ locale, switchLanguage }}>
      <IntlProvider key={locale} locale={locale} messages={messages} defaultLocale='id'>
        {children}
      </IntlProvider>
    </Context.Provider>
  )
}

export { IntlProviderWrapper, Context as IntlContext }
