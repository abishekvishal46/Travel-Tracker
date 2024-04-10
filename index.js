import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Abiworld",
  password: "postgres",
  port: 5432,
});

const app = express();
const port = 3000;

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  let countries_list = []
  const datas = await db.query("SELECT country_code FROM visited_countries");
  console.log(datas.rows);
  
  datas.rows.forEach(element => {
    console.log(typeof(element.country_code));
    countries_list.push(element.country_code);
    
  });
  console.log(countries_list);
  res.render("index.ejs",{ cou :countries_list,
    total: countries_list.length

  })
});
app.post("/add",async (req,res)=>{
   let data = req.body;
   
   const sql = await db.query('SELECT country_code FROM countries WHERE country_name = $1',[data.country]);
   
    const new_code = sql.rows[0].country_code;
    console.log(new_code);
    
    console.log(typeof(new_code));
    
  
    
      
        db.query('INSERT  INTO visited_countries (country_code) VALUES ($1)',[new_code]);
        return res.redirect("/");
        

      
      
    
    
});
 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
