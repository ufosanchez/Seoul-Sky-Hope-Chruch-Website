import Welcome from "../components/home-components/Welcome";
import Beliefs from "../components/home-components/Beliefs";
import Ministries from "../components/home-components/Ministries";
import Events from "../components/home-components/Events";
import Map from "../components/Map";
import StayConnected from "../components/home-components/StayConnected";
import Form from "../components/home-components/Form";


export default function Home(){

    return(
        <>
            {/* WELCOME SECTION */}
            <Welcome />

            {/* BELIEFS SECTION */}
            <Beliefs />

            {/* MINISTRIES SECTION */}
            <Ministries />

            {/* EVENTS SECTION */}
            <Events />

            {/* MAP SECTION */}
            <Map />

            {/* STAY CONNECTED SECTION */}
            <StayConnected />

            {/* FORM SECTION */}
            <Form />
        </>
        
    );
}