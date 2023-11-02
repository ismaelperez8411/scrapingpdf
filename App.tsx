import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import Pdf from 'react-native-pdf';
import { useScrapingPDF } from './src/hooks/useScrapingPDF';

const DEFAULT_URL =
  'https://videokreitech.s3.us-west-2.amazonaws.com/informe+de+laboratorio.htm';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flexGrow: 1,
  };

  const { loading, error, data, handleError, removeExtraCharacters } =
    useScrapingPDF({
      url: DEFAULT_URL,
    });

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollView}>
        {!loading && error && (
          <Text style={styles.errorText}>
            [{error.name}] : {error.message}
          </Text>
        )}

        {loading && <ActivityIndicator color={'red'} size={'large'} />}

        {!loading && error === undefined && data !== undefined && (
          <>
            {data?.keys?.map((k, i) => (
              <View key={k} style={styles.rowData}>
                <Text style={{ flex: 1 }} key={k}>
                  {k}
                </Text>
                <Text style={{ flex: 1 }} key={data.values[i]}>
                  {data.values[i]}
                </Text>
              </View>
            ))}
            <View style={{ flex: 1 }}>
              {data.iframes.map((source, i) => {
                let src = removeExtraCharacters({ source });
                return (
                  <Pdf
                    trustAllCerts={false}
                    key={i}
                    source={{ uri: src, cache: true }}
                    // onLoadProgress={progress => console.log}
                    // onLoadComplete={(numberOfPages, filePath, size) => {
                    //   console.log(`Number of pages: ${numberOfPages}`);
                    // }}
                    // onPageChanged={(page, numberOfPages) => {
                    //   console.log(`Current page: ${page}`);
                    // }}
                    onError={error => {
                      handleError({ newError: error });
                    }}
                    onPressLink={uri => {
                      console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}
                  />
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'red',
    height: 200,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  rowData: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'gold',
    paddingVertical: 4,
    paddingHorizontal: 10,
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
