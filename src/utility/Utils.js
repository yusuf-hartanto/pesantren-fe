import moment from 'moment'

let usedOnesignal = null

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
// export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
//   if (!value) return value
//   return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
// }

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

// ** Convert rupiah
export const convertToRupiah = (angka = 0, lbl = '') => {

  if (angka === null) return 0

  let negatif = ''
  let rupiah = ''
  let decimal = ''

  if (angka < 0) {
    angka = Math.abs(angka)
    negatif = '-'
  }

  const angkaArr = angka.toString().split('.')
  if (angkaArr.length > 1) {
    angka = angkaArr[0]
    decimal = `0.${angkaArr[1]}`
    decimal = (Math.round(decimal * 100) / 100).toFixed(2)
    decimal = decimal.replace('0.', ',')

    if (decimal === '1.00') {
      angka = parseInt(angka) + parseInt(decimal)
      decimal = ''
    }

  }

  const angkarev = angka.toString().split('').reverse().join('')
  for (let i = 0; i < angkarev.length; i++) if (i % 3 === 0) rupiah += `${angkarev.substr(i, 3)}.`

  return `${negatif} ${lbl} ${rupiah.split('', rupiah.length - 1).reverse().join('') + decimal}`
}

// ** format date
export const formatDate = (value) => {
  if (null === value || undefined === value) return '-'
  return moment(value).format('DD/MM/YYYY') //dd mmm yyyy
}

export const formatDateTime = (value) => {
  if (null === value || undefined === value) return '-'
  return moment(value).format('DD/MM/YYYY HH:mm') //dd mmm yyyy
}

export const formatTime = (value) => {
  if (null === value || undefined === value) return '-'
  return moment(value).format('HH:mm') //dd mmm yyyy
}

export const formatDateFull = (value) => {
  if (null === value || undefined === value) return '-'
  return moment(value).format('DD MMMM YYYY') //dd mmm yyyy
}

export const dateStrToMoment = (dateTime, format) => {
  return moment(moment(dateTime, format).toDate())
}

export const dateConverted = (
  date,
  newFormat,
  oldFormat
) => {
  if (newFormat) {
    return dateStrToMoment(date, oldFormat).format(newFormat)
  }

  return moment(date, oldFormat).toDate()
}

export const utcToLocal = (dataUtc, format) => {
  return moment
    .utc(dataUtc)
    .local()
    .format(format)
}

//terbilang
export const terbilang = (bilangan) => {
  bilangan = String(bilangan)
  const angka = new Array('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0')
  const kata = new Array('', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan')
  const tingkat = new Array('', 'Ribu', 'Juta', 'Milyar', 'Triliun')

  const panjang_bilangan = bilangan.length
  let kaLimat = ""
  /* pengujian panjang bilangan */
  if (panjang_bilangan > 15) {
    kaLimat = "Diluar Batas"
    return kaLimat
  }

  /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
  for (let i = 1; i <= panjang_bilangan; i++) {
    angka[i] = bilangan.substr(-(i), 1)
  }

  let i = 1
  let j = 0

  /* mulai proses iterasi terhadap array angka */
  while (i <= panjang_bilangan) {

    let subkaLimat = ""
    let kata1 = ""
    let kata2 = ""
    let kata3 = ""

    /* untuk Ratusan */
    if (angka[i + 2] !== "0") {
      if (angka[i + 2] === "1") {
        kata1 = "Seratus"
      } else {
        kata1 = `${kata[angka[i + 2]]} Ratus`
      }
    }

    /* untuk Puluhan atau Belasan */
    if (angka[i + 1] !== "0") {
      if (angka[i + 1] === "1") {
        if (angka[i] === "0") {
          kata2 = "Sepuluh"
        } else if (angka[i] === "1") {
          kata2 = "Sebelas"
        } else {
          kata2 = `${kata[angka[i]]} Belas`
        }
      } else {
        kata2 = `${kata[angka[i + 1]]} Puluh`
      }
    }

    /* untuk Satuan */
    if (angka[i] !== "0") {
      if (angka[i + 1] !== "1") {
        kata3 = kata[angka[i]]
      }
    }

    /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
    if ((angka[i] !== "0") || (angka[i + 1] !== "0") || (angka[i + 2] !== "0")) {
      subkaLimat = `${kata1} ${kata2} ${kata3} ${tingkat[j]}`
    }

    /* gabungkan variabe sub kaLimat (untuk Satu blok 3 angka) ke variabel kaLimat */
    kaLimat = subkaLimat + kaLimat
    i = i + 3
    j = j + 1

  }

  /* mengganti Satu Ribu jadi Seribu jika diperlukan */
  if ((angka[5] === "0") && (angka[6] === "0")) {
    kaLimat = kaLimat.replace("Satu Ribu", "Seribu")
  }

  return `${kaLimat} Rupiah`
}

export const shuffle = (array) => {
  /* eslint-disable */
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
  /* eslint-enable */
}

export const timeToSeconds = (time) => {
  /* eslint-disable */
  const seconds = time.split(":")
  return (+seconds[0]) * 60 * 60 + (+seconds[1]) * 60 + (+seconds[2])
  /* eslint-enable */
}

export const days = (delta) => {
  return Math.floor(delta / 86400)
}

export const hours = (delta) => {
  return Math.floor(delta / 3600) % 24
}

export const minutes = (delta) => {
  return Math.floor(delta / 60) % 60
}

export const debounce = (func, timeout) => {
  /* eslint-disable */
  let timer
  return function(...args) {
    const context = this
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      func.apply(context, args)
    }, timeout)
  }
  /* eslint-enable */
}

export const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1])

  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const isUndefined = obj => typeof obj === 'undefined'

export const convertToFormData = (requestBody) => {
  const formData = new FormData()

  Object.keys(requestBody).forEach(key => {
    formData.append(key, requestBody[key])
  })

  return formData
}

// ** Check if object loading (reducer) has key equal with keyword and value is true
export const isLoading = (lazyLoad, keyword) => {
  if (lazyLoad) {
    const keyLazy = Object.keys(lazyLoad).find(key => key === keyword)

    return keyLazy && lazyLoad[keyword]
  }

  return false
}

export const currencyFormat = (value) => {
  if (value) {
    const number_string = value.replace(/[^.\d]/g, '').toString(),
      split = number_string.split('.'),
      sisa = split[0].length % 3,
      ribuan = split[0].substring(sisa).match(/\d{3}/gi)

    let rupiah = split[0].substring(0, sisa)

    if (ribuan) {
      const separator = sisa ? ',' : ''
      rupiah += separator + ribuan.join(',')
    }
    rupiah = split[1] !== undefined ? `${rupiah}.${split[1]}` : rupiah

    if (value === '0' && rupiah === '0') return ''
    if (rupiah) {
      return rupiah
    } else {
      return ''
    }
  }

  return ''
}

export const currencyToNumber = (currencyStr) => {
  if (currencyStr) {
    return +(currencyStr.split(',').join(''))
  }

  return 0
}

export const defineOneSignal = (used) => {
  usedOnesignal = used
}

export const connectOneSignal = () => {
  return usedOnesignal
}

export const roundDown = (num, decimals = 0) => {
  return (Math.floor(num * Math.pow(10, decimals)) / Math.pow(10, decimals))
}

export const getNumberUnit = (num, round = 1) => {
  /* eslint-disable */
  const unit = Math.floor(Math.round(num / 1.0e+1).toLocaleString().replaceAll(',', '').length),
    wunit = ['k', 'jt', 'M', 'T', 'Kuadriliun', 'Quintillion'][Math.floor(unit / 3) - 1],
    funit = Math.abs(Number(num)) / Number('1.0e+' + (unit - unit % 3)) // eslint-disable-line no-mixed-operators, prefer-template

  return wunit
    ? `${roundDown(funit, round).toString()}${wunit}`
    : roundDown(num, round).toString()
  /* eslint-enable */
}