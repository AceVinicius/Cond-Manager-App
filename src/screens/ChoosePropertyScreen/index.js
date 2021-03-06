import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useStateValue} from '../../contexts/StateContext';
import api from '../../services/api';
import styles from './style';

export default () => {
  const navigation = useNavigation();
  const [context, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPropertySel = async () => {
      let property = await api.getProperty();

      if (property) {
        property = JSON.parse(property);
        await handleChoosePropertyButton(property);
      }

      setLoading(false);
    };

    checkPropertySel();
  }, []);

  function handleChoosePropertyButton(property) {
    dispatch({
      type: 'setProperty',
      payload: {
        property: property,
      },
    });

    navigation.reset({
      index: 1,
      routes: [{name: 'MainDrawer'}],
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color="#8863E6" size="large" />
        </View>
      )}

      {!loading && (
        <ScrollView style={styles.scroller}>
          {context.user.user.properties.length === 0 && (
            <>
              <Text style={styles.title}>
                {context.user.user.name}, parabéns pelo cadastro!
              </Text>
              <Text style={styles.title}>
                Agora a administracao precisa liberar seu acesso.
              </Text>
            </>
          )}

          {context.user.user.properties.length > 0 && (
            <>
              <Text style={styles.title}>Olá {context.user.user.name}</Text>
              <Text style={styles.title}>Escolha uma de suas propriedades</Text>

              <View style={styles.propertyList}>
                {context.user.user.properties.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleChoosePropertyButton(item)}
                    style={styles.propertyListItem}>
                    <Text style={styles.propertyListItemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
