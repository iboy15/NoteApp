import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, View } from './Themed'

import { getParsedDate, height, width } from '../utils'
import { FontAwesome } from '@expo/vector-icons'
import useColorScheme from '../hooks/useColorScheme'

export default function NoteCard({
  onPress,
  body,
  title,
  color,
  created_at,
  is_favorite,
  setAsFavorite,
  archived,
}) {
  const colorScheme = useColorScheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.listItem, { backgroundColor: color }]}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body} numberOfLines={6}>
        {body}
      </Text>
      <View style={styles.bottomContainer}>

          <Text style={{ fontStyle: 'italic',top:7 }}>
            {getParsedDate(created_at)} {'\n'}
          </Text>
    
        <TouchableOpacity
          onPress={setAsFavorite}
          style={[
            styles.favoriteBtn,
            {
              backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
            },
          ]}
        >
          <FontAwesome
            name='heart'
            size={15}
            color={
              is_favorite
                ? '#d64161'
                : colorScheme === 'dark'
                ? 'white'
                : 'black'
            }
          />
        </TouchableOpacity>
        
      </View>
      {  archived &&  <View style={{flexDirection:'row',backgroundColor:'transparent',alignItems:'center'}}>
      <FontAwesome
            name='trash'
            size={15}
            color={
              colorScheme === 'dark'
                ? 'white'
                : 'black'
            }
          />
             <Text style={{ fontWeight: 'bold',fontSize:14,marginLeft:5}}>Archived</Text>
      </View>}
  
    </TouchableOpacity>
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
    width: width / 2 - 30,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginTop: 'auto',
    alignItems:'center',
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
