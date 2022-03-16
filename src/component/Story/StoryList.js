import React from "react";
import {View, FlatList} from "react-native";
import StoryItem from "./StoryItem";

const StoryList = (props) => {

    const {
        data,
        handleStoryItemPress,
        updateOffset,
        storyOffset,
        storyPage,
        storyLimit,
        setAddStoryModalVisible
    } = props;

    return (
        <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={data}
            horizontal
            onEndReachedThreshold={0.1}
            onEndReached={() => {
                const mod = data.length % storyLimit;
                if (mod === 0) {
                    updateOffset(storyOffset, storyPage, storyLimit)
                }
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
                <StoryItem
                    handleStoryItemPress={() =>
                        handleStoryItemPress && handleStoryItemPress(item, index)
                    }
                    item={item}
                    index={index}
                    setAddStoryModalVisible={setAddStoryModalVisible}
                />
            )}
        />
    );

}

export default StoryList;
