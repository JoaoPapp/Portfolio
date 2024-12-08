import React from 'react';
import { Text } from 'react-native';

const TextWrapper = ({ style, children }) => {
  const defaultStyle = { fontSize: 16, color: '#000' }; // Estilos padrão
  return <Text style={[defaultStyle, style]}>{children}</Text>;
};

export default TextWrapper;
