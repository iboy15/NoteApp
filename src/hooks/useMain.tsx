import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState, createContext, useContext } from 'react'
import { Keyboard } from 'react-native'
import { NoteData } from '../../types'
import { generateUUID } from '../utils'

export interface MainContextInterface {
  notesData: NoteData[]
  favoriteData: NoteData[]
  archiveData: NoteData[]
  loading: boolean
  snackbarText: string
  showSnackbar: boolean
  needRefreshAll: boolean
  needRefreshFavorite: boolean
  needRefreshArchive: boolean
  setIsNeedRefreshAll: ((fields:boolean) => void) 
  setIsNeedRefreshFavorite: ((fields:boolean) => void) 
  setIsNeedRefreshArchive: ((fields:boolean) => void) 
  getData: (() => Promise<void>) 
  onEdit: ((fields:editFields) => Promise<void>) 
  onSave: ((fields:saveFields) => Promise<void>) 
  onDelete: ((fields : deleteFields) => Promise<void>) 
  setAsFavorite: ((fields: favoriteFields) => Promise<void>) 
}

type favoriteFields = {
  id: string
  status:boolean
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
  index: number
  title: string
  body: string
}

export const MainContexts = createContext<MainContextInterface>({
  notesData: [],
  favoriteData:[],
  archiveData :[],
  loading: false,
  snackbarText: '',
  showSnackbar: false,
  needRefreshAll: false,
  needRefreshFavorite: false,
  needRefreshArchive: false,
  setIsNeedRefreshAll:  ()  => {},
  setIsNeedRefreshFavorite:()  => {},
  setIsNeedRefreshArchive: ()  => {},
  getData: async()  => {},
  onEdit:  async() => {},
  onSave:  async() => {},
  onDelete: async() => {},
  setAsFavorite: async() => {},
})

export const MainProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [notesData, setData] = useState<NoteData[]>([])
  const [favoriteData, setFavoriteData] = useState<NoteData[]>([])
  const [archiveData, setArchiveData] = useState<NoteData[]>([])
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
//GET DATA
  const getData = async () => {
    try {
      setLoading(true)
      const storedData = await AsyncStorage.getItem('data')
      const data  =JSON.parse(storedData)
      setData(data)

      //filter favorite data
      const filteredFavoriteData = data?.length !=0 ?
      data.filter(item => !item.is_archived && item.is_favorite) :[]
      setFavoriteData(filteredFavoriteData)
      //filter archived data
      setArchiveData(filteredFavoriteData)
      const filteredArchiveData = data?.length !=0 ?
      data.filter(item => item.is_archived ) :[]
      setArchiveData(filteredArchiveData)

      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  //SET AS FAVORITE
  const setAsFavorite = async ({id,status}: favoriteFields) => {
    setIsNeedRefreshFavorite(true)
    setIsNeedRefreshAll(true)
    const arr = notesData
    const newData = arr.map(obj =>
      obj.id === id ? { ...obj, is_favorite: !status } : obj
  );
    await AsyncStorage.setItem('data', JSON.stringify(newData))
    getData()
  }

  //SAVE DATA
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
//EDIT DATA
  const onEdit = async ({ title, body, index }: editFields) => {
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
//DELETE DATA
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
        favoriteData,
        archiveData,
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
    favoriteData,
    archiveData,
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
    favoriteData,
    archiveData,
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
