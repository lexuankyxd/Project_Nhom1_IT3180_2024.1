import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/reduxFolder/reducerFolder/counterSlice'
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;  // Type cho state
export type AppDispatch = typeof store.dispatch;  


// Sample Code
// ----------------------------------------------------------------------------------
// import React from 'react';
// import { Provider, useDispatch, useSelector } from 'react-redux';
// import { store, RootState } from './store';
// import { increment, decrement } from './counterSlice';
// import { View, Text, Button, StyleSheet } from 'react-native';

// const Counter: React.FC = () => {
//   const count = useSelector((state: RootState) => state.counter.value);
//   const dispatch = useDispatch();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Count: {count}</Text>
//       <Button title="Increment" onPress={() => dispatch(increment())} />
//       <Button title="Decrement" onPress={() => dispatch(decrement())} />
//     </View>
//   );
// };

// export default function App() {
//   return (
//     <Provider store={store}>
//       <Counter />
//     </Provider>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   text: { fontSize: 24, marginBottom: 20 },
// });
// ----------------------------------------------------------------------------------