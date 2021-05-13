import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Search from "./Search";
import { Link } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "100%",
    width: "100%",
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
});

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const url = "http://localhost:3001";
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(undefined);
  const [popularRecipes, setPopularRecipes] = useState(undefined);
  const [allRecipes, setAllRecipes] = useState([]);
  let li = null;
  let bookmarks = null;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(url + "/search/" + searchTerm);
        console.log("users is:");
        console.log(data.users);
        setLoading(false);
        setSearchData(data.recipes);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      fetchData();
    }
  }, [searchTerm]);

  useEffect(() => {
    async function fetchPopularData() {
      try {
        const { data } = await axios.get(url + "/recipes/popular");
        setPopularRecipes(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    async function fetchData() {
      try {
        const { data } = await axios.get(url + "/recipes");
        setAllRecipes(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchPopularData();
    fetchData();
  }, []);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const popularSearches =
    popularRecipes &&
    popularRecipes.map((s) => {
      return (
        <li key={s.id}>
          <Link to={`/series/${s.id}`}>{s.title}</Link>
        </li>
      );
    });

  const buildCard = (s) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={5} xl={2} key={s._id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`/recipe/${s._id}`}>
              <CardMedia
                className={classes.media}
                component="img"
                image={`${url}/images/${
                  s.picture ? s.picture : "no-image.jpeg"
                }`}
                title="show image"
              />

              <CardContent>
                <Typography gutterBottom variant="h6" component="h3">
                  {s.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {s.description ? s.description : "No Summary"}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    li =
      searchData &&
      searchData.map((s) => {
        return buildCard(s);
      });
  } else {
    li =
      allRecipes &&
      allRecipes.map((s) => {
        return buildCard(s);
      });
  }
  if (loading) {
    return <div>loading...</div>;
  } else {
    return (
      <div>
        <p>This is the discovery page</p>
        <div class="left-element">
          <Search searchValue={searchValue}></Search>
          <br />
          <br />
          <Grid container className={classes.grid} spacing={5}>
            {li}
          </Grid>
        </div>
        <div class="right-element">
          Popular:
          {popularSearches}
          <br />
          Bookmarks:
          {currentUser ? <div>logged in</div> : <div>Not logged in</div>}
        </div>
      </div>
    );
  }
};

export default Home;
