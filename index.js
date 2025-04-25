import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;
const base_url = "https://api.jikan.moe/v4/";
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get("/",async(req,res)=>{
    try{
        var result=await axios.get(base_url+"genres/anime");
        var genreList=result.data;
        res.render("index.ejs",{ 
            animeList:null,
            genres: genreList.data,
            //image:null,title:null,
            //score:null
        });
    }
    catch(error){
        console.error("Can't load genres:", error.message);
        res.status(500).send("Error loading genres.");
    }
})
app.post("/click", async (req, res) => {
  try {
    const genre=req.body.genre;
    const score=req.body.score;
    const search=req.body.search;
    let animeData=[];
    var result=await axios.get(base_url+"genres/anime");
    var genreList=result.data;
    let response;
    
    for(var page=1;page<=10;page++){
    if(genre){
    response = await axios.get(`${base_url}anime?genres=${genre}&order_by=score&sort=desc&limit=20&page=${page}`);
    
    }
    else if(search){
       response = await axios.get(base_url + `anime?q=${search}&order_by=score&sort=desc&limit=20&page=${page}`); 
    }
    else{
      response = await axios.get(`${base_url}anime?order_by=score&sort=desc&limit=20&page=${page}`);


    }
    // animeList.push(response.data.data);


    animeData = response.data.data;
    if(score){
    animeData=animeData.filter(anime=>anime.score&&(anime.score>score&&anime.score<=score+1));
    }
    if(animeData.length>0){
      break;
    }
    await sleep(2000)
  }
  res.render("index.ejs",{animeList:animeData,
    genres:genreList.data
  });
   //var animeData=animeList.filter(anime=>anime.score&&anime.score>score).slice(0,5);
    //console.log(animeData)

    // const topanime=animeData.data.length;
    //const rank=Math.floor(Math.random()*(animeData.data).length);
    //var title=animeData.data[rank].title;
    //var type=animeData.data.type
    //var image_src=animeData.data[rank].images?.jpg?.image_url;
    //var score = animeData.data[rank].score;
    // const genre=animeData.data.genres[0].name;
    // console.log(genre);
    // console.log(image_src);
    // console.log(type);

    
    
  } catch (error) {
    console.error("Can't load:", error.message);
    res.status(500).send("Error fetching anime data");
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
