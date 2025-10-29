import mock from '../mock'
import { paginateArray } from '../utils'

const data = [
      {
        appResource: {
          resource_id: 1,
          role_id: 9,
          username: "admin",
          password: "$2a$10$VZw8MYXI5yK4.QlKvICB8.8OUCgt1YyHauz.owUFClx9qc4l3rzce",
          type: "-",
          dep_id: 1,
          emp_id: 1
        },
        appRole: {
          role_id: 9,
          role_name: "Super Admin",
          status: "A"
        },
        globalDepartemen: {
          dep_id: 1,
          dep_name: "Damessa Family Dental & Skin Care Leuwinanggung",
          dep_address: "Jl. Raya Leuwinanggung No. 88 , Tapos Depok",
          dep_provinsi: null,
          dep_kota_kab: null,
          dep_kecamatan: null,
          dep_kelurahan: null,
          dep_notlp: "(021) 8430 4576  / 0812 8122 3800",
          dep_email: null,
          dep_website: "www.Damessa.id ",
          dep_img_logo: null,
          dep_status: "A"
        },
        hrEmployee: {
          emp_id: 1,
          dep_id: 1,
          emp_name: "Super Admin",
          emp_nip: "1",
          emp_address: "-",
          emp_place_of_birth: "-",
          emp_dob: 1625590800000,
          emp_nick_name: "Admin",
          emp_gender: "M",
          emp_religion: 1,
          emp_notlp: "-",
          emp_nohp: "-",
          emp_graduate: "-",
          emp_foto: "",
          emp_type_id: 7
        }
    }
]

// GET ALL DATA
mock.onPost('/api/v1/appresource/list').reply(config => {
  return [
    200,
    {
      code:  200,
      message: 'succes',
      result: data
    }
  ]
})

// POST: Add new user
mock.onPost('/api/v1/appresource/save').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data)

  const { length } = data
  let lastIndex = 0
  if (length) {
    lastIndex = data[length - 1].id
  }
  user.id = lastIndex + 1

  data.unshift(user)

  return [201, { user }]
})

// GET Updated DATA
mock.onPost('/api/v1/appresource/page').reply(config => {
  const { q = '', perPage = 10, page = 1, role = null, currentPlan = null, status = null } = config

  /* eslint-disable  */
  const queryLowered = q.toLowerCase()
  const filteredData = data.filter(
    user =>
      (user.appResource.username.toLowerCase().includes(queryLowered) || user.appResource.username.toLowerCase().includes(queryLowered))
  )
  /* eslint-enable  */

  return [
    200,
    {
      code:  200,
      message: 'succes',
      result: paginateArray(filteredData, perPage, page),
      element_total: filteredData.length
    }
  ]
})

// GET USER
mock.onGet('/api/users/user').reply(config => {
  const { id } = config
  const user = data.users.find(i => i.id === id)
  return [200, { user }]
})

// DELETE: Deletes User
mock.onDelete('/apps/users/delete').reply(config => {
  // Get user id from URL
  let userId = config.id

  // Convert Id to number
  userId = Number(userId)

  const userIndex = data.users.findIndex(t => t.id === userId)
  data.users.splice(userIndex, 1)

  return [200]
})
