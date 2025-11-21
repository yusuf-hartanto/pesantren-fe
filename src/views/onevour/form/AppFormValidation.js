/**
 * replace by AppForm 20210903
 * */
export const debugFormMode = false

export function validateStart() {
  return { error_form: false, request: true }
}

export function wrapMessageError(store) {
  let message = null

  Object.keys(store).forEach(function (key, index) {
    if (key.endsWith('_error')) {
      let tmp = store[key]

      if (null === message && (undefined !== tmp || tmp !== '' || tmp.length !== 0)) {
        message = tmp
      }
    }
  })

  return message == null ? 'Please check field input' : message
}

export function clearMessageError(store, fields = []) {
  Object.keys(store).forEach(function (key, index) {
    if (key.endsWith('_error')) {
      store[key] = null
    }
  })

  for (let i = 0; i < fields; i++) {
    delete store[fields[i]]
  }

  store.request = true

  return store
}

export function isValidateError(state, store) {
  return store.error_form
}

export function validateEmpty(state, store, key, message = 'Please input field!', min = 0, max = 0) {
  let value = state.state[key]
  let errorKey = key + '_error'

  if (debugFormMode) console.log('validate', key, value)

  if (undefined === value || null === value || value.length === 0) {
    store.error_form = true
    store[errorKey] = message
    state.setState(store)
    if (debugFormMode) console.log(store)

    return
  }

  if (min > 0 && value.length < min) {
    store.error_form = true
    store[errorKey] = message
    state.setState(store)
    if (debugFormMode) console.log(store)

    return
  }

  if (max > 0 && value.length > max) {
    store.error_form = true
    store[errorKey] = message
    state.setState(store)
    if (debugFormMode) console.log(store)

    return
  }

  store[errorKey] = null
  if (debugFormMode) console.log('clear error', errorKey)
}

export function validateNIK(state, store, key) {
  let value = state.state[key]
  let errorKey = key + '_error'

  if (debugFormMode) console.log('validate nik', value)

  if (undefined === value || null === value || value.length !== 16) {
    store.error_form = true
    store[errorKey] = 'Please input value 16 digit'
    state.setState(store)
    if (debugFormMode) console.log(store)

    return
  }

  store[errorKey] = null
  if (debugFormMode) console.log('clear error', errorKey)
}

export function validateEmail(state, store, key) {
  let regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let value = state.state[key]
  let errorKey = key + '_error'

  if (debugFormMode) console.log('validate ', value)

  if (!regEmail.test(value)) {
    store.error_form = true
    store[errorKey] = 'Please input valid email'
    state.setState(store)
    if (debugFormMode) console.log(store)

    return
  }

  store[errorKey] = null
  if (debugFormMode) console.log('clear error', errorKey)
}
