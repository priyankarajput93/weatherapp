import {View, StyleSheet, Text} from 'react-native';
import {GlobalStyles} from '../utils/Styles';

function ErrorView({heading, message}) {
  return (
    <View style={style.container}>
      <Text style={style.mainText}>{heading}</Text>
      <Text style={style.text}>{message}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: GlobalStyles.colors.error500,
    padding: 24,
  },
  mainText: {
    fontSize: 18,
    color: GlobalStyles.colors.error500,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: GlobalStyles.colors.error500,
  },
});
export default ErrorView;
