//include required modules
const express = require("express");
const path = require("path");
const cors = require("cors"); //need this to set this API to allow requests from other servers
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
//this is used to import the ObjectId constructor from the mongodb  
const { ObjectId } = require('mongodb');
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")


dotenv.config();

const app = express();
const port = process.env.PORT || "3000";

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/`;
const client = new MongoClient(dbUrl);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //need this line to be able to receive/parse JSON from request

//allow requests from all servers
app.use(cors({
  origin: "https://seoul-sky-hope-church.vercel.app",
  credentials: true
}));

app.use(cookieParser())

// Configuración de multer para almacenar las imágenes subidas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG, PNG, GIF, MP4, MOV files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 50  // limit file size to 50MB
  }
});

app.use('/uploads', express.static('uploads')); // Servir los archivos estáticos de la carpeta uploads

//API endpoints

/* -------- REGISTRATION -------- */

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const db = await connection();
    
    const hash = await bcrypt.hash(password, 10);

    const newUser = { name, email, password: hash };

    const result = await db.collection("admins").insertOne(newUser);

    if (result.insertedCount === 0) {
      return res.status(500).json({ message: "Failed to create ministry." });
    }

    res.status(201).json({ message: "Ministry created successfully.", ministryId: result.insertedId });
  } catch (error) {
    console.error("Error creating ministry:", error);
    res.status(500).json({ message: "An error occurred while creating the ministry." });
  }
});

/* -------- LOG IN -------- */

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const db = await connection();

    // Buscar usuario por email
    const user = await db.collection("admins").findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Comparar la contraseña ingresada con la contraseña hasheada almacenada en la base de datos
    bcrypt.compare(password, user.password, (err, response) => {
      if(response){
        // Generar token JWT
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET_KEY, // Debes tener una variable de entorno para la clave secreta del JWT
          { expiresIn: '1d' } // Opcional: tiempo de expiración del token
        );
        
        console.log(token);
    
        res.cookie("skyhopechurchtoken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in production
          sameSite: 'None', // Ensure the cookie is sent with cross-site requests
          path: '/', // Adjust according to your path
        });
        
        return res.status(200).json({ message: "Login successful.", token });
      }
      else{
        return res.status(401).json({ message: "Invalid credentials." });
      }
    });    
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "An error occurred while logging in." });
  }
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.skyhopechurchtoken; 
  console.log("Token:", token); 

  if (!token) {
    console.log("Token is missing");
    return res.status(401).json({ message: "Token is missing" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("Invalid Token");
        return res.status(401).json({ message: "Invalid Token" });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};

app.get("/api/admin/dashboard", verifyUser, async (req, res) => {
  res.json({ message: "success access" });
});

/* -------- BASIC INFORMATION -------- */

// returns: an object with the basic information pf the church
app.get("/api/basicinfo", async (request, response) => {
  let basicinfo = await getBasicInfo();
  response.json(basicinfo); //send JSON object with appropriate JSON headers
});

app.get("/api/admin/basicinfo", verifyUser, async (request, response) => {
  let basicinfo = await getBasicInfo();
  response.json(basicinfo); //send JSON object with appropriate JSON headers
});

app.put('/api/basicinfo/update/submit', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  const { _id, name, beliefs_short, stay_connected, form, facebook, youtube, instagram, address, about_us, service_saturdays, service_sundays } = req.body;
  const { image, video } = req.files;

  if (!name || !beliefs_short || !stay_connected || !form || !facebook || !youtube || !instagram || !address || !about_us || !service_saturdays || !service_sundays) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const db = await connection();

    const updatedInfo = {
      name, beliefs_short, stay_connected, form, facebook, youtube, instagram, address, about_us, service_saturdays, service_sundays,
    };

    if (image) {
      updatedInfo.image = image[0].filename;
    }

    if (video) {
      updatedInfo.video = video[0].filename;
    }

    const result = await db.collection('basicinfo').updateOne({ _id: new ObjectId(_id) }, { $set: updatedInfo });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Basic information not found.' });
    }

    res.status(200).json({ message: 'Basic information updated successfully.' });
  } catch (error) {
    console.error('Error updating basic information:', error);
    res.status(500).json({ message: 'An error occurred while updating basic information.' });
  }
});

/* -------- MINISTRIES -------- */

// returns: an array of all the ministries
app.get("/api/ministries", async (request, response) => {
  let ministries = await getMinistries();
  response.json(ministries); //send JSON object with appropriate JSON headers
});

app.get("/api/admin/ministries", verifyUser, async (request, response) => {
  let ministries = await getMinistries();
  response.json(ministries); //send JSON object with appropriate JSON headers
});

// returns: a single object of the ministry found
app.get("/api/ministries/:id", async (request, response) => {
  let ministry = await getSingleMinistry(request.params.id);
  response.json(ministry); //send JSON object with appropriate JSON headers
});

// POST endpoint para crear un nuevo ministerio con imagen
app.post("/api/ministries/create/submit", upload.single('image'), async (req, res) => {
  const { ministry, slogan, description, leader } = req.body;
  const image = req.file;

  if (!ministry || !slogan || !description || !leader || !image) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const db = await connection();

    const newMinistry = { ministry, slogan, description, leader, image: image.filename
    };

    const result = await db.collection("ministries").insertOne(newMinistry);

    if (result.insertedCount === 0) {
      return res.status(500).json({ message: "Failed to create ministry." });
    }

    res.status(201).json({ message: "Ministry created successfully.", ministryId: result.insertedId });
  } catch (error) {
    console.error("Error creating ministry:", error);
    res.status(500).json({ message: "An error occurred while creating the ministry." });
  }
});

app.put("/api/ministries/update/submit", upload.single("image"), async (req, res) => {
  const { id, ministry, slogan, description, leader } = req.body;
  const image = req.file;

  if (!id || !ministry || !slogan || !description || !leader) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const db = await connection();

    const updatedMinistry = { ministry, slogan, description, leader,
    };

    if (image) {
      updatedMinistry.image = image.filename;
    }

    const result = await db.collection("ministries").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedMinistry }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Ministry not found." });
    }

    res.status(200).json({ message: "Ministry updated successfully." });
  } catch (error) {
    console.error("Error updating ministry:", error);
    res.status(500).json({ message: "An error occurred while updating the ministry." });
  }
});


// DELETE endpoint para eliminar un ministry
app.delete("/api/ministries/delete/submit", async (req, res) => {
  const { id } = req.body;

  try {
    const db = await connection();

    const result = await db.collection("ministries").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Ministry not found." });
    }

    res.status(200).json({ message: "Ministry deleted successfully." });
  } catch (error) {
    console.error("Error deleting ministry:", error);
    res.status(500).json({ message: "An error occurred while deleting the ministry." });
  }
});

/* -------- SERMONS -------- */

// returns: an array of all the sermons
app.get("/api/sermons", async (request, response) => {
  let sermons = await getSermons();
  response.json(sermons); //send JSON object with appropriate JSON headers
});

app.get("/api/admin/sermons", verifyUser, async (request, response) => {
  let sermons = await getSermons();
  response.json(sermons); //send JSON object with appropriate JSON headers
});

// returns: a single object of the sermon found
app.get("/api/sermons/:id", async (request, response) => {
  let sermon = await getSingleSermon(request.params.id);
  response.json(sermon); //send JSON object with appropriate JSON headers
});

// POST endpoint para crear un nuevo sermón
app.post("/api/sermons/create/submit", upload.single("image"), async (req, res) => {
  const { title, link_youtube, preacher, date, description, verses } = req.body;
  const image = req.file;

  // Validar que todos los campos estén presentes
  if (!title || !link_youtube || !preacher || !date || !description || !verses || !image) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const db = await connection(); // Conecta con tu base de datos

    const newSermon = { title, link_youtube, preacher, date: new Date(date), description, verses, image: image.filename
    };

    const result = await db.collection("sermons").insertOne(newSermon);

    if (result.insertedCount === 0) {
      return res.status(500).json({ message: "Failed to create sermon." });
    }

    res.status(201).json({ message: "Sermon created successfully.", sermonId: result.insertedId });
  } catch (error) {
    console.error("Error creating sermon:", error);
    res.status(500).json({ message: "An error occurred while creating the sermon." });
  }
});


// PUT endpoint para actualizar un sermón
app.put("/api/sermons/update/submit", upload.single("image"), async (req, res) => {
  const { id, title, link_youtube, preacher, date, description, verses } = req.body;
  const image = req.file;

  if (!id || !title || !link_youtube || !preacher || !date || !description || !verses) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const db = await connection();

    const updatedSermon = { title, link_youtube, preacher, date: new Date(date), description, verses,
    };

    if (image) {
      updatedSermon.image = image.filename;
    }

    const result = await db.collection("sermons").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedSermon }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Sermon not found." });
    }

    res.status(200).json({ message: "Sermon updated successfully." });
  } catch (error) {
    console.error("Error updating sermon:", error);
    res.status(500).json({ message: "An error occurred while updating the sermon." });
  }
});


// DELETE endpoint para eliminar un sermon
app.delete("/api/sermons/delete/submit", async (req, res) => {
  const { id } = req.body;

  try {
    const db = await connection();

    const result = await db.collection("sermons").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Sermon not found." });
    }

    res.status(200).json({ message: "Sermon deleted successfully." });
  } catch (error) {
    console.error("Error deleting sermon:", error);
    res.status(500).json({ message: "An error occurred while deleting the sermon." });
  }
});

/* -------- EVENTS -------- */

// returns: an array of all the events
app.get("/api/events", async (request, response) => {
  let events = await getEvents();
  response.json(events); //send JSON object with appropriate JSON headers
});

app.get("/api/admin/events", verifyUser, async (request, response) => {
  let events = await getEvents();
  response.json(events); //send JSON object with appropriate JSON headers
});

// returns: a single object of the event found
app.get("/api/events/:id", async (request, response) => {
  let event = await getSingleEvent(request.params.id);
  response.json(event); //send JSON object with appropriate JSON headers
});

// POST endpoint para crear un nuevo evento
app.post("/api/events/create/submit", upload.single("image"), async (req, res) => {
  const { name, start, end, short_description, description, organizer, location } = req.body;
  const image = req.file;

  // Validar que todos los campos estén presentes
  if (!name || !start || !end || !short_description || !description || !organizer || !location || !image) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const db = await connection();

    const newEvent = { name, start: new Date(start), end: new Date(end), short_description, description, organizer, location, image: image.filename
    };

    const result = await db.collection("events").insertOne(newEvent);

    if (result.insertedCount === 0) {
      return res.status(500).json({ message: "Failed to create event." });
    }

    res.status(201).json({ message: "Event created successfully.", eventId: result.insertedId });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "An error occurred while creating the event." });
  }
});

// PUT endpoint para actualizar un event
app.put("/api/events/update/submit", upload.single("image"), async (req, res) => {
  const { id, name, start, end, short_description, description, organizer, location } = req.body;
  const image = req.file;

  if (!id || !name || !start || !end || !short_description || !description || !organizer || !location) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const db = await connection();

    const updatedEvent = { name, start: new Date(start), end: new Date(end), short_description, description, organizer, location,
    };

    if (image) {
      updatedEvent.image = image.filename;
    }

    const result = await db.collection("events").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEvent }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event updated successfully." });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "An error occurred while updating the event." });
  }
});

// DELETE endpoint para eliminar un event
app.delete("/api/events/delete/submit", async (req, res) => {
  const { id } = req.body;

  try {
    const db = await connection();

    const result = await db.collection("events").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "An error occurred while deleting the event." });
  }
});

/* -------- STAFF -------- */

// returns: an array of all the staff
app.get("/api/staff", async (request, response) => {
  let staff = await getStaff();
  response.json(staff); //send JSON object with appropriate JSON headers
});

app.get("/api/admin/staff", verifyUser, async (request, response) => {
  let staff = await getStaff();
  response.json(staff); //send JSON object with appropriate JSON headers
});

// returns: a single object of the staff found
app.get("/api/staff/:id", async (request, response) => {
  let staff_single = await getSingleStaff(request.params.id);
  response.json(staff_single); //send JSON object with appropriate JSON headers
});

app.post("/api/staff/create/submit", upload.single("image"), async (req, res) => {
  const { people, charge } = req.body;
  const image = req.file;

  // Validar que todos los campos estén presentes
  if (!people || !charge || !image) {
    return res.status(400).json({ error: "People, charge, and image are required." });
  }

  try {
    const db = await connection();

    const newStaff = { people, charge, image: image.filename
    };

    const result = await db.collection("staff").insertOne(newStaff);

    res.status(201).json({ message: "Staff created successfully", staffId: result.insertedId });
  } catch (error) {
    console.error("Error inserting staff: ", error);
    res.status(500).json({ error: "An error occurred while creating the staff." });
  }
});


app.put("/api/staff/update/submit", upload.single("image"), async (req, res) => {
  const { id, people, charge } = req.body;
  const image = req.file;

  if (!id || !people || !charge) {
      return res.status(400).json({ message: "All fields are required." });
  }

  try {
      const db = await connection();

      const updatedStaff = { people, charge,
      };

      if (image) {
          updatedStaff.image = image.filename;
      }

      const result = await db.collection("staff").updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedStaff }
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Staff not found." });
      }

      res.status(200).json({ message: "Staff updated successfully." });
  } catch (error) {
      console.error("Error updating staff:", error);
      res.status(500).json({ message: "An error occurred while updating the staff." });
  }
});


// DELETE endpoint para eliminar un staff
app.delete("/api/staff/delete/submit", async (req, res) => {
  const { id } = req.body;

  try {
    const db = await connection();

    const result = await db.collection("staff").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Staff member not found." });
    }

    res.status(200).json({ message: "Staff member deleted successfully." });
  } catch (error) {
    console.error("Error deleting staff member:", error);
    res.status(500).json({ message: "An error occurred while deleting the staff member." });
  }
});

/* -------- BELIEFS -------- */

// returns: an array of all the beliefs
app.get("/api/beliefs", async (request, response) => {
  let beliefs = await getBeliefs();
  response.json(beliefs); //send JSON object with appropriate JSON headers
});

app.get("/api/admin/beliefs", verifyUser, async (request, response) => {
  let beliefs = await getBeliefs();
  response.json(beliefs); //send JSON object with appropriate JSON headers
});

// returns: a single object of the belief found
app.get("/api/beliefs/:id", async (request, response) => {
  let belief = await getSingleBelief(request.params.id);
  response.json(belief); //send JSON object with appropriate JSON headers
});

// Endpoint to create a new belief
app.post("/api/beliefs/create/submit", async (request, response) => {
  const { belief, description } = request.body;

  // Validar la entrada
  if (!belief || !description) {
    return response.status(400).json({ error: "Belief and description are required." });
  }

  try {
    db = await connection(); // Establecer conexión con la base de datos
    const result = await db.collection("beliefs").insertOne({ belief, description }); // Insertar el nuevo belief

    response.status(201).json({ message: "Belief created successfully", beliefId: result.insertedId });
  } catch (error) {
    console.error("Error inserting belief: ", error);
    response.status(500).json({ error: "An error occurred while creating the belief." });
  }
});

// PUT endpoint para actualizar un belief
app.put("/api/beliefs/update/submit", async (req, res) => {
  const { id, belief, description } = req.body;

  // Validar que todos los campos estén presentes
  if (!id || !belief || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    db = await connection();

    const result = await db.collection("beliefs").updateOne(
      { _id: new ObjectId(id) }, 
      { $set: { belief, description } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Belief not found." });
    }

    res.status(200).json({ message: "Belief updated successfully." });
  } catch (error) {
    console.error("Error updating belief:", error);
    res.status(500).json({ message: "An error occurred while updating the belief." });
  }
});

// DELETE endpoint para eliminar un belief
app.delete("/api/beliefs/delete/submit", async (req, res) => {
  const { id } = req.body;

  try {
    db = await connection();

    const result = await db.collection("beliefs").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Belief not found." });
    }

    res.status(200).json({ message: "Belief deleted successfully." });
  } catch (error) {
    console.error("Error deleting belief:", error);
    res.status(500).json({ message: "An error occurred while deleting the belief." });
  }
});

/* -------- SET UP SERVER LISTENING -------- */

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

/* ----------------------------------- */
/* ----------------------------------- */
/* ----------------------------------- */

/* -------- MONGODB FUNCTIONS -------- */

//MongoDB functions
async function connection() {
  await client.connect();
  db = client.db("seoulskyhopechurch"); //select seoulskyhopechurch database
  return db;
}

/* -------- BASIC INFORMATION -------- */

/* Async function to retrieve the basic information of the Seoul Sky Hope Church from basicinfo collection. */
async function getBasicInfo() {
    db = await connection(); //await result of connection() and store the returned db
    var result = db.collection("basicinfo").findOne({}); //{} as the query means no filter, so select all
    return result;
}

/* -------- MINISTRIES -------- */

/* Async function to retrieve all ministries documents from ministries collection. */
async function getMinistries() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("ministries").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to retrieve one ministry document from ministries collection. */
async function getSingleMinistry(id) {
  db = await connection(); // Await result of connection() and store the returned db
  const idMinistry = new ObjectId(id); // Create an instance of ObjectId
  const result = await db.collection("ministries").findOne({_id: idMinistry}); // Await the result of findOne()
  return result;
}

/* -------- SERMONS -------- */

/* Async function to retrieve all sermons documents from sermons collection. */
async function getSermons() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("sermons").find({}).sort({ date: -1 }); //{} as the query means no filter, so select all and order desc
  res = await results.toArray();
  return res;
}

/* Async function to retrieve one sermon document from sermons collection. */
async function getSingleSermon(id) {
  db = await connection(); // Await result of connection() and store the returned db
  const idSermon = new ObjectId(id); // Create an instance of ObjectId
  const result = await db.collection("sermons").findOne({_id: idSermon}); // Await the result of findOne()
  return result;
}

/* -------- EVENTS -------- */

/* Async function to retrieve all events documents from events collection. */
async function getEvents() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("events").find({}).sort({ start: -1 }); //{} as the query means no filter, so select all and order desc
  res = await results.toArray();
  return res;
}

/* Async function to retrieve one event document from events collection. */
async function getSingleEvent(id) {
  db = await connection(); // Await result of connection() and store the returned db
  const idEvent = new ObjectId(id); // Create an instance of ObjectId
  const result = await db.collection("events").findOne({_id: idEvent}); // Await the result of findOne()
  return result;
}

/* -------- STAFF -------- */

/* Async function to retrieve all staff documents from staff collection. */
async function getStaff() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("staff").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to retrieve one staff document from staff collection. */
async function getSingleStaff(id) {
  db = await connection(); // Await result of connection() and store the returned db
  const idStaff = new ObjectId(id); // Create an instance of ObjectId
  const result = await db.collection("staff").findOne({_id: idStaff}); // Await the result of findOne()
  return result;
}

/* -------- BELIEFS -------- */

/* Async function to retrieve all beliefs documents from beliefs collection. */
async function getBeliefs() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("beliefs").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to retrieve one belief document from beliefs collection. */
async function getSingleBelief(id) {
  db = await connection(); // Await result of connection() and store the returned db
  const idBelief = new ObjectId(id); // Create an instance of ObjectId
  const result = await db.collection("beliefs").findOne({_id: idBelief}); // Await the result of findOne()
  return result;
}