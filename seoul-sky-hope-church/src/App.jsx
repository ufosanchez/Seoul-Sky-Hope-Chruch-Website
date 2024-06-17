import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* User */
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import Home from './pages/Home';
import Ministries from './pages/Ministries';
import Sermons from './pages/Sermons';
import SermonDetails from './pages/SermonDetails';
import Bible from './pages/Bible';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Staff from './pages/Staff';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';

/* Admin */
import Dashboard from './pages/admin/Dashboard';
import SignUp from './pages/admin/SignUp';
import SignIn from './pages/admin/SignIn';

import BasicInfo from './pages/admin/BasicInfo/BasicInfo';

import AdminMinistries from './pages/admin/Ministry/Ministries';
import CreateMinistry from './pages/admin/Ministry/CreateMinistry';
import UpdateMinistry from './pages/admin/Ministry/UpdateMinistry';
import DeleteMinistry from './pages/admin/Ministry/DeleteMinistry';

import AdminSermons from './pages/admin/Sermon/Sermons';
import CreateSermon from './pages/admin/Sermon/CreateSermon';
import UpdateSermon from './pages/admin/Sermon/UpdateSermon';
import DeleteSermon from './pages/admin/Sermon/DeleteSermon';

import AdminEvents from './pages/admin/Event/Events';
import CreateEvent from './pages/admin/Event/CreateEvent';
import UpdateEvent from './pages/admin/Event/UpdateEvent';
import DeleteEvent from './pages/admin/Event/DeleteEvent';

import AdminStaff from './pages/admin/Staff/Staff';
import CreateStaff from './pages/admin/Staff/CreateStaff';
import UpdateStaff from './pages/admin/Staff/UpdateStaff';
import DeleteStaff from './pages/admin/Staff/DeleteStaff';

import AdminBeliefs from './pages/admin/Belief/Beliefs';
import CreateBelief from './pages/admin/Belief/CreateBelief';
import UpdateBelief from './pages/admin/Belief/UpdateBelief';
import DeleteBelief from './pages/admin/Belief/DeleteBelief';


function App() {
 

  return (
    <BrowserRouter>
      <NavBar />
      <main id='main'>
        <Routes>
          {/* User Pages */}
          <Route path='/' element={<Home />} />
          <Route path='/ministries' element={<Ministries />} />
          <Route path='/sermons' element={<Sermons />} />
          <Route path='/sermons/:id/details' element={<SermonDetails />} />
          <Route path='/bible' element={<Bible />} />
          <Route path='/events' element={<Events />} />
          <Route path='/events/:id/details' element={<EventDetails />} />
          <Route path='/staff' element={<Staff />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/not-found' element={<NotFound />} />

          {/* Admin Pages */}
          <Route path='/admin/dashboard' element={<Dashboard />} />
          {/* <Route path='/admin/signup' element={<SignUp />} /> */}
          <Route path='/admin/login' element={<SignIn />} />

          <Route path='/admin/basic-info/update' element={<BasicInfo />} />

          <Route path='/admin/ministries' element={<AdminMinistries />} />
          <Route path='/admin/ministries/create' element={<CreateMinistry />} />
          <Route path='/admin/ministries/:id/update' element={<UpdateMinistry />} />
          <Route path='/admin/ministries/:id/delete' element={<DeleteMinistry />} />

          <Route path='/admin/sermons' element={<AdminSermons />} />
          <Route path='/admin/sermons/create' element={<CreateSermon />} />
          <Route path='/admin/sermons/:id/update' element={<UpdateSermon />} />
          <Route path='/admin/sermons/:id/delete' element={<DeleteSermon />} />

          <Route path='/admin/events' element={<AdminEvents />} />
          <Route path='/admin/events/create' element={<CreateEvent />} />
          <Route path='/admin/events/:id/update' element={<UpdateEvent />} />
          <Route path='/admin/events/:id/delete' element={<DeleteEvent />} />

          <Route path='/admin/staff' element={<AdminStaff />} />
          <Route path='/admin/staff/create' element={<CreateStaff />} />
          <Route path='/admin/staff/:id/update' element={<UpdateStaff />} />
          <Route path='/admin/staff/:id/delete' element={<DeleteStaff />} />

          <Route path='/admin/beliefs' element={<AdminBeliefs />} />
          <Route path='/admin/beliefs/create' element={<CreateBelief />} />
          <Route path='/admin/beliefs/:id/update' element={<UpdateBelief />} />
          <Route path='/admin/beliefs/:id/delete' element={<DeleteBelief />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
