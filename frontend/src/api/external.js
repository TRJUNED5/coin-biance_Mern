import axios from 'axios';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

//const NEWS_API_ENDPOINT = `https://newsapi.org/v2/everything?q=business AND blockchain&sortBy=publishedAt&language=en&apiKey=599cfb36d9144be28af907bb0a0d0a8c`;

const NEWS_API_ENDPOINT =
  'https://saurav.tech/NewsAPI/top-headlines/category/business/us.json';

const CRYPTO_API_ENDPOINT =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';

export const getNews = async () => {
  let response;

  try {
    response = await axios.get(NEWS_API_ENDPOINT);
    response = response.data.articles.slice(0, 15); // we want to show 15 articles
  } catch (error) {
    console.log(error);
  }

  return response;
};

export const getCrypto = async () => {
  let response;

  try {
    response = await axios.get(CRYPTO_API_ENDPOINT);
    response = response.data.slice(0, 15);
  } catch (error) {
    console.log(error);
  }
  return response;
};
