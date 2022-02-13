import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native'
import {  View } from '../components/Themed'
import {  RootTabScreenProps } from '../../types'
import { getColor, width } from '../utils'
import useColorScheme from '../hooks/useColorScheme'
import {useMain} from '../hooks/useMain'
import NoteCard from '../components/NoteCard'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect } from 'react'

export default function Favorite({ navigation }: RootTabScreenProps<'Notes'>) {
  const colorScheme = useColorScheme()
  const { getData, notesData, loading, setAsFavorite,needRefreshFavorite,setIsNeedRefreshFavorite } = useMain()

  useFocusEffect(
    useCallback(() => {
    console.log('needRefreshFavorite', needRefreshFavorite)
      if(needRefreshFavorite){
        getData()
        setIsNeedRefreshFavorite(false)
      }
    }, [needRefreshFavorite])
  ) 

  const filteredData = notesData?.length !=0 ?
  notesData.filter(item => !item.is_archived && item.is_favorite) :[]


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size='large' />
      ) : (
        <FlatList
          contentContainerStyle={{alignItems:'flex-start'}}
          style={{ width: '95%', }}
          onRefresh={getData}
          refreshing={loading}
          keyExtractor={(i, index) => index.toString()}
          numColumns={2}
          horizontal={false}
          data={filteredData}
          renderItem={({ item, index }) => {
            const color = getColor(colorScheme)
              return (
                <NoteCard
                  onPress={() =>
                    navigation.navigate('ModalDetail', {
                      ...item,
                      color,
                      index,
                    })
                  }
                  title={item.title}
                  body={item.body}
                  created_at={item.created_at}
                  is_favorite={item.is_favorite}
                  color={color}
                  setAsFavorite={()=>setAsFavorite(index)}
                />
              )
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  title: { fontWeight: 'bold', marginBottom: 5 },
  listItem: {
    width: width / 2 - 20,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginTop: 'auto',
  },
  favoriteBtn: {
    height: 28,
    width: 28,
    borderRadius: 19,

    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingLeft: 1,
  },
  body: { marginBottom: 10 },
})
