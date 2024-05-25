import { ScrollView, StatusBar } from 'react-native'
import {  Text, View } from 'react-native'
import { Link ,Redirect,Tabs,router} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import TabsLayout from './(tabs)/_layout'


import React from 'react'


export default function App () {
    // const {loading,isLogged } = useGlobalContext();
    // if(!loading && isLogged) return <Redirect href='/home'/>

    
    return (
       <SafeAreaView className = "h-full">
           <ScrollView contentContainerStyle={{height:'100%'}}>
                <View className='w-full items-center flex'>
                    <Text>This is index page</Text>
                    <Link href='/events' className='text-blue-700'>Go to events</Link>
                    <Link href='/floor' className='text-red-300 mt-5'>View Floor PLan</Link>
                    <Link href='/contact' className='text-red-300 mt-5'>Go to contact page</Link>
                </View>
           </ScrollView>
           
       </SafeAreaView>
    )
}

