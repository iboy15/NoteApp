/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { ColorSchemeName, Pressable } from 'react-native'

import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import Archived from '../screens/Archived'
import ModalAdd from '../screens/ModalAdd'
import NoteDetail from '../screens/NoteDetail'

import Notes from '../screens/Notes'
import Favorite from '../screens/Favorite'
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from '../../types'
import LinkingConfiguration from './LinkingConfiguration'
import { MainProvider } from '../hooks/useMain'

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  )
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  return (
    <MainProvider>
      <Stack.Navigator>
        <Stack.Screen
          name='Root'
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Group
          screenOptions={{ presentation: 'modal', headerShown: false }}
        >
          <Stack.Screen name='ModalAdd' component={ModalAdd} />
          <Stack.Screen name='ModalDetail' component={NoteDetail} />
        </Stack.Group>
      </Stack.Navigator>
    </MainProvider>
  )
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>()

function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName='Notes'
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name='Notes'
        component={Notes}
        options={({ navigation }: RootTabScreenProps<'Notes'>) => ({
          title: 'Notes',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='sticky-note-o' color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('ModalAdd')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name='plus'
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name='Favorite'
        component={Favorite}
        options={{
          title: 'Favorite',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='heart-o' color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name='Archived'
        component={Archived}
        options={{
          title: 'Archived',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='trash-o' color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  )
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />
}
