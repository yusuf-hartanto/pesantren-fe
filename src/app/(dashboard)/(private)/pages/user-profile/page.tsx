'use client'

// React Imports
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react'

// Third-party Imports
import dynamic from 'next/dynamic'

import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'

// Type Imports
import type { Data } from '@/types/pages/profileTypes'

// Component Imports
import UserProfile from '@views/pages/user-profile'
import { getProfileData } from '@/app/server/actions'

// Redux Imports
import { useAppDispatch } from '@/redux-store/hook'
import { fetchUserByUsername } from '../../app/user/slice'

const statusOption = {
  values: [
    {
      label: 'Aktif',
      value: 'A'
    },
    {
      label: 'Nonaktif',
      value: 'D'
    },
    {
      label: 'Belum Verifikasi',
      value: 'NV'
    }
  ]
}

// Dynamic Tabs
const ProfileTab = dynamic(() => import('@views/pages/user-profile/profile'))

const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Data | null>(null)
  const [detail, setDetail] = useState<Data | null>(null)

  const username = session?.userdata?.username

  const setProfileData = useCallback(async (detailData: any) => {
    const profileData = await getProfileData()

    const getStatus = (status: any) => {
      return statusOption?.values.find((s: any) => s.value == status)?.label || status;
    }

    const getRole = (role: any) => {
      let r = '-'

      if (role && role.role_name) r = role?.role_name
      
      return r
    }

    const getDOB = (date: any) => {
      let d = '-'

      if (date) {
        d = new Date(date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      }
      
      return d
    }
    
    const getArea = (detail: any) => {
      if (!detail) return '-';

      const area = [];

      if (detail.regency) area.push(detail?.regency?.name);
      if (detail.province) area.push(detail?.province?.name);

      return area.join(', ');
    }

    if (profileData) {
      profileData.users.profile.about = [
        { property: 'Nama', value: detailData?.full_name || '-', icon: 'tabler-user' },
        { property: 'Username', value: detailData?.username || '-', icon: 'tabler-at' },
        { property: 'Status', value: getStatus(detailData?.status), icon: 'tabler-check' },
        { property: 'Role', value: getRole(detailData?.role), icon: 'tabler-lock-access' },
        { property: 'Tempat Lahir', value: detailData?.place_of_birth || '-', icon: 'tabler-map-pin' },
        { property: 'Tanggal Lahir', value: getDOB(detailData?.date_of_birth), icon: 'tabler-calendar' },
        { property: 'Alamat', value: getArea(detailData), icon: 'tabler-flag' },
      ];
      profileData.users.profile.contacts = [
        { property: 'Contact', value: detailData?.telepon || '-', icon: 'tabler-phone-call' },
        { property: 'Email', value: detailData?.email || '-', icon: 'tabler-mail' }
      ];
      profileData.profileHeader = {
        fullName: detailData?.full_name,
        location: getArea(detailData),
        joiningDate: getDOB(detailData?.created_date),
        role: detailData?.role && detailData?.role?.role_name,
        profileImg: detailData?.image_foto,
        coverImg: '/images/pages/faq-header.png',
      }

      setData(profileData)
    }
  }, [])

  // Fetch Profile
  useEffect(() => {
    if (!username) return

    const fetchProfile = async () => {
      try {
        setLoading(true)

        const res = await dispatch(fetchUserByUsername(username)).unwrap()

        if (res?.status) {
          setDetail(res.data)
          await setProfileData(res.data)
        } else {
          toast.error(res?.message || 'Gagal mengambil data profile')
        }
      } catch (error) {
        console.error(error)
        toast.error('Gagal mengambil data profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [dispatch, setProfileData, username])

  // Tab Content
  const tabContentList: { [key: string]: ReactElement } = useMemo(
    () => ({
      profile: <ProfileTab data={data?.users.profile} detail={detail} />,
    }),
    [data, detail]
  )

  return (
    <UserProfile
      data={data}
      loading={loading}
      tabContentList={tabContentList}
    />
  )
}

export default ProfilePage
