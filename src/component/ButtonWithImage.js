import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'

const ButtonWithImage = ({ img, title, onPress,  bgClrFirst, bgClrSecond, txtClr }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress}
            style={styles.buttonStyle}>
            <LinearGradient
                colors={[bgClrFirst, bgClrSecond]}
                style={{ height: 65, width: '100%', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems:'center', borderRadius: 32, }}
            >

                <Image
                    style={styles.tinyLogo}
                    source={img}
                />
                <Text style={{  textAlign: "center", fontFamily: 'OpenSans-SemiBold', fontSize: 16, color: txtClr}}>{title}</Text>

            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#FBC848',
        height: 65,
        width: '90%',
        marginTop: 30,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 32,
        elevation: 10,
        // flexDirection: 'row',
        alignItems: 'center'
    },
    buttonTitleStyle: {
        textAlign: "center",
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000000',
    },
    tinyLogo: {
        width: 30,
        height: 30,
        marginRight: '10%'

    },
})

export default ButtonWithImage;