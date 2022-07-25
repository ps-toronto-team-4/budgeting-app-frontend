import { StyleSheet } from 'react-native';

const modalStyle = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: "center",
      marginVertical: '50%',
      marginHorizontal: '10%',
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      paddingBottom: 40,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    buttonView: {
      flexDirection: 'row',
      width: 250,
      justifyContent: 'space-between'
    },
    title: {
      fontSize: 26,
      // marginHorizontal: 25,
      marginBottom: '10%',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    text: {
      fontSize: 16,
      textAlign: 'center'
    },
    warning: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5
    }
  });

  export default modalStyle;