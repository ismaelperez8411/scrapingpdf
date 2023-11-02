import axios from 'axios';
import cheerio from 'cheerio';
import {useEffect, useState} from 'react';
import {removeCharacters} from '../../assets/removeChars';

export function useScrapingPDF({url}) {
  const keyTD = [];
  const valuesTD = [];
  const iframeUrls = [];

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      $('.td_header_role_name').each((index, elm) => {
        keyTD.push($(elm).text());
      });
      $('.td_header_role_value').each((index, elm) => {
        valuesTD.push($(elm).text());
      });

      $('iframe').each((index, elm) => {
        iframeUrls.push($(elm).attr('src'));
      });

      setData({keys: keyTD, values: valuesTD, iframes: iframeUrls});
      setLoading(false);
      setError();
      // console.log('IFRAMES ARRAY:', iframeUrls);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleError = ({newError}) => {
    console.log('New Error:', newError);
    setError(newError);
  };

  const removeExtraCharacters = ({source}) => {
    let src = source;
    removeCharacters.map(remText => {
      src = src.replace(remText, '');
    });
    return src;
  };

  useEffect(() => {
    getData();
    console.log('URL', url);
  }, [url]);

  return {loading, error, data, handleError, removeExtraCharacters};
}
