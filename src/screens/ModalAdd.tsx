import { StatusBar } from 'expo-status-bar'
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
} from 'react-native'
import { Text, View } from '../components/Themed'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import { height, width } from '../utils'
import { useState } from 'react'
import SnackBar from 'react-native-snackbar-component'
import useMain from '../hooks/useMain'

export default function ModalScreen() {
  const colorScheme = useColorScheme()
  const [title, setTitle] = useState<string>('Where does it come from?')
  const [body, setBody] = useState<string>(
    'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.'
  )
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const { onSave, snackbarText, showSnackbar, setShowSnackbar } = useMain()

  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors[colorScheme].tint,
        }}
      >
        <Text
          lightColor='rgba(255,255,255,0.8)'
          darkColor='rgba(0,0,0,0.8)'
          style={styles.title}
        >
          Edit
        </Text>
      </View>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={Colors[colorScheme].text}
        placeholder='Title'
        style={{
          height: 40,
          width: '90%',
          marginTop: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'gray',
          paddingHorizontal: 10,

          color: Colors[colorScheme].text,
        }}
      />
      <TextInput
        value={body}
        onChangeText={setBody}
        scrollEnabled
        placeholderTextColor={Colors[colorScheme].text}
        multiline={true}
        textAlignVertical='top'
        placeholder='Write something...'
        style={{
          height: height / 3,
          width: width - 40,
          marginTop: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'gray',
          paddingHorizontal: 10,
          paddingVertical: 20,
          color: Colors[colorScheme].text,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isFavorite ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor='#3e3e3e'
          onValueChange={() => setIsFavorite(!isFavorite)}
          value={isFavorite}
          style={{ marginTop: 20, marginLeft: 20 }}
        />
        <Text style={{ marginTop: 15, marginLeft: 10 }}>Set as Favorite</Text>
      </View>

      <TouchableOpacity
        onPress={() => onSave(isFavorite, title, body)}
        style={{
          backgroundColor: '#2f95dc',
          marginTop: 10,
          paddingHorizontal: 40,
          paddingVertical: 10,
          borderRadius: 10,
        }}
      >
        <Text style={styles.title}>Save</Text>
      </TouchableOpacity>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <SnackBar
        visible={showSnackbar}
        textMessage={snackbarText}
        actionHandler={() => {
          setShowSnackbar(false)
        }}
        actionText='OK'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
