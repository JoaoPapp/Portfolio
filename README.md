(Documentação ainda ocorrerá mudanças, esse não é a documentação final)
# Portfolio

# Capa

- **Título do Projeto**: Aplicativo de Doação de Alimentos com Geolocalização
- **Nome do Acadêmico**: João Pedro Papp
- **Curso**: Engenharia de Software

# Resumo

O projeto consiste no desenvolvimento de um aplicativo mobile para doações de alimentos, com base em geolocalização. O objetivo principal é facilitar o compartilhamento de alimentos excedentes entre doadores e receptores próximos, promovendo a redução do desperdício alimentar e apoiando comunidades locais. O aplicativo utiliza Firebase para autenticação e armazenamento de dados e APIs de geolocalização para mapear as doações.

# Introdução

O desperdício de alimentos é um dos grandes desafios globais, afetando tanto o meio ambiente quanto a sociedade. Estima-se que, anualmente, cerca de um terço de toda a produção mundial de alimentos é desperdiçada, ao mesmo tempo em que milhões de pessoas enfrentam a fome ou insegurança alimentar. O crescente problema do desperdício de alimentos se torna ainda mais alarmante em áreas urbanas e comunidades locais onde o excedente de alimentos muitas vezes não encontra um caminho eficiente para aqueles que mais precisam.

Com o avanço da tecnologia e a popularização dos dispositivos móveis, surge a oportunidade de utilizar ferramentas digitais para enfrentar esse problema de forma inovadora. Nesse contexto, o projeto Aplicativo de Doação de Alimentos com Geolocalização propõe uma solução prática e acessível, permitindo que doadores e receptores se conectem de maneira eficiente, promovendo a distribuição de alimentos excedentes dentro de comunidades locais.

O aplicativo tem como principal diferencial a utilização de geolocalização para facilitar a identificação de doações próximas, além de oferecer funcionalidades como o agendamento flexível de coleta e notificações em tempo real. O objetivo é criar uma plataforma que seja simples de usar, incentivando a participação ativa de doadores e receptores, contribuindo assim para a redução do desperdício e a construção de um ambiente mais sustentável e colaborativo.

Este projeto foi desenvolvido com foco em pequenas comunidades e áreas urbanas de médio porte, onde soluções existentes podem não atender plenamente as necessidades locais. Através de uma abordagem prática e escalável, o aplicativo visa impactar positivamente essas regiões, criando um fluxo constante de doações e evitando que alimentos sejam desperdiçados.

## 1. Descrição do Projeto

O Aplicativo de Doação de Alimentos com Geolocalização é uma plataforma mobile projetada para facilitar a conexão entre doadores e receptores de alimentos excedentes em pequenas comunidades e áreas urbanas. O aplicativo utiliza a geolocalização como um meio principal de mapear e exibir doações disponíveis nas proximidades do usuário, promovendo a redução do desperdício de alimentos e facilitando o acesso de pessoas em situação de insegurança alimentar.

A proposta do projeto é criar uma solução tecnológica acessível e intuitiva que permita aos doadores registrar alimentos não utilizados e aos receptores visualizarem, agendarem e coletarem esses alimentos de forma eficiente. Além disso, o aplicativo conta com notificações em tempo real, garantindo que os receptores sejam informados rapidamente sobre novas doações disponíveis.

O diferencial do projeto está em seu foco local, com a intenção de promover a solidariedade e o compartilhamento entre vizinhos, empresas e pequenos estabelecimentos, garantindo que alimentos não sejam desperdiçados. O sistema de agendamento de coleta torna o processo mais flexível, permitindo que doadores e receptores ajustem os horários de acordo com sua conveniência.

# Tecnologias utilizadas
## Frontend
* React Native: Framework para desenvolvimento mobile, usado para criar as interfaces e funcionalidades interativas do aplicativo.
* React Navigation: Biblioteca de navegação para React Native.
* Google Maps API: API de mapas que oferece visualização de mapas interativos e serviços de geolocalização.
* React Native Maps: Componente de mapa para React Native que usa o Google Maps.
* Geolocation API: API para obter a localização atual do usuário em tempo real.
* React Native Permissions: Biblioteca para solicitar permissões de acesso a recursos do dispositivo, como geolocalização.

  ## Backend
* Firebase Authentication: Serviço de autenticação oferecido pelo Firebase.
* Firebase Firestore: Banco de dados NoSQL em tempo real da plataforma Firebase.
* Firebase Cloud Messaging (FCM): Serviço de envio de notificações push da Firebase.
* Google Maps API (Geocoding e Places API): Além de renderizar mapas no front-end, também pode ser usada no back-end para transformar endereços em coordenadas geográficas (geocoding) ou para buscar lugares.
