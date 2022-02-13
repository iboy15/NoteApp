import { AntDesign } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { Text } from '../components/Themed'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import {useMain} from '../hooks/useMain'

const NoteDetail = () => {
  const { params } = useRoute()
  const colorScheme = useColorScheme()
  const [editable, setEditable] = useState(false)
  const [title, setTitle] = useState<string>(params.title || '')
  const [body, setBody] = useState<string>(params.body || '')
  const { onEdit, onDelete } = useMain()

  return (
    <View style={{ flex: 1, backgroundColor: params.color, padding: 20 }}>
      <TextInput
        editable={editable}
        style={[
          styles.title,
          {
            color: Colors[colorScheme].text,
            borderColor: editable ? Colors[colorScheme].text : params.color,
          },
        ]}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        numberOfLines={15}
        scrollEnabled
        textAlignVertical='top'
        multiline
        editable={editable}
        style={[
          styles.body,
          {
            color: Colors[colorScheme].text,
            borderColor: editable ? Colors[colorScheme].text : params.color,
          },
        ]}
        value={body}
        onChangeText={setBody}
      />
      <View style={styles.saveContainer}>
        {editable ? (
          <TouchableOpacity
            onPress={() => onEdit(title, body, params.index)}
            style={[
              styles.saveBtn,
              {
                backgroundColor: Colors[colorScheme].background,
              },
            ]}
          >
            <Text style={{ fontWeight: 'bold' }}>Save</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <View
          style={[
            styles.rightMenuContainer,
            {
              backgroundColor: Colors[colorScheme].background,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setEditable(!editable)}
            style={{ marginRight: 20 }}
          >
            <AntDesign
              name='edit'
              color={editable ? Colors.light.tint : Colors[colorScheme].text}
              size={24}
            />
            <Text
              style={[
                styles.editText,
                {
                  color: editable
                    ? Colors.light.tint
                    : Colors[colorScheme].text,
                },
              ]}
            >
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(params.index)}
            style={{ alignItems: 'center' }}
          >
            <AntDesign
              name='delete'
              color={Colors[colorScheme].text}
              size={24}
            />
            <Text style={{ marginTop: 5, fontSize: 12 }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default NoteDetail

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  body: {
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 5,
  },
  saveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveBtn: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    top: 10,
  },
  rightMenuContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  editText: {
    marginTop: 5,
    fontSize: 12,
  },
})
