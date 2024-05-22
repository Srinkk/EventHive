import { Text, View, Image } from 'react-native'
import {Tabs, Redirect} from 'expo-router'
import icons from '../../constants/icons'

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className="items-center justify-center">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className={`px-7 py-3 mb-1 rounded-[10px] ${focused? "bg-[#FFAD65]/[0.48]":""} flex items-center  w-5 h-5`}
            />
            <Text 
                className={`${focused ? "" : ""}}`}
                style={{ color: color }}
            >
                {name}
            </Text>
        </View>
    )
}



const TabsLayout = () => {
  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '',
            tabBarInactiveTintColor: '',
            tabBarStyle: {
                backgroundColor: '#F3F3F3',
                borderTopWidth: 1,
                borderTopColor: '',
                height: 84
            }
        }}
    >
        <Tabs.Screen
            name="events"
            options={{ 
                title: 'Events',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon
                        icon={icons.event}
                        color={color}
                        name="Events"
                        focused={focused}
                    />
                ) 
            }}
        />
         <Tabs.Screen
            name="dms"
            options={{ 
                title: 'DMs',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon
                        icon={icons.dm}
                        color={color}
                        name="DMs"
                        focused={focused}
                    />
                ) 
            }}
        />
        <Tabs.Screen
            name="calendar"
            options={{ 
                title: 'Calendar',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon
                        icon={icons.calendar}
                        color={color}
                        name="Calendar"
                        focused={focused}
                    />
                ) 
            }}
        />
        <Tabs.Screen
            name="activities"
            options={{ 
                title: 'Activities',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon
                        icon={icons.activity}
                        color={color}
                        name="Activities"
                        focused={focused}
                    />
                ) 
            }}
        />
        
    </Tabs>
  )
}

export default TabsLayout