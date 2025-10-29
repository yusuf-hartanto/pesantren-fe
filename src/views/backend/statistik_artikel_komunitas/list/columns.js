import { convertToRupiah } from '@utils'

export const columns = (number, ability) => {
  return [
    {
      name: '#',
      cell: (row, index) => (index + 1) + number,
      grow: 0
    },
    {
      name: 'Provinsi',
      minWidth: '150px',
      selector: 'provinces',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.provinces}
        </div>
      )
    },
    {
      name: 'Kota / Kabupaten',
      minWidth: '200px',
      selector: 'regencies',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.regencies}
        </div>
      )
    },
    {
      name: 'Komunitas',
      minWidth: '200px',
      selector: 'komunitas_name',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {row.komunitas_name}
        </div>
      )
    },
    {
      name: 'Total',
      minWidth: '50px',
      selector: 'jumlah_article',
      sortable: false,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          {convertToRupiah(row.jumlah_article)}
        </div>
      )
    }
  ]
}
