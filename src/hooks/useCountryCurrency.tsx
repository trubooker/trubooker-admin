import { useState, useEffect } from "react";

interface CurrencyData {
  localCurrency: string;
  symbol: string;
  convertedAmount: number;
}

interface ExchangeRatesResponse {
  rates: {
    [key: string]: number;
  };
}

interface GeolocationResponse {
  results: Array<{
    components: {
      country: string;
    };
  }>;
}

interface PositionCoordinates {
  latitude: number;
  longitude: number;
}

interface CountryCurrencyMap {
  [key: string]: {
    code: string;
    symbol: string;
  };
}

// Country-currency mapping
const countryCurrencyMap: CountryCurrencyMap = {
  Ghana: { code: "GHS", symbol: "₵" }, // Ghanaian Cedi
  Nigeria: { code: "NGN", symbol: "₦" }, // Nigerian Naira
  Kenya: { code: "KES", symbol: "KSh" }, // Kenyan Shilling
  Rwanda: { code: "RWF", symbol: "FRw" }, // Rwandan Franc
  Egypt: { code: "EGP", symbol: "E£" }, // Egyptian Pound
};

// Replace with actual API URL and key
const EXCHANGE_API_URL =
  "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_cgsIacowiEPQqno7gY7OK0Eh2QrjpSQEcgiRdqty";
const GEOCODING_API_URL = "https://api.opencagedata.com/geocode/v1/json";

const useCountryCurrency = (amountInUSD: number): CurrencyData => {
  const [currencyData, setCurrencyData] = useState<CurrencyData>({
    localCurrency: "USD",
    symbol: "$",
    convertedAmount: amountInUSD,
  });

  // Fetch exchange rates
  const fetchExchangeRates = async (): Promise<{
    [key: string]: number;
  } | null> => {
    try {
      const response = await fetch(`${EXCHANGE_API_URL}&base=USD`);
      const data: ExchangeRatesResponse = await response.json();
      // console.log(data);
      return data.rates;
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      return null;
    }
  };

  // Fetch user's country from coordinates
  const fetchCountryFromCoordinates = async (
    latitude: number,
    longitude: number
  ): Promise<string | null> => {
    try {
      const response = await fetch(
        `${GEOCODING_API_URL}?q=${latitude}+${longitude}&key=YOUR_API_KEY`
      );
      const data: GeolocationResponse = await response.json();

      if (data.results.length > 0) {
        return data.results[0].components.country;
      }
      return null;
    } catch (error) {
      console.error("Error fetching country:", error);
      return null;
    }
  };

  useEffect(() => {
    const convertCurrency = async (
      currencyCode: string,
      amount: number
    ): Promise<number> => {
      const exchangeRates = await fetchExchangeRates();
      // console.log(exchangeRates);
      if (exchangeRates && exchangeRates[currencyCode]) {
        return amount * exchangeRates[currencyCode];
      }
      return amount; // Return original USD amount in case of an error
    };

    const getLocationAndCurrency = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position: GeolocationPosition) => {
            const { latitude, longitude }: PositionCoordinates =
              position.coords;
            const userCountry = await fetchCountryFromCoordinates(
              latitude,
              longitude
            );

            if (userCountry && countryCurrencyMap[userCountry]) {
              const { code, symbol } = countryCurrencyMap[userCountry];
              const convertedAmount = await convertCurrency(code, amountInUSD);
              setCurrencyData({
                localCurrency: code,
                symbol,
                convertedAmount,
              });
            } else {
              // Default to USD if country not found
              setCurrencyData({
                localCurrency: "USD",
                symbol: "$",
                convertedAmount: amountInUSD,
              });
            }
          },
          (error: GeolocationPositionError) => {
            console.error("Geolocation error:", error);
            // Default to USD on geolocation error
            setCurrencyData({
              localCurrency: "USD",
              symbol: "$",
              convertedAmount: amountInUSD,
            });
          }
        );
      } else {
        // Default to USD if geolocation is not supported
        setCurrencyData({
          localCurrency: "USD",
          symbol: "$",
          convertedAmount: amountInUSD,
        });
      }
    };

    getLocationAndCurrency();
  }, [amountInUSD]);

  return currencyData;
};

export default useCountryCurrency;
