const { verifyTokenAndAdmin } = require("./verifytoken");

const router = require("express").Router();

router.post("/addartwork", verifyTokenAndAdmin, (req, res) => {
  const newArtwork = {
    artist_id: req.body.artist_id,
     price: req.body.price,
    category: req.body.category,
    img: req.body.img,
    description: req.body.description,
    size: req.body.size,
    title: req.body.title,
  };

  const query = `INSERT INTO ArtworkInformation(price,category,img,art_description,size,title,artist_id) VALUES
  (${newArtwork.price},'${newArtwork.category}','${newArtwork.img}','${newArtwork.description}','${newArtwork.size}','${newArtwork.title}',${newArtwork.artist_id});`;
  console.log(query);
  connection.query(query, (err) => {
    if (err) res.status(500).json(err);
    else res.status(200).json("New Artwork added...");
  });
});

//get artwork
router.get("/find/:id", (req, res) => {
  //const query = `SELECT * FROM ArtworkInformation where id = '${req.params.id}';`;
  const query = `SELECT  artworkinformation.*,ArtistInformation.artist_name 
  FROM artworkinformation  inner join  ArtistInformation
  where id='${req.params.id}' and artworkinformation.artist_id=ArtistInformation.artist_id;`;
  connection.query(query, (err, artwork) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(artwork);
  });
});

//get all artwork
router.get("/", (req, res) => {
  //console.log(req.query.category);
  if (req.query.category) {
    //const query = `SELECT * FROM ArtworkInformation where category = '${req.query.category}';`;
    const query = `SELECT  artworkinformation.*,ArtistInformation.artist_name 
    FROM artworkinformation  inner join  ArtistInformation
    where category='${req.query.category}' and artworkinformation.artist_id=ArtistInformation.artist_id;`;
    connection.query(query, (err, artwork) => {
      if (err) res.status(500).json(err);
      else res.status(200).json(artwork);
    });
  } else {
    const query = `SELECT artworkinformation.*,ArtistInformation.artist_name FROM ArtworkInformation 
    inner join  ArtistInformation
    where artworkinformation.artist_id=ArtistInformation.artist_id;`;
    connection.query(query, (err, artwork) => {
      if (err) res.status(500).json(err);
      else res.status(200).json(artwork);
    });
  }
});

//create newArtist
router.post("/addartist", verifyTokenAndAdmin, (req, res) => {
  const artist = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
  };

  let query = `SELECT artist_id ,email FROM ArtistInformation WHERE email ='${artist.email}';`;

  connection.query(query, (err, result) => {
    if (err) res.status(500).json(err);
    else if (result[0]) {
      res.status(200).json("artist already existy..");
    } else {
      query = `INSERT INTO ArtistInformation(artist_name,email,phone) VALUES ('${artist.name}','${artist.email}',${artist.phone});`;
      connection.query(query, (err) => {
        if (err) res.status(500).json(err);
        else {
          res.status(200).json("New artist added...");
        }
      });
    }
  });
});

//get artist
router.get("/findartist/:artist_id", verifyTokenAndAdmin, (req, res) => {
  const query = `SELECT * FROM ArtistInformation where artist_id = ${req.params.artist_id};`;
  connection.query(query, (err, artist) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(artist);
  });
});

router.get("/allartists", verifyTokenAndAdmin, (req, res) => {
  const query = `SELECT * FROM ArtistInformation;`;
  connection.query(query, (err, artists) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(artists);
  });
});

//update artist
router.put("/updateartist/:artist_id", verifyTokenAndAdmin, (req, res) => {
  const sql = `UPDATE ArtistInformation SET artist_name='${req.body.name}',email = '${req.body.email}',phone = '${req.body.phone}' WHERE artist_id='${req.params.artist_id}'`;
  // const sql=`UPDATE ArtistInformation SET artist_name= "james Bond",email = "james@gmail.com",phone = "23455533344" WHERE artist_id="1"`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.send("Artist Information Added Successfully ...");
    console.log(result);
    // if (err) res.status(500).json(err);
    // else res.send(result);
  });
});

//delete artist
router.delete("/delete/artist/:id", verifyTokenAndAdmin, (req, res) => {
  const artistId = +req.params.id;
  const query = `DELETE FROM ArtistInformation WHERE artist_id = '${artistId}';`;
  console.log(query);
  connection.query(query, (err) => {
    if (err) res.status(500).json(err);
    else res.status(500).json("Deleted Artist successfully....");
  });
});

//update artwork
router.put("/update/:id", verifyTokenAndAdmin, (req, res) => {
  const update = req.body;
  console.log(update);
  const query =
    `Update ArtworkInformation SET ` +
    Object.keys(update)
      .map((key) => `${key} = ${update[`${key}`]}`)
      .join(", ") +
    ` WHERE id = ${req.params.id};`;
  console.log(query);
  console.log(query);
  connection.query(query, (err) => {
    if (err) return res.status(500).json(err);
    else res.status(200).json("Artwork updated...");
  });
});


//delete artwork
router.delete("/delete/:id", verifyTokenAndAdmin, (req, res) => {
  const query = `DELETE FROM ArtworkInformation WHERE id = '${req.params.id}';`;
  //console.log(query);
  connection.query(query, (err) => {
    if (err) res.status(500).json(err);
    else res.status(500).json("Deleted Artwork successfully....");
  });
});

router.get('/findArtworkinformation/:id',  (req, res) => {
  // const aid=req.body.id;
  const query = `SELECT * FROM ArtworkInformation where id ='${req.params.id}';`;
  connection.query(query, (err, result) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(result);
  });
});



router.put('/addEvent', verifyTokenAndAdmin,(req,res)=>
{  
    const name=req.body.ename;
    const price=req.body.eprice;
    const description=req.body.edescription;
    const startdate=req.body.estartdate;
    const enddate=req.body.eenddate;
    const limit=req.body.elimit;
    const imagepath=req.body.eimagepath;
    console.log(name);

    const sql='INSERT INTO Exhibitions(exhi_name,from_date,to_date,exhi_description,exhi_img ,exhi_price,max_limit) values(?,?,?,?,?,?,?);';

   connection.query(sql,[name,startdate,enddate,description,imagepath,price,limit],(err,result)=>
    {
        if (err) throw err;
        res.send("Failure");
        console.log(result);
    })
});


router.get("/allorders", verifyTokenAndAdmin, (req, res) => {
  const query = `select order_items.order_id,orders.payment_id,
  order_items.totalprice as Amount,orders.delivery_status,
  (select date(payment_time) from payment where payment_id=orders.payment_id) as 'PurchaseDate',
  (select email from userlogin where id=orders.userid) as 'Email',
  (select title from artworkinformation where id=order_items.artwork_id) as 'Title',
  (select img from artworkinformation where id=order_items.artwork_id) as 'Image'
  from order_items 
  inner join orders where order_items.order_id=orders.order_id;`;
  connection.query(query, (err, orders) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(orders);
  });
});


router.get("/allpayments", verifyTokenAndAdmin, (req, res) => {
  const query = `select payment.payment_id,payment.amount,
  (select email from userlogin where id=payment.userid) as 'email',
  date(payment_time)  as 'paymentDate' ,
  (select count(artwork_id) from order_items where 
  order_id=(select order_id from orders where payment_id=payment.payment_id)) as 'number_Items'
  from payment; `;
  connection.query(query, (err, payments) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(payments);
  });
});



router.put("/updateArtwork/:id", verifyTokenAndAdmin, (req, res) => {
  const sql = `Update ArtworkInformation set title = '${req.body.title}', price = ${req.body.price}, 
  art_description = '${req.body.art_description}' where id = ${req.params.id}`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.send("Artist Information Added Successfully ...");
    console.log(result);
   });
});

router.get('/findEventsinformation/:exhi_id',  (req, res) => {
  // const aid=req.body.id;
  const query = `SELECT * FROM Exhibitions where exhi_id='${req.params.exhi_id}';`;
  connection.query(query, (err, result) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(result);
  });
});

router.put("/updateEvents/:exhi_id", verifyTokenAndAdmin, (req, res) => {
  const sql = `Update Exhibitions set exhi_name = '${req.body.exhi_name}', exhi_price = ${req.body.exhi_price}, exhi_description = '${req.body.exhi_description}' where exhi_id = '${req.params.exhi_id}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.send("Artist Information Added Successfully ...");
    console.log(result);
   });
});

router.get('/getcountUsers',  (req, res) => {
  const query = `SELECT count(userlogin.id) as 'usercount' FROM userlogin;`;
  connection.query(query, (err, result) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(result);
  });
});

router.get('/getnosoldart',  (req, res) => {
  const query = `SELECT count(artwork_id) as 'artcount' FROM order_items;`;
  connection.query(query, (err, result) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(result);
  });
});


router.put("/updateDelivery/:order_id", verifyTokenAndAdmin, (req, res) => {
  const sql = `Update orders set delivery_status = ${req.body.delivery_status} where order_id = '${req.params.order_id}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.send("Updated Successfully ...");
    console.log(result);
   });
});

router.delete("/delete/artist/:id", verifyTokenAndAdmin, (req, res) => {});

module.exports = router;
