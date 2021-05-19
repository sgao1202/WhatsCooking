import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Search from "./Search";
import { Link } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { Button, ListGroup, Card, Row, Col } from "react-bootstrap";
import { FaPlusCircle } from 'react-icons/fa';
import genericProfile from "../img/generic-user-profile.jpeg";
import {
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
    height: "130px",
    maxWidth: 250,
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
  leftElement: {
    float: "left",
    width: "80%",
  },
  rightElement: {
    float: "right",
    width: "20%",
  },
});

const Home = () => {
  const { baseUrl, currentUser, currentProfile } = useContext(AuthContext);
  const classes = useStyles();
  const url = "http://localhost:3001";
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(undefined);
  const [popularRecipes, setPopularRecipes] = useState(undefined);
  const [allRecipes, setAllRecipes] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  let li = null;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(url + "/search/" + searchTerm);
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

  useEffect(async () => {
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
    async function fetchUserBookmarks() {
      try {
        const userBookmarksData = await axios.get(
          `${baseUrl}/users/uid/${currentUser.uid}`
        );
        let userBookmarks = [];
        for (let i = 0; i < userBookmarksData.data.bookmarks.length; i++) {
          const recipeData = await axios.get(
            url + "/recipes/" + userBookmarksData.data.bookmarks[i]
          );
          let userBookmark = {
            id: recipeData.data._id,
            name: recipeData.data.title,
          };
          userBookmarks.push(userBookmark);
        }
        setUserBookmarks(userBookmarks);
      } catch (e) {
        console.log(e);
      }
    }
    fetchPopularData();
    fetchData();
    if(currentUser) {
      fetchUserBookmarks();
    }
  }, []);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const bookmarks =
    userBookmarks &&
    userBookmarks.map((bookmark) => {
      return (
        <ListGroup.Item action href={`/recipe/${bookmark.id}`}>
          {bookmark.name}
        </ListGroup.Item>
      );
    });

  const popularSearches =
    popularRecipes &&
    popularRecipes.map((s) => {
      return (
        <ListGroup.Item action href={`/recipe/${s._id}`}>
          {s.title} <span className="stats">({s.hits})</span>
        </ListGroup.Item>
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
                image={`${baseUrl}/images/${
                  s.picture ? s.picture : genericProfile
                }`}
                title="show image"
              />

              <CardContent>
                <Typography gutterBottom variant="h6" component="h3">
                  {s.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {s.description ? s.description : "No Summary"}
                  <span> ...More Info</span>
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
        <Search searchValue={searchValue}></Search>
        <div className={classes.leftElement}>
          <br />
          <br />
          <Grid container className={classes.grid} spacing={5}>
            {li}
          </Grid>
        </div>
        <div className={`${classes.rightElement}`}>
          {currentUser ? 
            <div className="mb-4">
                <Link className="pb-5" to="/newrecipe">
                  <Button><FaPlusCircle className="mb-1 mr-2"/>Create a Recipe</Button>
                </Link>
            </div> : ""
          }
          <Card className="mb-5" style={{ width: "18rem" }}>
            <Card.Header className="h3">Popular</Card.Header>
            <ListGroup variant="flush" className="shadow">{popularSearches}</ListGroup>
          </Card>
          {currentUser ? (
            <Card style={{ width: "18rem" }}>
              <Card.Header className="h3">Bookmarks</Card.Header>
              <ListGroup variant="flush">{bookmarks}</ListGroup>
            </Card>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
};

export default Home;
