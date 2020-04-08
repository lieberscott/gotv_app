// https://medium.com/@lyzhovnik/using-stripe-payment-service-with-react-native-and-fetch-4177c8d992cb

import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';

import AddSubscriptionView from '../components/AddSubscriptionView';
const STRIPE_ERROR = 'Payment service error. Try again later.';
const SERVER_ERROR = 'Server error. Try again later.';
const STRIPE_PUBLISHABLE_KEY = 'Your Key';

const AddSubscription = ({ navigation }) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const votingAddress = null;
  const admin = false;

  useEffect(() => {
    console.log("Home screen!");
  }, []);

  const getCreditCardToken = (creditCardData) => {
  const card = {
    'card[number]': creditCardData.values.number.replace(/ /g, ''),
    'card[exp_month]': creditCardData.values.expiry.split('/')[0],
    'card[exp_year]': creditCardData.values.expiry.split('/')[1],
    'card[cvc]': creditCardData.values.cvc
  };
  return fetch('https://api.stripe.com/v1/tokens', {
    headers: {
      // Use the correct MIME type for your server
      Accept: 'application/json',
      // Use the correct Content Type to send data to Stripe
      'Content-Type': 'application/x-www-form-urlencoded',
      // Use the Stripe publishable key as Bearer
      Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`
    },
    // Use a proper HTTP method
    method: 'post',
    // Format the credit card data to a string of key-value pairs
    // divided by &
    body: Object.keys(card)
      .map(key => key + '=' + card[key])
      .join('&')
    }).then(response => response.json());
  };
  /**
   * The method imitates a request to our server.
   *
   */
  const subscribeUser = (creditCardToken) => {
    return new Promise((resolve) => {
      console.log('Credit card token\n', creditCardToken);
      setTimeout(() => {
        resolve({ status: true });
      }, 1000)
    });
  };

  onSubmit = async (creditCardInput) => {
    // Disable the Submit button after the request is sent
    setSubmitted(true);
    let creditCardToken;
    try {
      // Create a credit card token
      creditCardToken = await getCreditCardToken(creditCardInput);
      if (creditCardToken.error) {
        // Reset the state if Stripe responds with an error
        // Set submitted to false to let the user subscribe again
        setSubmitted(false);
        setError(STRIPE_ERROR);
        return;
      }
    } catch (e) {
      // Reset the state if the request was sent with an error
      // Set submitted to false to let the user subscribe again
      setSubmitted(false);
      setError(STRIPE_ERROR);
      return;
    }
    // Send a request to your server with the received credit card token
    const { error } = await subscribeUser(creditCardToken);
    // Handle any errors from your server
    if (error) {
      setSubmitted(false);
      setError(SERVER_ERROR);
    } else {
      setSubmitted(false);
      setError("");
      navigation.navigate('Home');
    }
  };

  return (
    <View style={ styles.view }>
      <AddSubscriptionView
        error={error}
        submitted={submitted}
        onSubmit={onSubmit}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: "80%",
    marginVertical: 8
  },
  view: {
    flex: 1,
    height: "100%",
    marginVertical: 50
  }
});

export default AddSubscription;
