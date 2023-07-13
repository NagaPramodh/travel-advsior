import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import MainHeader from "./components/MainHeader";
import { getPlacesDetails } from "./JS/actions/extAPI";
import ResultsList from "./components/ResultsList";
import LLMap from "./components/LLMap";
import FavoritesList from "./components/FavoritesList";
import { travelData } from "./data/data";
function App() {
  const [type, setType] = useState("restaurants");
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState(travelData);
  const [coords, setCoords] = useState({});
  const [bounds, setBounds] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [value, setValue] = useState(5);

  const [isViewingFavorites, setIsViewingFavorites] = useState(false);
  const [favoritesList, setfavoritesList] = useState([]);
  // Get favorites from localStorage
  useEffect(() => {
    const savedFavs = localStorage.getItem("Favorites");
    if (savedFavs) {
      const initialValue = JSON.parse(savedFavs);
      setfavoritesList(initialValue);
    }
  }, []);

  // Update localStorage
  useEffect(() => {
    localStorage.setItem("Favorites", JSON.stringify(favoritesList));
  }, [favoritesList]);

  // Add a new favorite to localStorage
  const AddPlaceToFavorites = (newPlace) => {
    let existingFavorites = [...favoritesList];
    let exists = existingFavorites.findIndex(
      (place) => place.address === newPlace.address
    );

    if (exists === -1) {
      existingFavorites.push(newPlace);
      setfavoritesList(existingFavorites);
    }
  };

  // Remove a favorite from localStorage
  const RemovePlaceFromFavorites = (place) => {
    let existingFavorites = [...favoritesList];
    let index = existingFavorites.indexOf(place);
    if (index > -1) {
      existingFavorites.splice(index, 1);
      setfavoritesList(existingFavorites);
    }
  };

  // Get places details
  useEffect(() => {
    if (bounds) {
      console.log(JSON.stringify(bounds));
      setIsLoading(true);
      getPlacesDetails(type, bounds?._northEast, bounds?._southWest)
        .then((data) => {
          if (value === 3) {
            setPlaces(
              data?.filter((place) => place.name && place.rating == 3.0)
            );
          } else if (value === 4) {
            setPlaces(
              data?.filter((place) => place.name && place.rating == 4.0)
            );
          } else if (value === 5) {
            setPlaces(
              data?.filter((place) => place.name && place.rating == 5.0)
            );
          } else {
            setPlaces(
              data?.filter((place) => place.name && place.num_reviews > 0)
            );
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [type, bounds, value]);

  // Get coords from child
  useEffect(() => {
    navigator?.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  const OnChangeEventTriggerd = (newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <CssBaseline />
      <MainHeader
        selected={childClicked}
        openFavorites={(open) => setIsViewingFavorites(open)}
        AddNewFav={AddPlaceToFavorites}
      />
      <Grid container style={{ width: "100%", height: "100%" }}>
        <Grid item xs={12} md={3}>
          {/* <Slider
            value={value}
            onChange={OnChangeEventTriggerd}
            step={1}
            min={1}
            max={5}
            style={{ width: "100px" }}
          />
          {value} */}
          <ResultsList
            type={type}
            setType={(type) => {
              setType(type);
            }}
            childClicked={childClicked}
            isLoading={isLoading}
            places={places}
            sliderEvent={OnChangeEventTriggerd}
            sliderValue={value}
          />
        </Grid>
        <Grid item xs={12} md={isViewingFavorites === false ? 9 : 6}>
          <LLMap
            coords={coords}
            places={places}
            setBounds={(bounds) => setBounds(bounds)}
            setCoords={(coordinates) => setCoords(coordinates)}
            setChildClicked={(child) => setChildClicked(child)}
          />
        </Grid>
        {isViewingFavorites && (
          <Grid item xs={12} md={3}>
            <FavoritesList
              setIsViewingFavorites={(open) => setIsViewingFavorites(open)}
              Data={favoritesList}
              RemoveItem={RemovePlaceFromFavorites}
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default App;
