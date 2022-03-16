import React from "react";
import {View, FlatList} from "react-native";
import StoryItem from "./StoryItem";

const StoryList = (props) => {

    const {
        data,
        handleStoryItemPress,
        // updateOffset
    } = props;

    function isCloseToBottom({layoutMeasurement, contentOffset, contentSize}){
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
    }

    return (
        <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={data}
                horizontal
                // onScroll={({nativeEvent})=>{
                //     console.log(nativeEvent);
                //     if(isCloseToBottom(nativeEvent)){
                //         //  this.scrollToEndNotified = true;
                //         //  this.loadMoreData();
                //         console.log('load more data');
                //     }
                // }}
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
    );

}

export default StoryList;
