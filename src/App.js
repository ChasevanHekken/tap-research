import React, { useState } from 'react';
import './App.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function App() {
  const rootURL = 'https://www.tapresearch.com/supply_api/surveys/offer';
  const apiToken = '9a7fb35fb5e0daa7dadfaccd41bb7ad1';
  const [invalidOffer, setInvalidOffer] = useState(null);
  const [hasOffer, setHasOffer] = useState(null);
  const [offerURL, setOfferURL] = useState('');
  const [minimumReward, setMinimumReward] = useState('');
  const [maximumReward, setMaximumReward] = useState('');
  const [currency, setCurrency] = useState('');

  function jsonp(user_identifier) {
    const head = document.querySelector('head');
    let script = document.createElement('script');
    script.src = encodeURI(`${rootURL}?api_token=${apiToken}&user_identifier=${user_identifier}&callback=testCallback`);
    script.async = true;

    head.appendChild(script);
  };

  window.testCallback = response => {
    const hasOffer = response['has_offer'];
    setHasOffer(hasOffer);

    if (hasOffer) {
      setOfferURL(response['offer_url']);
      setMinimumReward(response['message_hash']['min']);
      setMaximumReward(response['message_hash']['max']);
      setCurrency(response['message_hash']['currency']);
    };
  };

  const handleSubmit = (event) => {
    jsonp(event.target[0].value);

    event.preventDefault();
  };

  const handleChange = (event) => {
    const offer = event.target.value;

    if (offer.length > 32) {
      setInvalidOffer(true);
    } else if (offer.length < 32) {
      setInvalidOffer(false);
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        {typeof(hasOffer) !== "boolean" && (
          <Form className="survey-form" onSubmit={handleSubmit}>
            <h3>Get Survey</h3>
            <Form.Group controlId="formBasicUsername">
              <Form.Control onChange={handleChange} type="Username" placeholder="Enter username ..." />
            </Form.Group>
            {invalidOffer && (
              <Form.Text className="text-muted">
                Please enter a valid offer name less than 32 characters
              </Form.Text>
            )}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )}
        {hasOffer && (
          <div className="survey-form">
            <h3>Offer Details</h3>
            <a href={offerURL} target='_blank'>Take Survey</a>
            <p>Minimum Reward: {minimumReward}</p>
            <p>Maximum Reward: {maximumReward}</p>
            <p>Currency: {currency}</p>
          </div>
        )}
        {typeof(hasOffer) === "boolean" && !hasOffer && (
          <div className="survey-form">
            <h3>No Survey Available</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
