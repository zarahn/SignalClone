import React, {useEffect, useLayoutEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar} from "react-native-elements";
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons';
import CustomListItem from "../components/CustomListItem";
import {auth, db} from "../firebaseConfig";

const HomeScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login');
        });
    };

    const enterChat = (id, chatName) => {
        navigation.navigate('Chat', {
            id,
            chatName,
        });
    };

    useEffect(() => {
        const subscription = db.collection('chats')
            .onSnapshot(snapshot => setChats(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            }))));
        return subscription;
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Signal',
            headerStyle: {backgroundColor: '#FAFAFA'},
            headerTitleStyle: {color: 'black'},
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={styles.headerLeft}>
                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={styles.headerRight}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name='camerao' size={24} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('AddChat')}>
                        <SimpleLineIcons name='pencil' size={24} color='black' />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, []);

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({ id, data: { chatName } }) => (
                    <CustomListItem
                        key={id}
                        id={id}
                        chatName={chatName}
                        enterChat={enterChat} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    headerLeft: {
        marginLeft: 20,
    },
    headerRight: {
        marginRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 80,
    }
});

export default HomeScreen;
