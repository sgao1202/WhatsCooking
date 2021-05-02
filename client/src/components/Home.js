import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "./Search";

const Home = () => {
  const url = "http://localhost:3001";
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(undefined);
  const [popularRecipes, setPopularRecipes] = useState(undefined);
  let li = null;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(url + "/search/" + searchTerm);
        console.log("users is:");
        console.log(data.users);
        console.log("recipes is:");
        console.log(data.recipes);
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
    async function fetchData() {
      try {
        const { data } = await axios.get(url + "/recipes/popular");
        // console.log(users);
        console.log(data);
        setPopularRecipes(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  if (searchTerm) {
    console.log("searchData is: ");
    console.log(searchData);
    li =
      searchData &&
      searchData.map((s) => {
        return <li key={s._id}>{s.title}</li>;
      });
  } else {
    console.log("setting popular recupes");
    li =
      popularRecipes &&
      popularRecipes.map((s) => {
        return <li key={s._id}>{s.title}</li>;
      });
  }

  if (loading) {
    return <div>loading...</div>;
  } else {
    return (
      <div>
        <p>This is the discovery page</p>
        <Search searchValue={searchValue}></Search>
        <br />
        <br />
        {li}
      </div>
    );
  }
};

export default Home;
