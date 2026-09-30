import { BrowserRouter, Routes, Route } from "react-router-dom";

import AIAssistant from "../../screen/userScreen/ai_assistant";
import Budget from "../../screen/userScreen/budget";
import Explore from "../../screen/userScreen/explore";
import Home from "../../screen/userScreen/home";
import Notification from "../../screen/userScreen/notification";
import Saved from "../../screen/userScreen/saved";
import Trip from "../../screen/userScreen/trip";
import UserSideBar from "../../shared/components/UserSideBar";

function UserPage() {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen">
                <UserSideBar />

                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/saved" element={<Saved />} />
                        <Route path="/trips" element={<Trip />} />
                        <Route path="/budget" element={<Budget />} />
                        <Route path="/ai" element={<AIAssistant />} />
                        <Route path="/notifications" element={<Notification />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default UserPage;