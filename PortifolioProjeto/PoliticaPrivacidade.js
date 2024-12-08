import React from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';

export default function PoliticaPrivacidade({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Política de Privacidade</Text>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.text}>
          Sua privacidade é importante para nós. Esta política explica como coletamos, usamos e protegemos suas informações.
        </Text>
        <Text style={styles.subtitle}>1. Dados Coletados</Text>
        <Text style={styles.text}>
          Coletamos informações pessoais, como email, localização e dados das doações realizadas ou recebidas, para o funcionamento do aplicativo.
        </Text>
        <Text style={styles.subtitle}>2. Uso dos Dados</Text>
        <Text style={styles.text}>
          Seus dados serão usados apenas para:
          {'\n'}- Exibição de localização aproximada no mapa.
          {'\n'}- Comunicação entre doadores e receptores.
          {'\n'}- Melhoria do aplicativo.
        </Text>
        <Text style={styles.subtitle}>3. Segurança</Text>
        <Text style={styles.text}>
          Implementamos medidas de segurança para proteger suas informações contra acessos não autorizados.
        </Text>
        <Text style={styles.subtitle}>4. Seus Direitos</Text>
        <Text style={styles.text}>
          Você pode solicitar a exclusão ou alteração de seus dados a qualquer momento. Consulte nossas opções no aplicativo.
        </Text>
        <Text style={styles.subtitle}>5. Contato</Text>
        <Text style={styles.text}>
          Em caso de dúvidas, entre em contato conosco pelo email suporte@sharefood.com.
        </Text>
      </ScrollView>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
  scrollView: {
    marginBottom: 20,
  },
});
