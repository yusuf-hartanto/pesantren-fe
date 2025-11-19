// import {getFileExtension, numberOnly} from "../../AppCommons";

export function convertOption(values = []) {
  if (null === values) values = []

  return values.map(o => {
    return {
      label: o.value,
      value: o.id
    }
  })
}

export function updateValueText(session, props, e) {
  let store = { ...session.state }
  store[props.key] = e.target.value

  // session.state[props.key] = e.target.value
  session.setState(store)
}

export function updateValueDate(session, props, date) {
  let store = { ...session.state }
  store[props.key] = date

  // session.state[props.key] = e.target.value
  session.setState(store)
}

export function updateValueEditor(session, props, e) {
  let store = { ...session.state }
  store[props.key] = e
  session.setState(store)
}

export function updateValueMaskingThousand(session, props, e) {
  let store = { ...session.state }
  store[props.key] = e.target.value.replaceAll(',', '')
  session.setState(store)
}

export function updateValueNumber(e, state, key) {
  if (numberOnly(e.target.value)) {
    let store = { ...session.state }
    store[key] = e.target.value
    state.setState(store)
  }
}

export function updateValueSelect(session, props, newValue) {
  let store = { ...session.state }
  store[props.key] = newValue ? newValue : null
  session.setState(store)
  if (props?.options?.callback) props.options.callback(newValue)
}

export function updateValueSelectMulti(session, props, newValue) {
  let store = { ...session.state }
  store[props.key] = newValue || []
  session.setState(store)
  if (props?.options?.callback) props.options.callback(newValue)
}

// default value
export function updateValueSelected(state, key, option_values) {
  const store = state.state
  let storeVal = store[key]
  if (option_values === null || undefined === option_values) return null
  console.log('option_values', option_values)

  let selected = option_values?.filter(function (option) {
    if (option) {
      // console.log("update value selected", option)
      return option.value === storeVal
    }

    return false
  })
  if (selected?.length === 0 || undefined === selected) return null
  let val = selected[0]

  return {
    value: val.value,
    label: val.label
  }
}

// default selected date
export function updateValueSelectedDate(state, key) {
  let store = state.state
  let value = store[key]

  return value
}

// file add
export function updateFile(e, state, key) {
  let store = {}
  const file = e.target.files[0]
  const keyExt = key + '_file_ext'
  if (file) {
    new Promise(() => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        store[key] = fileReader.result
        store[keyExt] = getFileExtension(file.name)
        state.setState(store)
      }
      fileReader.onerror = error => {
        store[key] = null
        store[keyExt] = null
        state.setState(store)
      }
    }).then(r => {
      console.log(r)
    })
  } else {
    store[key] = null
    store[keyExt] = null
    state.setState(store)
  }
}

export function removeBody(body, fields = []) {
  for (let i = 0; i < fields; i++) {
    delete body[fields[i]]
  }

  return body
}
