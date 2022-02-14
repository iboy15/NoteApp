import { ActivityIndicator, FlatList, StyleSheet } from 'react-native'
import { View } from '../components/Themed'
import { RootTabScreenProps } from '../../types'
import { getColor, width } from '../utils'
import useColorScheme from '../hooks/useColorScheme'
import { useMain } from '../hooks/useMain'
import NoteCard from '../components/NoteCard'
import { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'

export default function Notes({ navigation }: RootTabScreenProps<'Notes'>) {
  const colorScheme = useColorScheme()
  const {
    getData,
    notesData,
    loading,
    setAsFavorite,
    needRefreshAll,
    setIsNeedRefreshAll,
  } = useMain()

  useFocusEffect(
    useCallback(() => {
      if (needRefreshAll) {
        getData()
        setIsNeedRefreshAll(false)
      }
    }, [needRefreshAll])
  )

  //next task make data for each

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size='large' />
      ) : (
        <FlatList
          contentContainerStyle={{ alignItems: 'flex-start' }}
          style={{ width: '95%' }}
          onRefresh={getData}
          refreshing={loading}
          keyExtractor={(i, index) => index.toString()}
          numColumns={2}
          horizontal={false}
          data={notesData}
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
                  setAsFavorite={() => setAsFavorite(index)}
                  archived={item.is_archived}
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
