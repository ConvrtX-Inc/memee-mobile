import React from "react";
import {View, FlatList} from "react-native";
import StoryItem from "./StoryItem";

const StoryList = (props) => {

    const {
        data,
        handleStoryItemPress
    } = props;

    return (
        <View>
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={data}
                horizontal
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => (
                    <StoryItem
                        handleStoryItemPress={() =>
                            handleStoryItemPress && handleStoryItemPress(item, index)
                        }
                        item={item}
                    />
                )}
            />
        </View>
    );

}

export default StoryList;
