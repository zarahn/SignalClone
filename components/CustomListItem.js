import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, ListItem} from "react-native-elements";
import {db} from '../firebaseConfig';

const CustomListItem = ({ id, chatName, enterChat }) => {
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const subscription = db.collection('chats').doc(id)
            .collection('messages').orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => setChatMessages(snapshot.docs.map(doc => doc.data())));
        return subscription;
    }, []);

    return (
        <ListItem key={id} bottomDivider
                  onPress={() => enterChat(id, chatName)}>
            <Avatar
                rounded
                source={{ uri: chatMessages?.[0]?.photoURL || 'https://img.icons8.com/ios-filled/452/signal-app.png' }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: 'bold' }}>{chatName}</ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipissMode='tail'>
                    {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );
};

const styles = StyleSheet.create({

});

export default CustomListItem;
