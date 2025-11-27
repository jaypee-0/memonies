import {StyleSheet, ScrollView, View} from 'react-native'
import React from 'react'

interface Props {
    children: React.ReactNode
    style?: object
    contentContainerStyle?: object
    horizontal?: boolean
    persist?: 'always' | 'handled' | 'never'
}

const RNScrollView: React.FC<Props | any> = ({
    children,
    horizontal,
    style,
    contentContainerStyle,
    persist,
    ...props
}) => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps={persist ? persist : 'never'}
            horizontal={horizontal}
            style={style}
            contentContainerStyle={contentContainerStyle}
            {...props}
        >
            {children}
        </ScrollView>
    )
}

export default RNScrollView

const styles = StyleSheet.create({})
