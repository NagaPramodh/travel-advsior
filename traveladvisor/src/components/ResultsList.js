import React, { useState, useEffect, createRef } from "react";
import {
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import PlaceCard from "./PlaceCard";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function ResultsList({
  type,
  setType,
  isLoading,
  childClicked,
  places,
  sliderValue,
  sliderEvent,
}) {
  const [elRefs, setElRefs] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setElRefs((refs) => {
      if (places.length > 0) {
        return Array(places.length)
          .fill()
          .map((_, index) => refs[index] || createRef());
      }
    });
  }, [places]);

  return (
    <div className={classes.container}>
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="type">Type:</InputLabel>
            <Select
              id="placeType"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="restaurants"> Restaurants</MenuItem>
              <MenuItem value="hotels"> Hotels</MenuItem>
              <MenuItem value="attractions"> Attractions</MenuItem>
            </Select>
          </FormControl>
          <Slider
            value={sliderValue}
            onChange={sliderEvent}
            step={1}
            min={1}
            max={5}
            height={40}
            style={{ width: "300px", height: 40 }}
          />
          Rating : {sliderValue}
          <Grid container spacing={3} className={classes.list}>
            {places.length > 0 ? (
              places?.map((place, index) => {
                return (
                  <Grid ref={elRefs[index]} key={index} item xs={12}>
                    <PlaceCard
                      selected={Number(childClicked) === index}
                      placeRef={elRefs[index]}
                      place={place}
                      key={index}
                    />
                  </Grid>
                );
              })
            ) : (
              <div style={{ marginTop: 30 }}>No results found</div>
            )}
          </Grid>
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 25,
  },
  formControl: {
    margin: 10,
    minWidth: 120,
    marginBottom: 30,
  },
  loading: {
    width: "100%",
    height: "600px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    height: "75vh",
    overflow: "auto",
  },
}));
