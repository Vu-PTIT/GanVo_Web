import '../assets/css/index.css';
import '../assets/css/asset.css';
import { Appointment } from './page/appointment';
import { Chat } from './page/chat';
import { BrowserRouter as  Routes, Route } from 'react-router-dom';
import { Connect } from './page/connect';
import { Profile } from './page/profile';
import {Sign_in} from './page/sign-in';
import {Sign_up} from './page/sign-up';
import {Complete_profile} from './page/complete-profile';

function App() {
    return (
        <Routes>
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="sign-in" element={<Sign_in />} />
            <Route path="sign-up" element={<Sign_up />} />
            <Route path="complete-profile" element={<Complete_profile />} />
        </Routes>
    )

}

export default App;