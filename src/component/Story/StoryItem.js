import React, {useState, useEffect, useRef} from "react";
import {View, Image, TouchableOpacity, Text, StyleSheet, Platform, ImageBackground} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Video from "react-native-video";

const StoryItem = props => {

    const {
        item
    } = props;

    const [isPressed, setIsPressed] = useState(props?.item?.seen);

    useEffect(() => {
        if (prevSeen != props?.item?.seen) {
            setIsPressed(props?.item?.seen);
        }

    }, [props?.item?.seen]);

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    const prevSeen = usePrevious(props?.item?.seen);

    const _handleItemPress = item => {
        const {handleStoryItemPress} = props;

        if (handleStoryItemPress) handleStoryItemPress(item);

        setIsPressed(true);
    };

    const { stories } = item;

    return (
        <View>
            {
                stories[0].story_video ? (
                    <TouchableOpacity style={{zIndex: 999}} onPress={() => _handleItemPress(item)}>
                        <LinearGradient
                                colors={['rgba(22, 22, 22, 0)', 'rgba(22, 22, 22, 1)']}
                                >
                                    <TouchableOpacity disabled>
                                        <View style={{backgroundColor: '#201E23', marginLeft: 7,  height: 160, width: 115, borderRadius: 15 }}>
                                        <Video
                                            repeat
                                            source={{ uri: item.stories.length && item.stories[0].story_image ? item.stories[0].story_image : item.stories[0].story_video }}
                                            resizeMode="stretch"
                                            style={{
                                                height: '100%',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                borderRadius: 15
                                            }}
                                        />
                                        <View style={{flex: 2.5, flexDirection: 'column'}}>
                                            <View style={{flex: 1, justifyContent: 'center'}}>
                                                <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'normal'}}></Text>       
                                            </View>           
                                            </View>
                                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                            <Image style={{width: 35, height: 35, borderWidth: 3, borderColor: 'white', borderRadius: 50}} source={{uri: item.user_image}} />
                                            </View>
                                            <View style={{marginBottom: 5, marginTop: 10}}>
                                            <Text style={{textAlign: 'center', color: 'white', fontSize: 16}}>{item.user_name}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                            </LinearGradient>
                    </TouchableOpacity>
                ) : stories[0].story_image && (
                    <TouchableOpacity onPress={() => _handleItemPress(item)}>
                        <LinearGradient
                                colors={['rgba(22, 22, 22, 0)', 'rgba(22, 22, 22, 1)']}
                                >
                                <View style={{backgroundColor: '#201E23', marginLeft: 7,  height: 160, width: 115, borderRadius: 15 }}>
                                    <ImageBackground
                                        source={{uri: item.stories.length && item.stories[0].story_image}}
                                        imageStyle={{borderRadius: 10, height: 160, width: 115}}
                                        // resizeMode="contain"
                                        style={{flex: 1, justifyContent: 'center', height: 160, width: 115}}
                                    >
                                        <View style={{flex: 2.5, flexDirection: 'column'}}>
                                        <View style={{flex: 1, justifyContent: 'center'}}>
                                            <Text style={{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'normal'}}></Text>       
                                        </View>           
                                        </View>
                                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                        <Image style={{width: 35, height: 35, borderWidth: 3, borderColor: 'white', borderRadius: 50}} source={{uri: item.user_image}} />
                                        </View>
                                        <View style={{marginBottom: 5, marginTop: 10}}>
                                        <Text style={{textAlign: 'center', color: 'white', fontSize: 16}}>{item.user_name}</Text>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </LinearGradient>
                    </TouchableOpacity>
                )
            }
        </View>
    );
}

export default StoryItem;

