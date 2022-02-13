import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState, createContext, useContext } from 'react'
import { Keyboard } from 'react-native'
import { NoteData } from '../../types'
import { generateUUID } from '../utils'

export interface MainContextInterface {
  notesData: NoteData[]
  loading: boolean
  snackbarText: string
  showSnackbar: boolean
  needRefreshAll: boolean
  needRefreshFavorite: boolean
  needRefreshArchive: boolean
  setIsNeedRefreshAll: ((fields:boolean) => void) | null
  setIsNeedRefreshFavorite: ((fields:boolean) => void) | null
  setIsNeedRefreshArchive: ((fields:boolean) => void) | null
  getData: (() => Promise<void>) | null
  onEdit: ((fields:editFields) => Promise<void>) | null
  onSave: ((fields:saveFields) => Promise<void>) | null
  onDelete: ((fields : deleteFields) => Promise<void>) | null
  setAsFavorite: ((fields: favoriteFields) => Promise<void>) | null
}

type favoriteFields = {
  index: number
}

type deleteFields = {
  index: number
}

type saveFields = {
  isFavorite: boolean
  title: string
  body: string
}

type editFields = {
  isFavorite: boolean
  title: string
  body: string
}

export const MainContexts = createContext<MainContextInterface>({
  notesData: [],
  loading: false,
  snackbarText: '',
  showSnackbar: false,
  needRefreshAll: false,
  needRefreshFavorite: false,
  needRefreshArchive: false,
  setIsNeedRefreshAll: null,
  setIsNeedRefreshFavorite: null,
  setIsNeedRefreshArchive: null,
  getData: null,
  onEdit: null,
  onSave: null,
  onDelete: null,
  setAsFavorite: null,
})

export const MainProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [notesData, setData] = useState<NoteData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [snackbarText, setSnackbarText] = useState<string>('')
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
  const [needRefreshAll, setIsNeedRefreshAll] = useState<boolean>(false)
  const [needRefreshFavorite, setIsNeedRefreshFavorite] =
    useState<boolean>(false)
  const [needRefreshArchive, setIsNeedRefreshArchive] = useState<boolean>(false)
  const navigation = useNavigation()

  useEffect(() => {
    getData()
  }, [])

  const removeAll = async () => {
    await AsyncStorage.removeItem('data')
  }

  const getData = async () => {
    try {
      setLoading(true)
      const data = await AsyncStorage.getItem('data')
      setData(JSON.parse(data))
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  const setAsFavorite = async (index: favoriteFields) => {
    setIsNeedRefreshFavorite(true)
    setIsNeedRefreshAll(true)
    const arr = notesData
    arr[index].is_favorite = !notesData[index].is_favorite
    await AsyncStorage.setItem('data', JSON.stringify(arr))
    getData()
  }

  const onSave = async ({ isFavorite, title, body }: saveFields) => {
    try {
      const data = {
        title: title,
        body: body,
        created_at: new Date(),
        id: generateUUID(),
        is_favorite: isFavorite,
        is_archived: false,
        update_at: null,
      }

      if (notesData !== null) {
        const arr = [...notesData, data]
        AsyncStorage.setItem('data', JSON.stringify(arr))
      } else {
        const arr = []
        arr.push(data)
        AsyncStorage.setItem('data', JSON.stringify(arr))
      }
      Keyboard.dismiss()
      setSnackbarText('Note saved')
      setShowSnackbar(true)
      setIsNeedRefreshAll(true)
      setIsNeedRefreshFavorite(true)
      setTimeout(() => {
        navigation.goBack()
      }, 500)
    } catch (error) {
      console.log(error)
      Keyboard.dismiss()
      setSnackbarText('Fail save notes')
      setShowSnackbar(true)
    }
  }

  const onEdit = async ({ isFavorite, title, body }: editFields) => {
    try {
      const arr = notesData
      arr[index] = {
        ...arr[index],
        title: title,
        body: body,
        updated_at: new Date(),
      }
      await AsyncStorage.setItem('data', JSON.stringify(arr))
      getData()
      Keyboard.dismiss()
      setSnackbarText('Note Edited')
      setShowSnackbar(true)
      setTimeout(() => {
        navigation.goBack()
      }, 500)
      setIsNeedRefreshAll(true)
      setIsNeedRefreshFavorite(true)
    } catch (error) {
      console.log(error)
      Keyboard.dismiss()
      setSnackbarText('Fail edit notes')
      setShowSnackbar(true)
    }
  }

  const onDelete = async (index: deleteFields) => {
    try {
      const arr = notesData
      arr[index].is_archived = true
      await AsyncStorage.setItem('data', JSON.stringify(arr))
      setSnackbarText('Note Deleted')
      setShowSnackbar(true)
      setTimeout(() => {
        navigation.goBack()
      }, 500)
      setIsNeedRefreshAll(true)
      setIsNeedRefreshFavorite(true)
      setIsNeedRefreshArchive(true)
    } catch (error) {
      console.log(error)
      setSnackbarText('Fail deleted notes')
      setShowSnackbar(true)
    }
  }

  return (
    <MainContexts.Provider
      value={{
        notesData,
        loading,
        getData,
        setAsFavorite,
        onSave,
        snackbarText,
        showSnackbar,
        onEdit,
        onDelete,
        needRefreshAll,
        needRefreshArchive,
        needRefreshFavorite,
        setIsNeedRefreshAll,
        setIsNeedRefreshArchive,
        setIsNeedRefreshFavorite,
      }}
    >
      {children}
    </MainContexts.Provider>
  )
}

export const useMain = () => {
  const {
    notesData,
    loading,
    getData,
    setAsFavorite,
    onSave,
    snackbarText,
    showSnackbar,
    onEdit,
    onDelete,
    needRefreshAll,
    needRefreshArchive,
    needRefreshFavorite,
    setIsNeedRefreshAll,
    setIsNeedRefreshArchive,
    setIsNeedRefreshFavorite,
  } = useContext(MainContexts)

  return {
    notesData,
    loading,
    getData,
    setAsFavorite,
    onSave,
    snackbarText,
    showSnackbar,
    onEdit,
    onDelete,
    needRefreshAll,
    needRefreshArchive,
    needRefreshFavorite,
    setIsNeedRefreshAll,
    setIsNeedRefreshArchive,
    setIsNeedRefreshFavorite,
  }
}
